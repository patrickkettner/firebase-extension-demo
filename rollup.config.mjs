// Copyright 2023 Google LLC
// //
// // Licensed under the Apache License, Version 2.0 (the "License");
// // you may not use this file except in compliance with the License.
// // You may obtain a copy of the License at
// //
// //     https://www.apache.org/licenses/LICENSE-2.0
// //
// // Unless required by applicable law or agreed to in writing, software
// // distributed under the License is distributed on an "AS IS" BASIS,
// // WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// // See the License for the specific language governing permissions and
// // limitations under the License.

import fetch from 'node-fetch';
import { env } from "node:process";
import { existsSync, readFileSync } from 'fs';
import { generate } from 'astring';
import { walk } from 'estree-walker';

// Some of firebase is loaded from the CDN. This is not allowed in Manifest v3
// extensions hosted on the Chrome Web Store. So we update references to the
// latest version of Firebase hosted on NPM, later to be inlined into the build
// by Rollup.
async function getLatestPackageVersions(packageName) {
  const response = await fetch(`https://registry.npmjs.org/${packageName}`);

  if (!response.ok) {
    throw new Error(`Failed to retrieve package versions. Status code: ${response.status}`);
  }

  const data = await response.json();
  const versions = Object.keys(data.versions).filter(v => v.match(/\d*\.\d*\.\d*$/));
  return versions?.pop();
}

const LATEST_FIREBASE_VERSION = await getLatestPackageVersions('firebase');

const REMOTE_FIREBASE_URL = `https://www.gstatic.com/firebasejs/${LATEST_FIREBASE_VERSION}`;

// For some cases Firebase always includes reCaptcha, even though it is not used
// for most auth flows. This is a problem becuase reCaptcha must be loaded from
// the CDN - it cannot be bundled.
// While you could load the code via an iframe or web document, that complicates
// the build. So in cases where reCaptcha is not used, we remove the code from
// the generated Firebase code by modifying the AST.
function removeLoadJS(originalAST) {
  const ast = walk(originalAST, {
    enter: function(node, parent, prop, index) {
      if ((node.type === 'FunctionDeclaration' && node.id.name === '_loadJS')
        ||
        (node.type === 'ExpressionStatement' && node.expression?.callee?.object?.callee?.object?.callee?.name === '_loadJS')
      ) {
        this.remove();
      }
    }
  })

  return generate(ast);
}

export default {
  plugins: [
    {
      transform: function transform(code, id) {
        // find references that are being imported locally (i.e. `require("./firebase/foo")`,
        // or as an installed module (`import {foo} from firebase/bar` ) and rewrite them to
        // be full remote URLs
        code = code.replace(/(\.\/)?(?:@?firebase\/)([a-zA-Z]+)/g, `${REMOTE_FIREBASE_URL}/firebase-$2.js`)

        if (env.AUTH_BUILD === 'signInWithCustomToken') {
          // This is only ran when building the signInWithCustomToken
          // If a TOKEN is provided (via process.env.signInWithCustomToken_CUSTOM_TOKEN), replace it in the code
          // env.signInWithCustomToken_CUSTOM_TOKEN is set in the scripts portion of package.json
          code = code.replace(/\/\* TOKEN \*\//g, `"${env.signInWithCustomToken_CUSTOM_TOKEN}"`)
        } else if (env.AUTH_BUILD === 'signInWithEmailAndPassword' || env.AUTH_BUILD === 'signInWithEmailLink') {
          // This is only ran when building the signInWithEmailAndPassword or signInWithEmailLink
          // As of time of writing, the Firebase SDK automatically includes reCaptcha when using
          // these methods, despite them not being needed most of the time. As such, we just
          // update the AST to remove the reCaptcha code being loaded. See the comments 
          // on the removeLoadJS function for more details.
          code = removeLoadJS(this.parse(code));
        }

        return code
      },
      resolveDynamicImport: function(importee) {
        if (!existsSync(importee)) {
          return importee
        }
      },
      load: async function transform(id, options, outputOptions) {
        // this code runs over all of out javascript, so we check every import
        // to see if it resolves as a local file, if that fails, we see if it is
        // resolvable via node's imports using import.meta.resolve. If it is, we
        // return the contents of that file. If it isn't, then we attempt to
        // grab it from the network via fetch, and return the contents of that
        // file directly inline
        if (!existsSync(id)) {
          if (!id.startsWith('http') && !id.startsWith('.') && !id.startsWith('/')) {
            // the id does not seem to be a local file, or a remote URL. So we try
            // to resolve it via node's import.meta.resolve
            const module = new URL(import.meta.resolve(id)).pathname
            if (existsSync(module)) {
              // `id` resolves to a node module, so we return the resolved file
              return readFileSync(module, 'utf8')
            }
          } else {
            // `id` appears to be a remote URL, or local relative path.
            // We attempt to fetch it
            const response = await fetch(id);
            const code = await response.text();

            return code
          }
        }
        // if we get here, we were unable to resolve the import, so we return
        // null to let other plugins handle it
        return null
      }
    },
    {
      resolveId: function(importee, importer, options) {
        if (!importer) {
          return null
        }
        return importee
      }
    }
  ],
  output: {
    inlineDynamicImports: true
  }
};
