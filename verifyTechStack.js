
const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs } = require('firebase/firestore');
require('dotenv').config({ path: '.env.local' });

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function checkTechStack() {
    console.log("Checking tech_stack collection...");
    try {
        const querySnapshot = await getDocs(collection(db, "tech_stack"));
        if (querySnapshot.empty) {
            console.log("No documents found in 'tech_stack' collection.");
        } else {
            console.log(`Found ${querySnapshot.size} documents:`);
            querySnapshot.forEach((doc) => {
                console.log(doc.id, " => ", doc.data());
            });
        }
    } catch (error) {
        console.error("Error fetching tech_stack:", error);
    }
}

checkTechStack();
