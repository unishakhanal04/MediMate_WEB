import { MongoClient } from "mongodb";

const MONGO_URI = process.env.E2E_MONGO_URI || "mongodb://localhost:27017/medimate";

export const promoteToAdmin = async (email: string) => {
  const client = new MongoClient(MONGO_URI);
  try {
    await client.connect();
    const db = client.db();
    await db.collection("users").updateOne({ email: email.toLowerCase() }, { $set: { role: "admin" } });
  } finally {
    await client.close();
  }
};

// Bypasses the UI so a test that toggles maintenance mode can force it back off
// even if an assertion above fails mid-test — otherwise a stuck "on" state would
// break every other test in this single-worker suite.
export const setMaintenanceMode = async (enabled: boolean) => {
  const client = new MongoClient(MONGO_URI);
  try {
    await client.connect();
    const db = client.db();
    await db.collection("appsettings").updateOne({}, { $set: { maintenanceMode: enabled } }, { upsert: true });
  } finally {
    await client.close();
  }
};
