// Importing the database
import { db } from "../../database/Initalise"
import { collection, query, getDocs } from "firebase/firestore";

// Async function to retrieve all the document ID's for a given collection in the database
/**
 * Retrieves all document IDs from a given collection in the database based on an entered file path. Supports main collections and first layer document collections.
 * @param {string} collectionName The main top level collection in the database.
 * @param {string} mainDocument The snowflake of the document with the main collection.
 * @param {string} subCollection The collection ID of the sub collection within the specified document
 * @returns {Promise<string | string[]>} Returns a string[] of all document IDs (usually snowflakes) or returns a string if an error occurred.
 */
export async function retrieveDocumentIDs(collectionName: string, mainDocument?: string, subCollection?: string): Promise<string | string[]> {
  var q;
  let documentIDs: string[] = [];
  if(mainDocument && subCollection) {
    q = query(collection(db, collectionName, mainDocument, subCollection));
  } else {
    q = query(collection(db, collectionName));
  };
  let documents;
  try {
    documents = await getDocs(q);
  } catch (e) {
    console.log(e);
    return Promise.resolve("Error");
  };
  documents.forEach((doc) => {
    documentIDs.push(doc.id);
  });
  return Promise.resolve(documentIDs);
};
