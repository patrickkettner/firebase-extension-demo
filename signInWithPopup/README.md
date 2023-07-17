# Firebase Auth - signInWithPopup

This recipe shows how to authorize Firebase via [signInWithPopup][1] in a Chrome extension with manifest v3

## Overview

There are a number of ways to authenticate using Firebase, some more complex than others.
`signInWithPopup` requires a popup to be displayed to your user. Additionally, many Firebase authentication methods need to asyncronously load sub dependencies. Manifest v3 extensions are required to package code they need to run within their extension. 

To get around these incompatibilities, our [service worker][3] connects to an [offscreenDocument][2]. That document creates an iframe that connects to the remote web service, which loads a compiled version of our [`signInWithPopup` wrapper][5] directly from our extension. This would normally be blocked by the browser, but we allow for this specific remote web service to connect to this specific file by specifying [web_accessible_resources][6] in our manifest.json. Once the compiled script has been loaded inside of the iframe, the firebase code is execute in the context of the remote web service. As a result, it is no longer blocked by the strict CORS rules used in Manifest v3.

As the firebase code executes, it will show the popup from signInWithPopup to your user. Once they complete their login flow the iframe sends the authentication results to the [offscreenDocument][4] via [postMessage][7]. The offscreenDocument then repeats the same data to the service worker.

## Running this extension

1. Clone this repository.
1. Update firebaseConfig.js with your Firebase Config. This can be found on your Firebase dashboard.
1. Run `npm run compile:signInWithPopup`. This will package the a specific version of the Firebase client into a single file controlled by our extension, rather than rely on an external service.
1. Ensure that `https://positive-fanatical-machine.glitch.me` is an "Authorized domain" in your [Firebase Authentication dashboard][8]
1. Load this directory in Chrome as an [unpacked extension][1].
1. Open the Extension menu and click the extension named "Firebase Auth - signInWithPopup".
1. Open a console and run `let {userCred} = await firebaseAuth()`

[1]: https://firebase.google.com/docs/reference/js/v8/firebase.auth.Auth#signinwithpopup
[2]: https://developer.chrome.com/docs/extensions/reference/offscreen/
[3]: ./service_worker.js
[4]: ./offscreen.html
[5]: ./signInWithPopup.js
[6]: https://developer.chrome.com/docs/extensions/mv3/manifest/web_accessible_resources/
[7]: https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage
[8]: https://console.firebase.google.com/project/_/authentication/settings
