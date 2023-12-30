// Copyright 2023 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

const url = "https://positive-fanatical-machine.glitch.me/signInWithPhoneNumber.html"

let authWindow;

// The actual auth flow is handled in signInWithPhoneNumber.js.js, which is a
// content script that is inejected into the URL listed above. Firebase requires
// the use of reCaptcha, and reCaptcha requires it to be loaded from it's CDN.
// Since extension's on the Chrome Web Store aren't allowed to load remote code
// we get around this by loading this file as a content script. Additionally,
// since reCaptcha loads it's own scripts, it MUST be run in the MAIN world in
// order to get around CSP restrictions that would otherwise break us, the
// extension also configures externally_connectable. This allows the content
// script to send a message to the extension.
function externalMessageHandler(Resolve, Reject, message, sender, sendResponse, promisedWrappedHandler) {

  chrome.runtime.onMessageExternal.removeListener(promisedWrappedHandler);

  if (message.name === 'FirebaseError') {
    console.error('recieved error from content script', message);
  } else {
    console.log('received message from content script', message);
  }

  if (message.name === 'FirebaseError') {
    const err = message;
    if (err.code === 'auth/operation-not-allowed') {
      console.error(`You must enable Phone as a Sign-in provider in the Firebase console in order to use signInWithPhoneNumber.
          https://console.firebase.google.com/project/_/authentication/providers`);
    } else if (err.code === 'auth/invalid-verification-code') {
      console.error(`The verification code entered ("${err.verificationCode}") was not valid.`);
    } else if (err.code === 'auth/too-many-requests') {
      console.error(`Too many requests to the phone number ${phoneNumber}. If you are testing, consider adding ${phoneNumber} to "Phone numbers for testing (optional)" under the Phone section of the Firebase console.
      https://console.firebase.google.com/project/_/authentication/providers
        `);
    } else if (err.code === 'auth/missing-code') {
      console.error(`You need to input a verification code that was sent to ${phoneNumber}. Restart the process to try again.`);
    } else {
      console.error(`SMS not sent: ${err.message}`)
    }
    Reject(message.error);
  } else {
    Resolve(message);
  }

  chrome.tabs.remove(authWindow?.tabs[0]?.id);
}

function firebaseAuth() {
  // return a literal Promise so we can handle the resolve and reject cases
  return new Promise(async (resolve, reject) => {

    // If the user closes the tab before auth completes, reject the promise
    chrome.tabs.onRemoved.addListener(tabId => {
      if (tabId === authWindow?.tabs[0]?.id) {
        reject('User closed tab before auth completed.');
      }
    });

    // Wire up the onMessageExternal listener our externalMessageHandler
    // function. We are passing the resolve handle so it can be resolved
    // in that function

    function promisedWrappedHandler(message, sender, sendResponse) {
      externalMessageHandler(resolve, reject, message, sender, sendResponse, promisedWrappedHandler);
    }

    chrome.runtime.onMessageExternal.addListener(promisedWrappedHandler);

    // initiate the auth flow by opening a new window to signInWithPhoneNumber.html
    authWindow = await chrome.windows.create({ url })
  })
}
