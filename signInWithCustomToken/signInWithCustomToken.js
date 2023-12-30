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

import { initializeAuth, signInWithCustomToken } from "@firebase/auth";
import { initializeApp } from "firebase/app";
import firebaseConfig from './firebaseConfig.js'

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Initialize Firebase Authentication. Use this instaed of getAuth, as it
// includes GAPI, which is not supported in Manifest v3 extensions.
const auth = initializeAuth(app, {popupRedirectResolver: undefined});

// If you have a known token, replace it here
// Otherwise, you must set GOOGLE_APPLICATION_CREDENTIALS in your environment to
// point to a service account key JSON file for the same project as your
// firebaseConfig.
const token = /* TOKEN */

signInWithCustomToken(auth, token)
  .then(({user}) => {
    console.log('User signed in:', user.uid);
  })
.catch(error => {
  console.error('Error signing in:', error);
})
