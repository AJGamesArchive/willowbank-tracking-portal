// Importing core resources
import { db } from "../../../database/Initalise";
import { getDoc, doc, runTransaction } from "firebase/firestore";

// Importing types
import { Activity } from "../../../types/Global/Activity";

// Async function to save an activity to the database
export async function saveActivityData(activity: Activity, isNew: boolean, snowflake: string): Promise<boolean> {
  const docRef = doc(db, "programs", snowflake);
  let programDoc;
  let activityData: Activity[] = [];
  try {
    programDoc = await getDoc(docRef);
    if(!programDoc.exists()) {return Promise.resolve(false);}
    activityData = programDoc.data().activities;
  } catch (e) {
    console.log(e);
    return Promise.resolve(false);
  };
  if(isNew) {
    activityData.push(activity);
  };
  if(!isNew) {
    for(let i = 0; i < activityData.length; i++) {
      if(activityData[i].id !== activity.id) {continue;}
      activityData[i] = activity;
      break;
    };
  };
  try {
    await runTransaction(db, async (transaction): Promise<void> => {
      await transaction.update(docRef, {
        activities: activityData,
      });
    });
  } catch (e) {
    console.log(e);
    return Promise.resolve(false);
  };
  return Promise.resolve(true);
};