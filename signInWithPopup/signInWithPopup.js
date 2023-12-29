import { signInWithPopup, GoogleAuthProvider, getAuth } from "firebase/auth";
import { initializeApp } from "firebase/app";
import firebaseConfig from './firebaseConfig.js'

// Since signInWithPopup requires a popup window, we need to run in the DOM.
// This is accomplished using an offscreenDocument. See the README for more
// details on the architecture of the sample.

// Initialize Firebase
const app = initializeApp(firebaseConfig);


// This code runs inside of an iframe in the extension's offscreen document.
// This is a reference to the parent frame, i.e. the offscreen document.
// We need this to assign the targetOrigin for postMessage.
const PARENT_FRAME = document.location.ancestorOrigins[0]

// This demo is using Google auth provider, but any supported provider should work
// Make sure that you enable any provider you want to use in the Firebase Console.
// https://console.firebase.google.com/project/_/authentication/providers
const PROVIDER = new GoogleAuthProvider();

function sendResponse(result) {
  globalThis.parent.self.postMessage(JSON.stringify(result), PARENT_FRAME)
}

// Opens the Google sign-in page in a popup, inside of an iframe in the
// extension's offscreen document.
// To centralize logic, all respones are forwarded to the parent frame,
// which goes onto forward them to the extension's service worker.
signInWithPopup(getAuth(), PROVIDER)
  .then(sendResponse)
  .catch(sendResponse)
