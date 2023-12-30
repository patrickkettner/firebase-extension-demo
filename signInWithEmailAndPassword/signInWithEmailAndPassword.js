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

import { initializeAuth, signInWithEmailAndPassword } from "firebase/auth";
import { initializeApp } from "firebase/app";
import firebaseConfig from './firebaseConfig.js'

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Initialize Firebase Authentication. Use this instaed of getAuth, as it
// includes GAPI, which is not supported in Manifest v3 extensions.
const auth = initializeAuth(app, {popupRedirectResolver: undefined});

// These values are for demonstration only. You would want to retrieve them
// from the user, rather than hard code them into your extension.
const email = 'user@example.com';
const password = 'password123';

signInWithEmailAndPassword(auth, email, password)
  .then(userCredential => {
    const user = userCredential.user;
    console.log('User signed in:', user);
  })
.catch(error => {
  if (error.code === 'auth/operation-not-allowed') {
    console.error(`You must enable email and password in the Firebase Console, under the Auth tab.
    https://console.firebase.google.com/project/_/authentication/providers`);
  }  else if (error.code === 'auth/invalid-credential') {
    console.error(`Please double check the values set for 'email' and 'password' are configured as a valid user on the Firebase Console.
    The expeted values are email: ${email} and password: ${password}.
    https://console.firebase.google.com/project/_/authentication/users`);
  }
  else {
    console.error('Error signing in:', error);
  }
})
