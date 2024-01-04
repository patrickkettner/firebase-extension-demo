# Firebase Auth in Web Extensions

[Firebase auth](https://firebase.google.com/docs/auth) offers a [number of different methods](https://firebase.google.com/docs/auth#:~:text=Firebase%20SDK%20Authentication) for authenticating users. While they do have a [JavaScript SDK](https://firebase.google.com/docs/reference/js/auth.md#auth_package), it has a number of coding practices that are not allowed by policy in the Chrome Web Store. As a result, using them [may result in an extension being rejected](https://github.com/firebase/firebase-js-sdk/issues/7617). This repo is a collection of example extensions that show how to package and occasionally modify the SDK in order to comply with CWS policies and fully function inside of the service worker used in Manifest v3.

To build yourself, you will need to create the file `firebaseConfig.js` at the root of this repo. This should be an exported JSON config file you can find in your [project settings](https://console.firebase.google.com/project/_/settings/general/web).


```js
export default {
  apiKey: "xxxxxxxxxxxxxxxxx-xxxxxxxxxxxxxxxxxxxxx",
  authDomain: "xxxxxxxxxxxxxx.firebaseapp.com",
  projectId: "projectId",
  storageBucket: "projectId.appspot.com",
  messagingSenderId: "000000000000",
  appId: "x:xxxxxxxxxxxx:xxx:xxxxxxxxxxxxxxxxxxxxxx",
  measurementId: "x-xxxxxxxxxx"
};;
```
Once you have created `firebaseConfig.js`, select the API you want to build from one of the directories. It would be a good idea to read the README of any project you wish to build, in case there is configuraiton you need to do in order to proceed.

## Building

The compiled version of each API is generated using [rollup](https://rollupjs.org/). While rollup itself isn't a strict requirement if you are looking to use Firebase Auth in your own extension, _some_ kind of [treeshaking](https://developer.mozilla.org/docs/Glossary/Tree_shaking) build processs is. This will remove unused code from the build, and make sure the generated file does not include code that would get your extension rejected.

All of the extensions can be built using the npm scripts in the project's package.json.o

```sh
npm run compile:signInAnonymously
npm run compile:signInWithCustomToken
npm run compile:signInWithEmailAndPassword
npm run compile:signInWithEmailLink
npm run compile:signInWithPhoneNumber
npm run compile:signInWithPopup
npm run compile:signInWithRedirect
```

Specific installation and usage instructions can be found on each directorys individual README.


## License

All code is authored by Google and licensed under the [Apache License, Version 2.0](/LICENSE).
