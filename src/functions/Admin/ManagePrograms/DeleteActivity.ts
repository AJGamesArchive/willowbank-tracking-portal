// Importing core resources
import { db } from "../../../database/Initalise";
import { doc, runTransaction } from "firebase/firestore";

// Importing types
import { Activity } from "../../../types/Global/Activity";

// Async function to delete a single activity from the database
export async function deleteActivities(activities: Activity[], snowflake: string): Promise<boolean> {
  const docRef = doc(db, "programs", snowflake);
  let programDoc;
  let activityData: Activity[] = [];
  try {
    const success: boolean = await runTransaction(db, async (transaction): Promise<boolean> => {
      programDoc = await transaction.get(docRef);
      if(!programDoc.exists()) {return Promise.resolve(false);}
      activityData = programDoc.data().activities;
      let updatedActivityData: Activity[] = [];
      activityData.forEach((a) => {
        let foundMatch: boolean = false;
        activities.forEach((b) => {
          if(a.id === b.id) {
            foundMatch = true;
          };
        });
        if(!foundMatch) {
          updatedActivityData.push(a);
        };
      });
      await transaction.update(docRef, {
        activities: updatedActivityData,
      });
      return Promise.resolve(true);
    });
    if(!success) return Promise.resolve(false);
  } catch (e) {
    console.log(e);
    return Promise.resolve(false);
  };
  return Promise.resolve(true);
};