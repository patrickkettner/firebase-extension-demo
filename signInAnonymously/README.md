# Firebase Auth - signInAnonymously

This recipe shows how to authorize Firebase via [signInAnonymously][1] in a Chrome extension with manifest v3

## Overview

There are a number of ways to authenticate using Firebase, some more complex than others.
signInAnonymously is one of the more simple options. The only requirement is that you have enabled
`Anonymous` as a provider in your [Firebase Sign-in providers Providers][2]. By calling signInAnonymously,
you will be able to

## Running this extension

1. Clone this repository.
1. Update firebaseConfig.js with your Firebase Config. This can be found on your Firebase dashboard.
1. Run `npm run compile:signInAnonymously`. This will package the a specific version of the Firebase client into a single file controlled by our extension, rather than rely on an external service.
1. Ensure that you have enabled `Anonymous` as a sign in provider in your [Firebase Sign-in providers Providers][2].
1. Load this directory in Chrome as an unpacked extension.
1. Click on the link in "Inspect views: service worker" to open Chrome Devtools for this extension
1. Note that the User Credentials are logged to the console.

[1]: https://firebase.google.com/docs/reference/js/v8/firebase.auth.Auth#signinwithpopup
[2]: https://console.firebase.google.com/project/_/authentication/users
