import { GoogleAuthProvider, getAuth, getRedirectResult, signInWithRedirect} from "firebase/auth";
import { initializeApp } from "firebase/app";
import firebaseConfig from './firebaseConfig.js'

(async () => {
  // This code runs as a content script, so we don't have access to the
  // chrome.runtime.id. Since the `key` is set in manifest.json, this ID can be a
  // known value. We need to have this value in order to send a message from the
  // content script to the service worker.
  const extensionID = 'ohgdbokonfjidphalnfciennigpaiako'

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);

  // This demo is using Google auth provider, but any supported provider should work
  const PROVIDER = new GoogleAuthProvider()

  const auth = getAuth()

  // Before we show any UI to the end user, we check to see if there is any
  // cached credential from a previous sign-in attempt. This would be the case
  // for any future load of this page, including the initial redirect back from
  // the provider after the user has logged in.
  const authResult = await getRedirectResult(auth)

  // If there is no cached credential, we need to go through the auth flow
  // to get a credential.
  if (authResult === null) {
    // This will redirect the page to accounts.google.com. Since this code makes
    // us leave this page, we don't do anything other than call signInWithRedirect
    return await signInWithRedirect(auth, PROVIDER)
  } else {
    // We have a cached credential, so we send it to the service worker
    chrome.runtime.sendMessage(extensionID, authResult)
  }
})()
