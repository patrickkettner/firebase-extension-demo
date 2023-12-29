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
