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

const url = "https://positive-fanatical-machine.glitch.me/signInWithRedirect.html"

let authWindow;

// The actual auth flow is handled in signInWithRedirect.js, which is
// a content script that is inejected into the URL listed above. Because of
// Firebase's code choices, this content script MUST be run in the MAIN world
// In order to get around CSP restrictions that would otherwise break us.
// We expose the extension as externally_connectable, which allows the content
// script to send a message to the extension, which is handled here.
function externalMessageHandler(Resolve, message, sender, sendResponse) {
  chrome.runtime.onMessageExternal.removeListener(externalMessageHandler);
  chrome.tabs.remove(authWindow?.tabs[0]?.id);
  Resolve(message);
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
    chrome.runtime.onMessageExternal.addListener((message, sender, sendResponse) => {
      externalMessageHandler(resolve, message, sender, sendResponse);
    });

    // initiate the auth flow by opening a new window to signInWithRedirect.html
    authWindow = await chrome.windows.create({ url })
  })
}
