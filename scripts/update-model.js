// ESM — matches "type": "module" in package.json
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc } from 'firebase/firestore';

// Read Firebase config from env vars (GitHub Actions) or fall back to static config
const firebaseConfig = (process.env.NEXT_PUBLIC_FIREBASE_API_KEY && process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID)
    ? {
        apiKey:            process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
        authDomain:        process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
        projectId:         process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        storageBucket:     process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
        messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
        appId:             process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    }
    : {
        apiKey:            'AIzaSyCxG11euXpbfRGhYMJhzpjRM-X07kQCRFg',
        authDomain:        'kushyanth-portfolio.firebaseapp.com',
        projectId:         'kushyanth-portfolio',
        storageBucket:     'kushyanth-portfolio.firebasestorage.app',
        messagingSenderId: '385947231226',
        appId:             '1:385947231226:web:3d4ad68ca311d9d162fa43',
    };

const app = initializeApp(firebaseConfig);
const db  = getFirestore(app);

async function updateModel() {
    console.log('Updating AI Automation settings to use Groq...');
    try {
        await setDoc(doc(db, 'settings', 'ai_automation'), {
            model: 'llama-3.3-70b-versatile',
        }, { merge: true });
        console.log("SUCCESS: Model updated to 'llama-3.3-70b-versatile' (Groq).");
    } catch (error) {
        console.error('ERROR: Failed to update settings.', error.message);
        process.exit(1);
    }
}

updateModel();
