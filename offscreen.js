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

// Registering this listener when the script is first executed ensures that the
// offscreen document will be able to receive messages when the promise returned
// by `offscreen.createDocument()` resolves.

let loaded = false;
const _URL = "http://localhost:3000"
const iframe = document.createElement('iframe');
iframe.src=_URL
iframe.addEventListener('load', () => {
  loaded = true
})
document.documentElement.appendChild(iframe)

chrome.runtime.onMessage.addListener(handleChromeMessages);

function handleChromeMessages(message, sender, sendResponse) {
  // Return early if this message isn't meant for the offscreen document.
  if (message.target !== 'offscreen') {
    return false;
  }

  function handleIframeMessage(data) {
    window.removeEventListener("message", handleIframeMessage)
    console.log('this is from the fucking iframe');
    console.log(data);
    sendResponse(data)
  }

  window.addEventListener("message", handleIframeMessage, false);

  iframe.contentWindow.postMessage('load firebase auth', _URL)

  return true;
}
