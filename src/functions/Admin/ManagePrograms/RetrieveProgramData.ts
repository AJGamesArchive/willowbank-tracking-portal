import { db } from "../../../database/Initalise"
import { getDocs, query, collection, DocumentData } from "firebase/firestore";

// Import types
import { ProgramData } from "../../../types/Admin/ProgramData";

// Async function to retrieve and return all the program data in the system
export async function retrieveProgramData(): Promise<string | ProgramData[]> {
  let data: ProgramData[] = [];
  const q = query(collection(db, "programs"));
  let documents;
  try {
    documents = await getDocs(q);
  } catch (e) {
    return Promise.resolve("Error");
  };
  documents.forEach((d) => {
    const docData: DocumentData = d.data();
    const programData: ProgramData = {
      snowflake: docData.snowflake,
      name: docData.name,
      description: docData.description,
      colour: docData.colour,
    };
    data.push(programData);
  });
  return Promise.resolve(data);
};