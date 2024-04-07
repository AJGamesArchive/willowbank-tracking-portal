// Importing the database
import { db } from "../../database/Initalise";
import { getDoc, doc, DocumentData } from "firebase/firestore";

// Async function to confirm the login of a user when an internal page is called
export async function confirmLogin(accountType: string, username: string | undefined, token: string | undefined): Promise<boolean> {
  if (typeof username === "undefined" || typeof token === "undefined") { return Promise.resolve(false); };
  // Check if the given user is logged in
  try {
    const docUserRef = doc(db, accountType, username.toUpperCase());
    const docUser = await getDoc(docUserRef);
    if (!docUser.exists()) {
      return Promise.resolve(false);
    };
    const docData: DocumentData = docUser.data();
    if (docData.token !== token) {
      return Promise.resolve(false);
    };
    return Promise.resolve(true);
  } catch (e) {
    return Promise.resolve(false);
  };
};