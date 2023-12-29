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
  if (error.code === 'auth/operation-not-allowed') {
    console.error(`You must enable email and password in the Firebase Console, under the Auth tab.
    https://console.firebase.google.com/project/_/authentication/providers`);
  }  else if (error.code === 'auth/invalid-credential') {
    console.error(`Please double check the values set for 'email' and 'password' are configured as a valid user on the Firebase Console.
    https://console.firebase.google.com/project/_/authentication/users`);
  }
  else {
    console.error('Error signing in:', error);
  }
})
