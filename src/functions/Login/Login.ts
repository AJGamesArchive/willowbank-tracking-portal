// Importing the database
import { db } from "../../database/Initalise";
import { getDocs, DocumentData, query, collection } from "firebase/firestore";

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

  // Create data object to return
  let details: AccountLogin = {
    successful: false,
    token: "",
    snowflake: "",
    name: "",
  };

  // Check if the entered username and password match
  try {
    // Retrieve all account data and check for matching account
    const q = query(collection(db, db_collection));
    const accounts = await getDocs(q);
    accounts.forEach((a) => {
      const data: DocumentData = a.data();
      if(data.username.toUpperCase() === username.toUpperCase() && data.password === password) {
        details.successful = true;
        details.token = data.token;
        details.snowflake = data.snowflake;
        details.name = data.firstName;
        return;
      };
    });
  } catch (e) {
    console.log(e);
  };
  return Promise.resolve(details);
};