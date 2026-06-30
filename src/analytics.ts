import { doc, increment, setDoc, getDocs, collection, query, orderBy, limit } from "firebase/firestore";
import { db, handleFirestoreError, OperationType } from "./firebase";

export const trackPageView = async () => {
    if (sessionStorage.getItem('page_viewed_session')) return;

    const today = new Date().toISOString().split('T')[0];
    let country = "Unknown";
    
    try {
        try {
            const res = await fetch('https://ipapi.co/json/');
            const data = await res.json();
            if (data.country_name) country = data.country_name;
        } catch(e) {
            console.error("IP API error", e);
        }

        const dailyRef = doc(db, 'analytics_daily', today);
        await setDoc(dailyRef, { visits: increment(1), date: today }, { merge: true });

        if (country) {
            const locRef = doc(db, 'analytics_locations', country);
            await setDoc(locRef, { views: increment(1), name: country }, { merge: true });
        }
        
        sessionStorage.setItem('page_viewed_session', 'true');
    } catch (e: any) {
        if (e.code === 'permission-denied') {
            handleFirestoreError(e, OperationType.WRITE, `analytics_daily/${today}`);
        }
        console.error("Tracking error", e);
    }
}

export const trackItemView = async (collectionName: string, id: string) => {
    const key = `viewed_${collectionName}_${id}`;
    if (sessionStorage.getItem(key)) return;

    try {
        const ref = doc(db, collectionName, id);
        await setDoc(ref, { views: increment(1) }, { merge: true });
        sessionStorage.setItem(key, 'true');
    } catch (e: any) {
        if (e.code === 'permission-denied') {
            handleFirestoreError(e, OperationType.WRITE, `${collectionName}/${id}`);
        }
        console.error("Item tracking error", e);
    }
}
