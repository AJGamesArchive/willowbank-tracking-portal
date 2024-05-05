import { db } from "../../../database/Initalise";
import { doc, runTransaction } from "firebase/firestore";
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
    const success: string | null = await runTransaction(db, async (transaction): Promise<string | null> => {
      document = await transaction.get(docRef);
      if(!document.exists()) return Promise.resolve("Error");
      requests = document.data().requests;
      return null;
    });
    if(typeof success === "string") return Promise.resolve("Error");
  } catch (e) {
    console.log(e);
    return Promise.resolve("Error");
  };
  return Promise.resolve(requests);
};