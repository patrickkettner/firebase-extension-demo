# Firebase Auth - signInWithRedirect

This recipe shows how to authorize Firebase via [signInWithRedirect][1] in a Chrome extension with manifest v3

## Overview

There are a number of ways to authenticate using Firebase, some more complex than others.

`signInWithRedirect` requires a popup to be displayed to your user. Additionally, many Firebase authentication methods need to asyncronously load sub dependencies. Manifest v3 extensions are required to package code they need to run within their extension.

To get around these incompatibilities, our [service worker][3] opens a new window using [chrome.windows][2]. That window loads a public website that actually executes the Firebase authentication flow, and then announces the results back to our extension via [web messaging][4]. When the [website][5] loads, the [content_script][6] [configured][7] in our manifest file is injected. That content script is executed in the [`MAIN` world][8]. This gets around the CSP restrictions that would normally break the code Firebase is using for signInWithRedirect. The script attempts to load any cached Firebase credentials using [getRedirectResult][9]. If it is found, it resolves the value straight away. If it is `null`, then it calls [signInWithRedirect][1]. Once the user authenticates, the value is serialized and messaged to the service worker.

Note that this extension sets the [`key`][9] value in the manifest.json. This was included to maintain the same extension ID across installations. This is advantageous because it allows the [iframe that loads][5] the code to only load our code in instances where it is triggered by our extension.

## Running this extension

1. Clone this repository.
1. Update firebaseConfig.js with your Firebase Config. This can be found on your Firebase dashboard.
1. Run `npm run compile:signInWithRedirect`. This will package the a specific version of the Firebase client into a single file controlled by our extension, rather than rely on an external service.
1. Ensure that `https://positive-fanatical-machine.glitch.me` is an "Authorized domain" in your [Firebase Authentication dashboard][10]. This is the remote web server we are using as a firebase context. This is only meant for testing, and should not be used in production.
1. Load this directory in Chrome as an [unpacked extension][1].
1. Open the Extension menu and click the extension named "Firebase Auth - signInWithRedirect".
1. Open a console and run `let auth = await firebaseAuth()`

[1]: https://firebase.google.com/docs/reference/js/v8/firebase.auth.Auth#signinwithredirect
[2]: https://developer.chrome.com/docs/extensions/reference/api/windows
[3]: ./service_worker.js
[4]: https://developer.chrome.com/docs/extensions/develop/concepts/messaging
[5]: https://glitch.com/edit/#!/positive-fanatical-machine?path=signInWithRedirect.html
[6]: https://developer.chrome.com/docs/extensions/reference/manifest/content-scripts
[7]: ./signInWithRedirect.js
[8]: https://developer.chrome.com/docs/extensions/reference/manifest/content-scripts#world-timings
[9]: https://firebase.google.com/docs/reference/js/v8/firebase.auth.Auth#getredirectresult

[10]: https://console.firebase.google.com/project/_/authentication/settings
