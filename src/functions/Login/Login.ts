// Importing the database
import { db } from "../../database/Initalise";
import { getDoc, doc, DocumentData } from "firebase/firestore";

// Importing types
import { AccountLogin } from "../../types/Login/AccountLogin";

// Async Function that takes the entered account credentials and handles the login process and validation
export async function login(accountType: string, username: string, password: string): Promise<AccountLogin> {
  // Detect what account type is logging in and set the DB file path accordingly
  let db_collection: string;
  switch(accountType) {
    case ("Admin"): // Admin login handler
      db_collection = "admins";
      break;
    case ("Teacher"): // Teacher login handler
      db_collection = "teachers";
      break;
    default: // Student login handler
      db_collection = "students";
      break;
  };
  // Check if the entered username and password match
  try {
    const docUserRef = doc(db, db_collection, username.toUpperCase());
    const docUser = await getDoc(docUserRef);
    if (!docUser.exists()) {
      return {successful: false, token: "", username: ""};
    };
    const docData: DocumentData = docUser.data();
    if (docData.password !== password) {
      return {successful: false, token: "", username: ""};
    };
    return {successful: true, token: docData.token, username: docData.display};
  } catch (e) {
    return {successful: false, token: "", username: ""};
  };
};