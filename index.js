async function funk() {
  const token = await chrome.identity.getAuthToken({interactive: true})
  console.log(token);
  return token
}


funk();
/*
import { signInWithRedirect, signInWithPopup, GoogleAuthProvider, getAuth, signInWithPhoneNumber, PhoneAuthProvider, RecaptchaVerifier , signInWithCredential} from "firebase/auth";
import { initializeApp } from "firebase/app";

function loginViaPhoneNumber(phoneNumber) {
  return new Promise((resolve, reject) => {
    let appVerifier = self.recaptchaVerifier;

    signInWithPhoneNumber(auth, phoneNumber, appVerifier)
      .then((confirmationResult) => {
        // SMS sent. Prompt user to type the code from the message, then sign the
        // user in with confirmationResult.confirm(code).
        self.confirmationResult = confirmationResult;
        console.log(confirmationResult);
        resolve(confirmationResult);
        return confirmationResult
        // ...
      }).catch((error) => {
        // Error; SMS not sent
        // ...
        console.log(error);
        reject(error);
      });
  })
}

self.loginViaPhoneNumber = loginViaPhoneNumber
self.signInWithRedirect = signInWithRedirect
self.signInWithPopup = signInWithPopup

const firebaseConfig = {
  apiKey: "AIzaSyDZcAQTmO5FluQopVGkrDJ0huEHaiOvcsk",
  authDomain: "amp-dev-static-demo.firebaseapp.com",
  projectId: "amp-dev-static-demo",
  storageBucket: "amp-dev-static-demo.appspot.com",
  messagingSenderId: "186932837592",
  appId: "1:186932837592:web:8c9e4898af1b96d4382bad"
};

const div = document.createElement('div')
div.id = 'recaptcha-container'
document.body.appendChild(div)



// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth();
self.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
  'size': 'invisible',
  'callback': (response) => { }
});

const {verificationId} = await loginViaPhoneNumber('+12532345672')
const credential = PhoneAuthProvider.credential({verificationId}, '989872');
console.clear()
console.log(credential);
var foo = {...credential, phoneNumber: '+12532345672', }
console.log(foo)

const bar = await signInWithCredential(auth, foo);
console.log('vvv foo vvv');
console.log(foo);

*/
