import { GoogleAuthProvider, getAuth, getRedirectResult, signInWithRedirect} from "firebase/auth";
import { initializeApp } from "firebase/app";
import firebaseConfig from './firebaseConfig.js'

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// This demo is using Google auth provider, but any supported provider should work
const PROVIDER = new GoogleAuthProvider()

const auth = getAuth()

console.log('this file was loaded');
(async () => {
  console.log('this async function was ran');
  // check to see we have cached authentication
  const authResult = await getRedirectResult(auth);
  console.log('we got authResults I think');

  // if it is null, we don't
  if (authResult === null) {
    console.log('auth results were null');

    console.log('calling signInWithRedirect');
    signInWithRedirect(auth, PROVIDER)
      .then((mail) => {
          console.log(mail);
        })
      .catch((err) => {
            console.error(err);
          })
      .finally(() => {
            console.log('Experiment completed');
          });

  } else {
    const PARENT_FRAME = document.location.ancestorOrigins[0]

    console.log('auth results were NOT null');
    console.log(authResult)

    console.log(PARENT_FRAME);

    globalThis.parent.self.postMessage(JSON.stringify({authResult}), PARENT_FRAME)
  }

})()
