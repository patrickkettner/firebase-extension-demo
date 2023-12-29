(async () => {
  const {default: admin} = await import("firebase-admin");
  const { initializeApp } = await import("firebase-admin/app");

  const process = await import("node:process");

  if (!process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    throw new Error(`process.env.GOOGLE_APPLICATION_CREDENTIALS is not set.
    This must be set to a JSON key file saved on this device.`);
  }

  // Initialize Firebase app
  initializeApp();

  // Create custom token
  const userId = "some-user-id"; // Replace with actual user ID
  const customToken = await admin.auth().createCustomToken(userId);
  console.log(customToken);
})();
