import { getAuth, signInAnonymously } from "firebase/auth";
import { initializeApp } from "firebase/app";
import firebaseConfig from './firebaseConfig.js'

// Initialize Firebase
initializeApp(firebaseConfig)

signInAnonymously(getAuth())
  .then(userCredential => {
    console.log('User signed in:', user.uid);
  })
.catch(error => {
  console.error('Error signing in:', error);
})
