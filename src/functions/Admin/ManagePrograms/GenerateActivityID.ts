// Importing core resources
import { db } from "../../../database/Initalise";
import { getDoc, doc } from "firebase/firestore";

// Importing types
import { Activity } from "../../../types/Global/Activity";

// Async function to look at all activity IDs in the DB and generate a new unique ID for a new activity
export async function generateActivityID(snowflake: string): Promise<string | number> {
  // Retrieve activity data for the given program
  const docRef = doc(db, "programs", snowflake);
  let programDoc;
  let activityData: Activity[] = [];
  try {
    programDoc = await getDoc(docRef);
    if(!programDoc.exists()) {return Promise.resolve("Error");}
    activityData = programDoc.data().activities;
  } catch (e) {
    console.log(e);
    Promise.resolve(String(e));
  };

  // Find the highest ID currently in use
  let id: number = 0;
  activityData.forEach((a) => {
    if(a.id > id) {id = a.id;}
  });
  // Increment the highest ID by 1 to create the new ID
  id++;

  return Promise.resolve(id);
};