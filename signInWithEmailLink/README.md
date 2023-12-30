# Firebase Auth - signInWithEmailLink

This recipe shows how to authorize Firebase via [signInWithEmailLink][1] in a Chrome extension with manifest v3

## Overview

There are a number of ways to authenticate using Firebase, some more complex than others.
Before you can call `signInWithEmailLink` you must get the email address for the
user. Once yout have it, it can be passed with a callback url to [`sendSignInLinkToEmail`][3].
Firebase does not currently support `chrome-extension://` URIs for the callback
urls. Therefore we load a [web page from the remote server][4]. That page loads
the compiled output of [`signInWithEmailLink.js`][5], which checks to see if
this extension is installed. If it is _not_, then an error is displayed. If it
_is_, the it redirects to an html document bundeled with this extension
([`callback.html`][6]). Once that loads, we parse any query paramaters provided
from the OAuth flow, and call [`signInWithEmailLink`][1]. Once successfully
completed, the page is redirected back to [the callback page][6] hosted within
this extension.

Note that this sample uses an external server. A demo of one is provided for testing
purposes, however you will need to update the code to be hosted on a server you
control if you decide to implement this in production.

## Running this extension

1. Clone this repository.
1. Update firebaseConfig.js with your Firebase Config. This can be found on your
 [Firebase dashboard][2].
1. Ensure that `https://positive-fanatical-machine.glitch.me` is an "Authorized
domain" in your [Firebase Authentication dashboard][8]. This is the remote web
server we are using as a firebase context. This is only meant for testing, and
should not be used in production.
1. Update the `email` variable in signInWithEmailLink.js to the email you want
to be contacted.
1. Run `npm run compile:signInWithEmailLink`. This will package the a specific
version of the Firebase client into a single file controlled by our extension,
rather than rely on an external service.
1. Load this directory in Chrome as an unpacked extension.
1. Open the Extension menu and click the extension named
"Firebase Auth - signInWithEmailLink".

[1]: https://firebase.google.com/docs/reference/js/v8/firebase.auth.Auth#signinwithemaillink
[2]: https://console.firebase.google.com/project/_/settings/general/web
[3]: https://firebase.google.com/docs/auth/flutter/email-link-auth#send_an_authentication_link_to_the_users_email_address
[4]: https://glitch.com/edit/#!/positive-fanatical-machine?path=signInWithEmailLink.html
[5]: ./signInWithEmailLink.js
[6]: ./callback.html
[8]: https://console.firebase.google.com/project/_/authentication/settings
