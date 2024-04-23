// Importing core resources
import { db } from "../../../database/Initalise";
import { getDoc, doc, updateDoc } from "firebase/firestore";

// Async function to look at all activity IDs in the DB and generate a new unique ID for a new activity
export async function generateActivityID(snowflake: string): Promise<string | number> {
  // Retrieve activity data for the given program
  const docRef = doc(db, "programs", snowflake);
  let id: number = 0;
  let programDoc: any;
  let totalActivities: number = 0;
  try {
    programDoc = await getDoc(docRef);
    if(!programDoc.exists()) {return Promise.resolve("Error");}
    totalActivities = programDoc.data().totalActivities;
    id = totalActivities + 1;
    await updateDoc(docRef, {
      totalActivities: id,
    });
  } catch (e) {
    console.log(e);
    Promise.resolve(String(e));
  };
  return Promise.resolve(id);
};