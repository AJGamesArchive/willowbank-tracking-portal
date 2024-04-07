// Importing the database
import { db } from "../../database/Initalise"
import { collection, query, getDocs } from "firebase/firestore";

// Async function to retrieve all the document ID's for a given collection in the database
export async function retrieveDocumentIDs(collectionName: string): Promise<string | string[]> {
  let documentIDs: string[] = [];
  const q = query(collection(db, collectionName));
  let documents;
  try {
    documents = await getDocs(q);
  } catch (e) {
    const error: string = `An unexpected error occurred. (${e})`;
    return Promise.resolve(error);
  };
  documents.forEach((doc) => {
    documentIDs.push(doc.id);
  });
  return Promise.resolve(documentIDs);
};