import { signInWithPopup, GoogleAuthProvider, getAuth } from "firebase/auth";
import { initializeApp } from "firebase/app";
import firebaseConfig from './firebaseConfig.js'

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const PARENT_FRAME = document.location.ancestorOrigins[0]

// This demo is using Google auth provider, but any supported provider should work
const PROVIDER = new GoogleAuthProvider()

// here is where we can configure any scopes or options for the authentication
signInWithPopup(getAuth(), PROVIDER).then(userCred => {
  globalThis.parent.self.postMessage(JSON.stringify({userCred}), PARENT_FRAME)
})
