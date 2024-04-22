// Importing database connections
import { db } from "../../database/Initalise";
import { deleteDoc, doc } from "firebase/firestore";

// Async function to delete a given program
export async function deleteProgram(programName: string): Promise<boolean> {
  const docRef = doc(db, "programs", programName.toUpperCase());
  try {
    await deleteDoc(docRef);
  } catch (e) {
    console.log(e);
    return Promise.resolve(false);
  };
  return Promise.resolve(true);
};