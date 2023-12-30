# Firebase Auth - signInWithPhoneNumber

This recipe shows how to authorize Firebase via [signInWithPhoneNumber][1] in a Chrome extension with manifest v3

## Overview

There are a number of ways to authenticate using Firebase, some more complex than
others. signInWithPhoneNumber is moderately complex. In order for it to work, you
must host a public webpage that acts as a proxy for the extension. This is because
Firebase requires the use of [reCaptcha][2] when you use signInWithPhoneNumber,
and reCaptcha only functions when loaded from their CDN. Since Manifest v3
extensions hosted on the Chrome Web Store are not allowed to use remotely hosted
code, you need to run the code inside of an iframe or entire new Chrome window,
and then [message][3] the result back to your [service worker][4].
How it works specifically is that the service worker has an asyncronous function
called `firebaseAuth`. This will open a new Chrome window that loads our
[proxied page][5]. This extension has the compiled version of [signInWithPhoneNumber.js][6]
as a content script, which will be automatically injected into that window once
it has opened. signInWithPhoneNumber.js will geenrate a `div` for a container for
reCaptcha, appends it into the document, and initiates [signInWithPhoneNumber][1].
The browser will prompt you for a phone number. You will need to then complete
the reCaptcha challenge. After successfully being completed, the phone number you
provided should recieve an SMS message with a verification code. You will get
another prompt asking for that code. Once you successfully submit that code, the
credentials will be resolved back to our service worker via an [externally connectable message][7].

Note that this extension sets the [`key`][9] value in the manifest.json. This was
included to maintain the same extension ID across installations. This is advantageous
because it allows the [iframe that loads][10] the code to only load our code in
instances where it is triggered by our extension.
Additionally, this sample uses an external server. A demo of one is provided for testing
purposes, however you will need to update the code to be hosted on a server you
control if you decide to implement this in production. For convenience, the file
that is being hosted on the public server is being loded from this project.
However, as the generated file has code that is against the Chrome Web Store's
policies, you must not include them if you plan on uploading an extension to the
Chrome Web Store. You will need to host the file directly on a public web server.

## Running this extension

1. Clone this repository.
1. Update firebaseConfig.js with your Firebase Config. This can be found on your Firebase dashboard.
1. Enable Phone as a Sign-in provider in your [Firebase Console][8]
1. Run `npm run compile:signInWithPhoneNumber`. This will package the a specific version of the Firebase client into a single file controlled by our extension, rather than rely on an external service.
1. Load this directory in Chrome as an unpacked extension.
1. Click on the link in "Inspect views: service worker" to open Chrome Devtools for this extension
1. Run `let auth = await firebaseAuth()` in the console
1. Enter a valid phone number into the prompt that appears in the new window
1. Compelte the reCaptcha prompt
1. Enter the verification code you receive via SMS
1. Note that the new window has closed, and `auth` is now resolved to the user's credentials

[1]: https://firebase.google.com/docs/reference/js/v8/firebase.auth.Auth#signinwithphonenumber
[2]: https://www.google.com/recaptcha/about/
[3]: https://developer.chrome.com/docs/extensions/develop/concepts/messaging
[4]: ./service_worker.js
[5]: https://glitch.com/edit/#!/positive-fanatical-machine?path=signInWithPhoneNumber.html
[6]: ./signInWithPhoneNumber.js
[7]: https://developer.chrome.com/docs/extensions/reference/manifest/externally-connectable
[8]: https://console.firebase.google.com/project/_/authentication/providers
