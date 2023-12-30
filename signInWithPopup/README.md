# Firebase Auth - signInWithPopup

This recipe shows how to authorize Firebase via [signInWithPopup][1] in a Chrome extension with manifest v3

## Overview

There are a number of ways to authenticate using Firebase, some more complex than
others. `signInWithPopup` requires a popup to be displayed to your user.
Additionally, many Firebase authentication methods need to asyncronously load sub
dependencies. Manifest v3 extensions are required to package code they need to
run within their extension.

To get around these incompatibilities, our [service worker][3] connects to an
[offscreenDocument][2]. That document creates an iframe that connects to the
remote web service, which loads a compiled version of our [`signInWithPopup` wrapper][5]
directly from our extension. This would normally be blocked by the browser, but
we allow for this specific remote web service to connect to this specific file by
specifying [web_accessible_resources][6] in our manifest.json. Once the compiled
script has been loaded inside of the iframe, the firebase code is execute in the
context of the remote web service. As a result, it is no longer blocked by the
strict CORS rules used in Manifest v3.

As the firebase code executes, it will show the popup from signInWithPopup to
your user. Once they complete their login flow the iframe sends the authentication
results to the [offscreenDocument][4] via [postMessage][7]. The offscreenDocument
then repeats the same data to the service worker.

Note that this extension sets the [`key`][9] value in the manifest.json. This was
included to maintain the same extension ID across installations. This is
advantageous because it allows the [iframe that loads][10] the code to only load
our code in instances where it is triggered by our extension.
Additionally, this sample uses an external server. A demo of one is provided for testing
purposes, however you will need to update the code to be hosted on a server you
control if you decide to implement this in production. For convenience, the file
that is being hosted on the public server is being loded from this project.
However, as the generated file has code that is against the Chrome Web Store's
policies, you must not include them if you plan on uploading an extension to the
Chrome Web Store. You will need to host the file directly on a public web
server.

## Running this extension

1. Clone this repository.
1. Update firebaseConfig.js with your Firebase Config. This can be found on your
   Firebase dashboard.
1. Run `npm run compile:signInWithPopup`. This will package the a specific
   version of the Firebase client into a single file controlled by our
extension, rather than rely on an external service.
1. Ensure that `https://positive-fanatical-machine.glitch.me` is an "Authorized
   domain" in your [Firebase Authentication dashboard][8]
1. Load this directory in Chrome as an unpacked extension.
1. Open the Extension menu and click the extension named "Firebase Auth -
   signInWithPopup".
1. Open a console and run `let auth = await firebaseAuth()`


[1]: https://firebase.google.com/docs/reference/js/v8/firebase.auth.Auth#signinwithpopup
[2]: https://developer.chrome.com/docs/extensions/reference/offscreen/
[3]: ./service_worker.js
[4]: ./offscreen.html
[5]: ./signInWithPopup.js
[6]: https://developer.chrome.com/docs/extensions/mv3/manifest/web_accessible_resources/
[7]: https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage
[8]: https://console.firebase.google.com/project/_/authentication/settings
[9]: https://developer.chrome.com/docs/extensions/reference/manifest/key
[10]: https://glitch.com/edit/#!/positive-fanatical-machine?path=signInWithPopup.html
