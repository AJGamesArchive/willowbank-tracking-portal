import { db } from "../../../database/Initalise";
import { getDoc, doc } from "firebase/firestore";
import { ActivityRequests } from "../../../types/Global/ActivityCompletionRequests";

/**
 * Async function to retrieve all active activity completion requests from the DB
 * @returns An array of all active activity completion requests or a string to indicate an error occurred
 * @AJGamesArchive
 */
export async function retrieveActivityRequests(): Promise<ActivityRequests[] | string> {
  const docRef = doc(db, "requests", "activity-completions");
  let document;
  let requests: ActivityRequests[] = [];
  try {
    document = await getDoc(docRef);
    if(!document.exists()) return Promise.resolve("Error");
    requests = document.data().requests;
  } catch (e) {
    console.log(e);
    return Promise.resolve("Error");
  };
  return Promise.resolve(requests);
};