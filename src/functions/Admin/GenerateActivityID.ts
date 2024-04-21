// Importing core resources
import { db } from "../../database/Initalise";
import { getDoc, doc } from "firebase/firestore";

// Importing types
import { Activity } from "../../types/Global/Activity";

// Async function to look at all activity IDs in the DB and generate a new unique ID for a new activity
export async function generateActivityID(programName: string): Promise<string | number> {
  const docRef = doc(db, "programs", programName.toUpperCase());
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