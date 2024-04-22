import { db } from "../../database/Initalise"
import { doc, setDoc, updateDoc } from "firebase/firestore";

// Async function to add a new program to the system
export async function saveProgram(programName: string, programDescription: string, programColour: string, isNew: boolean): Promise<boolean> {
  try {
    if(isNew) {
      await setDoc(doc(db, "programs", programName.toUpperCase()), {
        displayName: programName,
        description: programDescription,
        colour: programColour,
        activities: [],
      });
    } else {
      await updateDoc(doc(db, "programs", programName.toUpperCase()), {
        displayName: programName,
        description: programDescription,
        colour: programColour,
      });
    };
  } catch (e) {
    return Promise.resolve(false);
  };
  return Promise.resolve(true);
};