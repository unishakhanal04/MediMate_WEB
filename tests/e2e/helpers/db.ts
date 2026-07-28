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
