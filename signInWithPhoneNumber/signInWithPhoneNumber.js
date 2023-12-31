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

import { getAuth, signInWithPhoneNumber, RecaptchaVerifier } from "firebase/auth";
import { initializeApp } from "firebase/app";
import firebaseConfig from './firebaseConfig.js'
import { parsePhoneNumber } from 'awesome-phonenumber'

// This code runs as a content script, so we don't have access to the
// chrome.runtime.id. Since the `key` is set in manifest.json, this ID can be a
// known value. We need to have this value in order to send a message from the
// content script to the service worker.
const extensionID = 'ohgdbokonfjidphalnfciennigpaiako'

function getPhoneNumber(promptString = 'What is your phone number, including country code?') {
  // keep a reference to the original promptString so we can use it in the error message
  let suppliedPhoneNumber = prompt(promptString);
  let phoneNumber = suppliedPhoneNumber;

  // phoneNumber will be null if the user cancels the prompt. If that happens, we message the
  // service worker so it can close this window
  if (phoneNumber === null) {
    return chrome.runtime.sendMessage(extensionID, { error: { code: "auth/cancelled-phone-number-request", message: "User cancelled the prompt requesting their phone number", phoneNumber: suppliedPhoneNumber}})
  }

  // firebase requires phone numbers to be in E.164 format (e.g. +18885551212). If the user
  // doesn't include the required +, add one.
  if (!phoneNumber.startsWith('+')) {
    phoneNumber = `+${phoneNumber}`;
  }

  const parsedNumber = parsePhoneNumber(phoneNumber);
  if (parsedNumber.valid === true) {
    return parsedNumber.number.e164
  } else {
    // If the phone number is invalid, prompt the user again.
    return getPhoneNumber(`${suppliedPhoneNumber} is not a valid phone number. Please share a valid phone number, including country code. For example: +18885551212`)
  }
}

(async () => {

  // Initialize Firebase
  const app = initializeApp(firebaseConfig)

  const auth = getAuth();

  // This code is running inside of a web page, rather than in the extension. As a result,
  // we have access to the standard DOM APIs.
  // The sole UI for this sample is a div for the reCaptcha to render into.
  const reCaptchaContainer = document.createElement('div')
  reCaptchaContainer.setAttribute('id', 'recaptcha-container')

  document.body.appendChild(reCaptchaContainer);

  // Firebase expects globalThis.recaptchaVerifier to be available when signInWithPhoneNumber is called.
  globalThis.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
    'size': 'normal',
    'callback': (response) => {
      // Once the user has verified they are not a robot, remove the reCaptcha UI from the page.
      reCaptchaContainer.remove();
    },
    'expired-callback': () => {
      console.error('Recaptcha expired')
    }
  });


  // Our setup code is complete, so we can now prompt the user for their phone number.
  // This will repeat over and over until the user provides a valid phone number.
  let phoneNumber = getPhoneNumber()

  try {
    // Now that we have a valid phone number, we can call signInWithPhoneNumber.
    // This will trigger the reCaptcha UI to appear.
    const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier)

    // Once the user successfully completes the reCaptcha, we will need to them to provide
    // the verification code that was sent to their phone
    const testVerificationCode = prompt('what is the test verification code?')

    // testVerificationCode will be null if the user cancels the prompt. If that happens, we message the
    // service worker so it can close this window
    if (testVerificationCode === null) {
      return chrome.runtime.sendMessage(extensionID, { error: { code: "auth/cancelled-verification-code-request", message: "User cancelled the prompt requesting verification code", verificationCode: testVerificationCode}})
    }

    let result;

    try {
      result = await confirmationResult.confirm(testVerificationCode)
    } catch (err) {
      err.verificationCode = testVerificationCode;
      return chrome.runtime.sendMessage(extensionID, err);
    }

    // We now have a cached credential, so we send it to the service worker.
    // Since this is a content script running in the MAIN world, we need to have
    // configured the manifest.json to include be externally_connectable.
    // Bby providing the extensionID as the first argument, we can send the extension's
    // service worker the authentication result
    chrome.runtime.sendMessage(extensionID, result)
  } catch (err) {
    chrome.runtime.sendMessage(extensionID, err)
  }
})()
