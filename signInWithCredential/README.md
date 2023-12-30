# Firebase Auth - signInWithCredential

This recipe shows how to authorize Firebase via [signInWithCredential][1] in a Chrome extension with manifest v3

## Overview

TODO
TODO mention key being used
TODO mention redirect page (ohgdbokonfjidphalnfciennigpaiako.chromiumapp.org/)

## Running this extension

1. Clone this repository.
1. Update firebaseConfig.js with your Firebase Config. This can be found on your Firebase dashboard.
1. Run `npm run compile:signInWithCredential`. This will package the a specific version of the Firebase client into a single file controlled by our extension, rather than rely on an external service.

TODO
        1. Ensure that you have some kind of email based account in [Firebase Authenticated users][8]. The demo uses `user@example.com`:`password123`, you will want to update signInWithCredential.js valid user information if you are wanting to test it.
        1. Load this directory in Chrome as an unpacked extension.
        1. Click on the link in "Inspect views: service worker" to open Chrome Devtools for this extension
        1. Note that the User Credentials are logged to the console.

[1]: https://firebase.google.com/docs/reference/js/v8/firebase.auth.Auth#signinwithcredential
[8]: https://console.firebase.google.com/project/_/authentication/users
