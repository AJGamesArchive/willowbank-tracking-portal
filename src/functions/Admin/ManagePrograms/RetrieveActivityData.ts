import { db } from "../../../database/Initalise"
import { doc, getDoc } from "firebase/firestore";

// Import types
import { Activity } from "../../../types/Global/Activity";

// Async function to retrieve all the activity data for a given program from the database
export async function retrieveAllActivities(snowflake: string): Promise<string | Activity[]> {
  let data: Activity[] = [];
  const docRef = doc(db, "programs", snowflake);
  let document;
  try {
    document = await getDoc(docRef);
    if(!document.exists()) return Promise.resolve("Error");
  } catch (e) {
    console.log(e);
    return Promise.resolve(String(e));
  };
  data = document.data().activities;
  return Promise.resolve(data);
};