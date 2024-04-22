// Importing database connections
import { db } from "../../../database/Initalise";
import { deleteDoc, doc } from "firebase/firestore";

// Async function to delete a given program
export async function deleteProgram(snowflake: string): Promise<boolean> {
  const docRef = doc(db, "programs", snowflake);
  try {
    await deleteDoc(docRef);
  } catch (e) {
    console.log(e);
    return Promise.resolve(false);
  };
  return Promise.resolve(true);
};