# Firebase Auth - signInWithEmailLink

This recipe shows how to authorize Firebase via [signInWithEmailLink][1] in a Chrome extension with manifest v3

## Overview

There are a number of ways to authenticate using Firebase, some more complex than others.
Before you can call `signInWithEmailLink` we get the email address for the user. Once we have it, we pass that and a callback url to `sendSignInLinkToEmail`. Firebase does not support `chrome-extension://` URIs for the callback urls. Therefore we load a web page from the remote code server. That page checks to see if this extension is installed. If it is _not_, then an error is displayed. If it _is_, the we continue by redirecting to an html document bundeled with this extension (`callback.html`). Once that loads, we parse any query paremeters provided, and call `signInWithEmailLink`. Once successful, a welcome confirmation message is displayed.

## Running this extension

1. Clone this repository.
1. Update firebaseConfig.js with your Firebase Config. This can be found on your Firebase dashboard.
1. Run `npm run compile:signInWithEmailLink`. This will package the a specific version of the Firebase client into a single file controlled by our extension, rather than rely on an external service.
1. Ensure that `https://positive-fanatical-machine.glitch.me` is an "Authorized domain" in your [Firebase Authentication dashboard][8]. This is the remote web server we are using as a firebase context. This is only meant for testing, and should not be used in production.
1. Load this directory in Chrome as an unpacked extension.
1. Open the Extension menu and click the extension named "Firebase Auth - signInWithEmailLink".
1. Click on the extension's icon
1. Input a valid email address
1. Check your email
1. Click the link sent to your email

[1]: https://firebase.google.com/docs/reference/js/v8/firebase.auth.Auth#signinwithpopup
[8]: https://console.firebase.google.com/project/_/authentication/settings
