const { db } = require('../lib/admin');

async function updateModel() {
    console.log("Updating AI Automation settings to use Groq...");
    try {
        await db.collection("settings").doc("ai_automation").set({
            model: "llama-3.3-70b-versatile"
        }, { merge: true });
        console.log("SUCCESS: Model updated to 'llama-3.3-70b-versatile'.");
    } catch (error) {
        console.error("ERROR: Failed to update settings.", error);
    }
}

updateModel();
