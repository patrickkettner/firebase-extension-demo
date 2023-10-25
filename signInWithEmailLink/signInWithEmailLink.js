import { getAuth, sendSignInLinkToEmail, isSignInWithEmailLink, signInWithEmailLink } from "firebase/auth";
import { initializeApp } from "firebase/app";
import firebaseConfig from '../firebaseConfig.js'

// TODO make a suer input for this rather than hardcoded
const email  = 'patrick@patrickkettner.com';

// Initialize Firebase
initializeApp(firebaseConfig)

const auth = getAuth();

console.log('e;kjansdfk;jasndfkjasndflkjansdlkjfnasdkljfnalksdjnf');
console.log(chrome.runtime.getURL('callback.html'))

if (typeof ServiceWorkerGlobalScope !== 'undefined') {
  const actionCodeSettings = {
    url: chrome.runtime.getURL('callback.html'),
    handleCodeInApp: true
  };

  sendSignInLinkToEmail(auth, email, actionCodeSettings)

  console.log(`an email has been sent to ${email}`)
} else {
  // we are in callback.html
  if (isSignInWithEmailLink(auth, window.location.href)) {
    if (!email) {
      // User opened the link on a different device. To prevent session fixation
      // attacks, ask the user to provide the associated email again. For example:
      email = window.prompt('Please provide your email for confirmation');
    }

    signInWithEmailLink(auth, email, window.location.href)
      .then(({user}) => {
        const h = document.createElement('h1');
        h.innerText = `${user.displayName} <${user.email}> has been authorized!`

        document.body.appendChild(h);
      })
      .catch((error) => {
        console.log(error);
      });
  } else {
    console.log(`isSignInWithEmailLink was false for ${window.location.href}`)
  }
}
