// Importing core resources
import { db } from "../../../database/Initalise";
import { getDoc, doc } from "firebase/firestore";

// Importing types
import { Activity } from "../../../types/Global/Activity";

// Async function to look at all activity IDs in the DB and generate a new unique ID for a new activity
//TODO Update this script to only generate new IDs and never reuse old IDs to enable us to create a system to mark activities as completed, even if the activity has been deleted
export async function generateActivityID(snowflake: string): Promise<string | number> {
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
  let id: number = 0;
  while(true) {
    id++;
    let foundMatch: boolean = false;
    activityData.forEach((a) => {
      if(a.id === id) {
        foundMatch = true;
      };
    });
    if(!foundMatch) {
      return Promise.resolve(id);
    };
  };
};