// Importing the database
import { db } from "../../database/Initalise";
import { getDoc, doc, query, collection, getDocs, DocumentData, runTransaction } from "firebase/firestore";

// Import functions
import { dateTime } from "../Global/GenerateTimestamp";
import { dateTimeReadable } from "../Global/GenerateTimestamp";

// Import types
import { PasswordRequest } from "../../types/Global/PasswordRequest";
import { PasswordRequestLog } from "../../types/Global/PasswordRequest";

// Async function to create a password reset request for a given user
export async function createPasswordRequest(username: string, accountType: string): Promise<boolean> {
  // Get the current timestamp
  const timestamp: string = dateTime();
  var accountSnowflake: string = "";
  try {
    // Retrieve the entered users snowflake
    const q = query(collection(db, accountType));
    const accounts = await getDocs(q);
    accounts.forEach((a) => {
      const data: DocumentData = a.data();
      if(data.username.toUpperCase() === username.toUpperCase()) {
        accountSnowflake = data.snowflake;
        return;
      };
    });
    if(accountSnowflake === "") {Promise.resolve(false);}

    // Retrieve array of existing requests
    const docRef = doc(db, "requests", "password-resets");
    const docPassReset = await getDoc(docRef);
    let requestsArray: PasswordRequest[] = [];
    if(docPassReset.exists()) {
      requestsArray = docPassReset.data().requests;
    };

    // Ensure that there isn't already an active reset request
    let exists: boolean = false;
    requestsArray.forEach((r) => {
      if(r.snowflake === accountSnowflake) exists = true;
    });
    if(exists) return Promise.resolve(true);

    // Add a new request to array of requests and create a request log object
    requestsArray.push({
      snowflake: accountSnowflake,
      username: username,
      accountType: accountType,
      created: timestamp,
    });
    const requestsLogArray: PasswordRequestLog = {
      snowflake: accountSnowflake,
      username: username,
      accountType: accountType,
      created: dateTimeReadable(),
      completed: "",
      newPassword: "",
      ignored: false,
    };

    // Transaction to write data to DB
    await runTransaction(db, async (transaction): Promise<void> => {
      // Save updated request array to DB and activate active requests flag
      await transaction.set(doc(db, "requests", "password-resets"), {
        activeRequests: true,
        requests: requestsArray,
      });
      
      // Save request log object to DB
      await transaction.set(doc(db, "requests", "password-resets", "request-logs", timestamp), requestsLogArray);
    });
  } catch (e) {
    return Promise.resolve(false);
  };
  return Promise.resolve(true);
};
