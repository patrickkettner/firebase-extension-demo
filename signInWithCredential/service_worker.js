const OFFSCREEN_DOCUMENT_PATH = '/offscreen.html';

let creating;

// There can only be one offscreenDocument. So we create a helper function
// that returns a boolean indicating if a document is already active.
async function hasDocument() {
  // Check all windows controlled by the service worker to see if one
  // of them is the offscreen document with the given path
  const matchedClients = await clients.matchAll();

  return matchedClients.some(
    (c) => c.url === chrome.runtime.getURL(OFFSCREEN_DOCUMENT_PATH)
  );
}

async function setupOffscreenDocument(path) {
  //if we do not have a document, we are already setup and can skip
  if (!(await hasDocument())) {
    // create offscreen document
    if (creating) {
      await creating;
    } else {
      creating = chrome.offscreen.createDocument({
        url: path,
        reasons: [
          chrome.offscreen.Reason.DOM_SCRAPING
        ],
        justification: 'authentication'
      });

      await creating;
      creating = null;
    }
  }
}

async function closeOffscreenDocument() {
  if (!(await hasDocument())) {
    return;
  }
  await chrome.offscreen.closeDocument();
}

async function firebaseAuth(authProvider, data) {
  await setupOffscreenDocument(OFFSCREEN_DOCUMENT_PATH);

  const auth = await chrome.runtime.sendMessage({
    type: 'firebase-auth',
    target: 'offscreen',
    authProvider,
    data
  });

  // TODO uncomment
  //  await closeOffscreenDocument();
  return auth;
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.target === 'background') {
    const {authProvider, data} =  message;

    firebaseAuth(authProvider, data).then(data=> {
      if (data.error) {
        throw data.error
      }
      sendResponse(data)
    }).catch(e => {
      if (e.code === 'auth/operation-not-allowed') {
        console.error(`You need to enable ${authProvider} as an auth provider in the Firebase console.
            https://console.firebase.google.com/project/_/authentication/providers`)
      } else if (e.code === 'auth/popup-closed-by-user') {
        console.error(`The ${authProvider} popup was closed before authentication completed.`)
      } else if (e.code === 'auth/account-exists-with-different-credential') {
        console.error(`An account already exists with the same email address but different sign-in credentials. If you are testing, you can remove existing accounts from the Firebase console.
            https://console.firebase.google.com/project/_/authentication/users`)
      } else {
        console.error(e)
        sendResponse({error: e})
      }
    })

    // Explictly return `true` so the sender is aware its async and can
    // therefore await the response.
    return true
  }
});
