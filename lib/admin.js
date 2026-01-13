const admin = require('firebase-admin');

// 1. Try to load from environment variable (JSON string)
// Use this for GitHub Actions Secrets where you can paste the JSON content
const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;

let credential;

if (serviceAccountKey) {
    try {
        const serviceAccount = JSON.parse(serviceAccountKey);
        credential = admin.credential.cert(serviceAccount);
    } catch (error) {
        console.error("Error parsing FIREBASE_SERVICE_ACCOUNT_KEY:", error);
        // Fallback or exit? For now, let's try default (might work if Google Auth is set up otherwise)
    }
} else {
    // 2. Fallback to GOOGLE_APPLICATION_CREDENTIALS file or default env
    // This handles local dev if user did `export GOOGLE_APPLICATION_CREDENTIALS="./service-account.json"`
    credential = admin.credential.applicationDefault();
}

if (!admin.apps.length) {
    // Attempt initialization
    try {
        admin.initializeApp({
            credential: credential,
            // Project ID is often auto-discovered from credential, but safe to fallback if env var is there
            projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || undefined
        });
        console.log("Firebase Admin Initialized");
    } catch (error) {
        console.error("Firebase Admin Initialization Failed:", error);
    }
}

const db = admin.firestore();
const auth = admin.auth();

module.exports = { admin, db, auth };
