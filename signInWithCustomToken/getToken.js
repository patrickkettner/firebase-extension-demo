// Copyright 2023 Google LLC
// //
// // Licensed under the Apache License, Version 2.0 (the "License");
// // you may not use this file except in compliance with the License.
// // You may obtain a copy of the License at
// //
// //     https://www.apache.org/licenses/LICENSE-2.0
// //
// // Unless required by applicable law or agreed to in writing, software
// // distributed under the License is distributed on an "AS IS" BASIS,
// // WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// // See the License for the specific language governing permissions and
// // limitations under the License.

(async () => {
  const {default: admin} = await import("firebase-admin");
  const { initializeApp } = await import("firebase-admin/app");

  const process = await import("node:process");

  if (!process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    throw new Error(`process.env.GOOGLE_APPLICATION_CREDENTIALS is not set.
    This must be set to a JSON key file saved on this device.`);
  }

  // Initialize Firebase app
  initializeApp();

  // Create custom token
  const userId = "some-user-id"; // Replace with actual user ID
  const customToken = await admin.auth().createCustomToken(userId);
  console.log(customToken);
})();
