const { db } = require('../lib/admin');

async function updateModel() {
    console.log("Updating AI Automation settings to use OpenRouter...");
    try {
        await db.collection("settings").doc("ai_automation").set({
            model: "openai/gpt-oss-120b:free"
        }, { merge: true });
        console.log("SUCCESS: Model updated to 'openai/gpt-oss-120b:free'.");
    } catch (error) {
        console.error("ERROR: Failed to update settings.", error);
    }
}

updateModel();
