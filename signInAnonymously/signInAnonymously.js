import { initializeAuth, signInAnonymously } from "@firebase/auth";
import { initializeApp } from "firebase/app";
import firebaseConfig from './firebaseConfig.js'

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Initialize Firebase Authentication. Use this instaed of getAuth, as it
// includes GAPI, which is not supported in Manifest v3 extensions.
const auth = initializeAuth(app, {popupRedirectResolver: undefined});

signInAnonymously(auth)
  .then(({user})=> {
    console.log('User signed in:', user.uid);
  })
.catch(error => {
  if (error.code === 'auth/admin-restricted-operation') {
    console.error(`Enable the Anonymous Sign-in provider in your Firebase console.
      https://console.firebase.google.com/project/_/authentication/providers`);
  } else {
    console.error('Error signing in:', error);
  }
})
