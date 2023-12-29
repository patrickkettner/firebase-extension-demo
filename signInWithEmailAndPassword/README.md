# Firebase Auth - signInWithEmailAndPassword

This recipe shows how to authorize Firebase via [signInWithEmailAndPassword][1] in a Chrome extension with manifest v3

## Overview

There are a number of ways to authenticate using Firebase, some more complex than others.
signInWithEmailAndPassword is one of the more simple options. You just need to provide the username and
password to `signInWithEmailAndPassword` as strings. Note that you would never want to store a password
in plaintext. You should only ever request the string directly from the user, and then immediately
discard it once you have receieved the token response.

## Running this extension

1. Clone this repository.
1. Update firebaseConfig.js with your Firebase Config. This can be found on your Firebase dashboard.
1. Ensure that you have some kind of email based account in [Firebase Authenticated users][2]. The demo uses `user@example.com`:`password123`, you can either configure that in your Firebase console as a valid user, or update signInWithEmailAndPassword.js with a username and password that you want to test.
1. Run `npm run compile:signInWithEmailAndPassword`. This will package the a specific version of the Firebase client into a single file controlled by our extension, rather than rely on an external service.
1. Load this directory in Chrome as an unpacked extension.
1. Click on the link in "Inspect views: service worker" to open Chrome Devtools for this extension
1. Note that the User Credentials are logged to the console.

[1]: https://firebase.google.com/docs/reference/js/v8/firebase.auth.Auth#signinwithpopup
[2]: https://console.firebase.google.com/project/_/authentication/users
