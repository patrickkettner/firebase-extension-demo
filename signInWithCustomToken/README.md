# Firebase Auth - signInWithCustomToken

This recipe shows how to authorize Firebase via [signInWithCustomToken][1] in a Chrome extension with manifest v3

## Overview

`signInWithCustomToken` allows you to sign in to Firebase with a custom JWT authentication token. This token would normally be already known in your extension. For demo purposes, one needs to be generated.
If you want to test with a known token value, then replace the comment "/* TOKEN */" with the value of your token. If you need to genrate a token, you must save a [JSON service key file][2] to your local device.
Once saved, set the path to that file as the environmental variable GOOGLE_APPLICATION_CREDENTIALS (e.g. run `export GOOGLE_APPLICATION_CREDENTIALS=/Users/Me/Desktop/keys.json` in your terminal).
 In order to proceed to the steps below, you ___must___ have repalced the `/* TOKEN */`, or set `GOOGLE_APPLICATION_CREDENTIALS`.

## Running this extension

1. Clone this repository.
1. Update firebaseConfig.js with your Firebase Config. This can be found on your Firebase dashboard.
1. Run `npm run compile:signInWithCustomToken`. This will package the a specific version of the Firebase client into a single file controlled by our extension, rather than rely on an external service.
1. Load this directory in Chrome as an unpacked extension.
1. Click on the link in "Inspect views: service worker" to open Chrome Devtools for this extension
1. Note that the User Credentials are logged to the console.

[1]: https://firebase.google.com/docs/reference/js/v8/firebase.auth.Auth#signinwithcustomtoken
[2]: https://cloud.google.com/iam/docs/keys-create-delete
