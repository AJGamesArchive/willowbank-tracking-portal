// Importing the database
import { db } from "../../database/Initalise";
import { getDoc, doc, setDoc } from "firebase/firestore";

// Import functions
import { dateTime } from "../Global/GenerateTimestamp";

// Import types
import { PasswordRequest } from "../../types/Global/PasswordRequest";
import { PasswordRequestLog } from "../../types/Global/PasswordRequest";

// Async function to create a password reset request for a given user
export async function createPasswordRequest(username: string, accountType: string): Promise<boolean> {
  // Get the current timestamp
  const timestamp: string = dateTime();
  try {
    // Retrieve array of existing requests
    const docRef = doc(db, "requests", "password-resets");
    const docPassReset = await getDoc(docRef);
    let requestsArray: PasswordRequest[] = [];
    if(docPassReset.exists()) {
      requestsArray = docPassReset.data().requests;
    };
    // Add a new request to array of requests and create a request log object
    requestsArray.push({
      username: username.toUpperCase(),
      accountType: accountType,
      created: timestamp,
    });
    const requestsLogArray: PasswordRequestLog = {
      username: username.toUpperCase(),
      accountType: accountType,
      created: timestamp,
      completed: "",
      newPassword: "",
      ignored: false,
    };
    // Save updated request array to DB and activate active requests flag
    await setDoc(doc(db, "requests", "password-resets"), {
      activeRequests: true,
      requests: requestsArray,
    });
    // Save request log object to DB
    await setDoc(doc(db, "requests", "password-resets", "request-logs", timestamp), requestsLogArray);
  } catch (e) {
    return Promise.resolve(false);
  };
  return Promise.resolve(true);
};
