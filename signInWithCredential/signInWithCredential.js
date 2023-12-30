import {
 EmailAuthProvider,
 FacebookAuthProvider,
 GithubAuthProvider,
 GoogleAuthProvider,
 getAuth,
 signInWithCredential,
 signInWithPopup
} from 'firebase/auth';
import { initializeApp } from "firebase/app";
import firebaseConfig from './firebaseConfig.js'
const PARENT_FRAME = document.location.ancestorOrigins[0];

function messageParentFrame(message) {
  globalThis.parent.self.postMessage(JSON.stringify(message), PARENT_FRAME);
}

globalThis.addEventListener("message", async (message) => {

  console.error('our libraru, running in an iframe');
  console.error(`${JSON.stringify(message)}`);

  if (message.data?.type === 'firebase-auth') {
    let provider;

    const {authProvider, data} = message.data;

    switch (authProvider) {
      case 'email':
        const {password} = data;
        const email = data.userEmail;

        provider = EmailAuthProvider.credential(email, password);
        break
      case 'facebook':
        provider = new FacebookAuthProvider;
        break
      case 'github':
        provider = new GithubAuthProvider;
        break
      case 'google':
        provider = new GoogleAuthProvider;
        break
    }

    initializeApp(firebaseConfig);
    const auth = getAuth();
    let credential;

    if (authProvider === 'email') {
      credential = provider;
    } else {
      try {
        const result = await signInWithPopup(getAuth(), provider);

        console.log('result')
        console.log( result);
        console.log('------')
        credential = provider.credentialFromResult(result);
      } catch (e) {
        messageParentFrame({error: e});
      }
    }

    const session = await signInWithCredential(auth, credential);
    messageParentFrame(session);
  }
});
