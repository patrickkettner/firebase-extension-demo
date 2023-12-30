import {initializeAuth, sendSignInLinkToEmail, isSignInWithEmailLink, signInWithEmailLink } from "firebase/auth";
import { initializeApp } from "firebase/app";
import firebaseConfig from './firebaseConfig.js'

const email = undefined; // Set this to the email you want to sign in with

if (email === undefined) {
  throw new Error('You need to set the email variable in signInWithEmailLink.js')
} else {
  // Initialize Firebase
  const app = initializeApp(firebaseConfig)

  // Initialize Firebase Authentication. Use this instaed of getAuth, as it
  // includes GAPI, which is not supported in Manifest v3 extensions.
  const auth = initializeAuth(app, {popupRedirectResolver: undefined});

  // This code runs as both a service worker, and as a script injected into a public website. We detect the context we are running in
  // by checking for the existence of ServiceWorkerGlobalScope. If it exists, we are running as a service worker, then we initiate the
  // authentication flow. If it doesn't exist, we are running as a script, and we check if we are on the callback page and can complete
  // the signin flow.
  if (typeof ServiceWorkerGlobalScope !== 'undefined') {

    // Define the URL being used for the email callback. This value needs to be added to the list of Authorized domains in your Firebase Console
    const actionCodeSettings = {
      url: `https://positive-fanatical-machine.glitch.me/signInWithEmailLink.html?cb=${encodeURIComponent(chrome.runtime.getURL('callback.html'))}`,
      handleCodeInApp: true
    };

    sendSignInLinkToEmail(auth, email, actionCodeSettings)
      .then(() => {
        console.log(`an email has been sent to ${email}`)
      }).catch((e) => {
        if (e.code === 'auth/unauthorized-continue-uri') {
          const requestedDomain = new URL(actionCodeSettings.url).hostname;

          console.error(`You need to add "${requestedDomain}" to the list of Authorized domains in the Firebase Console -> Authentication -> Settings tab.
          https://console.firebase.google.com/project/_/authentication/settings`);
        } else if (e.code === 'auth/operation-not-allowed') {

          console.error(`You need to enable Email link (passwordless sign-in) in Fireebase Console -> Authentication -> Sign-in method tab.
          https://console.firebase.google.com/project/_/authentication/providers

          If you have enabld Google Cloud Identity Platform, you will need to ensure 'Email / Password provider' is enabled, and "Allow passwordless login" is checked.
          https://console.cloud.google.com/customer-identity/provider;name=email`);
        } else {
          console.error(e);
        }
      })

  } else {
    // As mentioned above, this code runs as both a service worker, and as a script injected into a public website. If we are here, then
    // we are running as a script, and we need to check if we are on the callback page

    if (isSignInWithEmailLink(auth, window.location.href)) {

      // If we are on the callback page, we need to get the email address from the user unless otherwise saved.
      // This is because the email address is not passed
      if (!email) {
        // User opened the link on a different device. To prevent session fixation
        // attacks, ask the user to provide the associated email again. For example:
        email = window.prompt('Please provide your email for confirmation');
      }

      // We have confirmed that we are on a valid sign in email link, and we have the email address.
      // Now we can actually call signInWithEmailLink to complete the sign in flow.
      signInWithEmailLink(auth, email, window.location.href)
        .then(({user}) => {
          // We have successfully signed in, and we can now display a message to the user.  
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
}
