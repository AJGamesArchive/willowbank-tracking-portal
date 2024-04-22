import { db } from "../../../database/Initalise"
import { doc, setDoc, updateDoc } from "firebase/firestore";
import { snowflake } from "../../../classes/Snowflake";

// Async function to add a new program to the system
//TODO Update this function to add newly created programs to all student XP tracking documents
export async function saveProgram(programSnowflake: string, programName: string, programDescription: string, programColour: string, isNew: boolean): Promise<boolean> {
  try {
    if(isNew) {
      const newSnowflake: string = snowflake.generate();
      await setDoc(doc(db, "programs", newSnowflake), {
        snowflake: newSnowflake,
        name: programName,
        description: programDescription,
        colour: programColour,
        activities: [],
      });
    } else {
      await updateDoc(doc(db, "programs", programSnowflake), {
        name: programName,
        description: programDescription,
        colour: programColour,
      });
    };
  } catch (e) {
    return Promise.resolve(false);
  };
  return Promise.resolve(true);
};