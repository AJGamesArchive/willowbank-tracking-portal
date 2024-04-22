// Importing database connections
import { db } from "../../database/Initalise";
import { getDocs, collection, DocumentData, query } from "firebase/firestore";

// Async function to validate that a given new program name is unique
export async function isUniqueProgramName(programName: string): Promise<boolean | string> {
  const q = query(collection(db, "programs"));
  let documents;
  try {
    documents = await getDocs(q);
  } catch (e) {
    console.log(e);
    return Promise.resolve(String(e));
  };
  let foundMatch: boolean = false;
  documents.forEach((doc) => {
    const docData: DocumentData = doc.data();
    if(docData.name.toUpperCase() === programName.toUpperCase()) {foundMatch = true;}
  });
  if(foundMatch) {return Promise.resolve(false);}
  return Promise.resolve(true);
};