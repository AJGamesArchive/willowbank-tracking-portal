// Importing core resources
import { db } from "../../database/Initalise";
import { getDoc, doc, updateDoc } from "firebase/firestore";

// Importing types
import { Activity } from "../../types/Global/Activity";

// Async function to delete a single activity from the database
export async function deleteActivities(activities: Activity[], programName: string): Promise<boolean> {
  const docRef = doc(db, "programs", programName.toUpperCase());
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
  try {
    await updateDoc(docRef, {
      activities: updatedActivityData,
    });
  } catch (e) {
    console.log(e);
    return Promise.resolve(false);
  };
  return Promise.resolve(true);
};