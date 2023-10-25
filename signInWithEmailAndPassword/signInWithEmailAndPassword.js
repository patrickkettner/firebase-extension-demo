import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { initializeApp } from "firebase/app";
import firebaseConfig from './firebaseConfig.js'

// Initialize Firebase
initializeApp(firebaseConfig)

// These values are for demonstration only. You would want to retrieve them
// from the user, rather than hard code them into your extension.
const email = 'user@example.com';
const password = 'password123';

signInWithEmailAndPassword(getAuth(), email, password)
  .then(userCredential => {
    const user = userCredential.user;
    console.log('User signed in:', user);
  })
.catch(error => {
  console.error('Error signing in:', error);
})
