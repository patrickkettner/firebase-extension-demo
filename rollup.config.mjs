import { existsSync } from 'fs';
import fetch from 'node-fetch';
import { env } from "node:process";


async function getLatestPackageVersions(packageName) {
  const response = await fetch(`https://registry.npmjs.org/${packageName}`);

  if (!response.ok) {
    throw new Error(`Failed to retrieve package versions. Status code: ${response.status}`);
  }

  const data = await response.json();
  const versions = Object.keys(data.versions).filter(v => v.match(/\d*\.\d*\.\d*$/));
  return versions?.pop();
}

const LATEST_VERSION = await getLatestPackageVersions('firebase');

const REMOTE_FIREBASE_URL = `https://www.gstatic.com/firebasejs/${LATEST_VERSION}`;

export default {
  plugins: [{
      transform: function transform(code, id) {
        // find references that are being imported locally (i.e. `require("./firebase/foo")`,
        // or as an installed module (`import {foo} from firebase/bar` ) and rewrite them to
        // be full remote URLs
        code = code.replace(/(\.\/)?(?:@?firebase\/)([a-zA-Z]+)/g, `${REMOTE_FIREBASE_URL}/firebase-$2.js`)

        // if a TOKEN is provided, replace it in the code
        code = code.replace(/\/\* TOKEN \*\//g, `"${env.signInWithCustomToken_CUSTOM_TOKEN}"`)
        return code
      },
      resolveDynamicImport: function(importee) {
        if (!existsSync(importee)) {
          return importee
        }
      },
      load: async function transform(id, options, outputOptions) {
        // this code runs over all of out javascript, so we check every import
        // to see if it resolves as a local file, if that fails, we grab it from
        // the network via fetch, and return the contents of that file directly inline
        if (!existsSync(id)) {
          const response = await fetch(id);
          const code = await response.text();

          return code
        }
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
