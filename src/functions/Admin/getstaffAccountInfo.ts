import { db } from "../../database/Initalise";
import { getDocs, query, collection, DocumentData } from "firebase/firestore";

// Import types
import { CoreStaffAccountDetails } from "../../types/Global/UserAccountDetails";

/**
 * Async function to retrieve all staff accounts info
 * @param accountType The type of account to retrieve data for (teachers, admins)
 * @returns An array of all account details for a collection of staff accounts
 * @AJGamesArchive
 */
export async function getStaffAccountInfo(accountType: string): Promise< CoreStaffAccountDetails[] | string> {

  //sets arrays to store student , teacher and admin data
  let staffData: CoreStaffAccountDetails[] = [];

  // Creates queries for searching database
  const q = query(collection(db, accountType));

  // Creates document variables to store account information
  let document;

  //fetches document data for teacher
  try {
    document = await getDocs(q);
  } catch (e) {
    console.log(e);
    return Promise.resolve("Error");
  };

  //saves data for teacher
  document.forEach((d) => {
    const docData: DocumentData = d.data();
    const tData: CoreStaffAccountDetails = {
      snowflake: docData.snowflake,
      username: docData.username,
      firstName: docData.firstName,
      surname: docData.surname,
      password: docData.password,
      schools: docData.schools,
      token: docData.token
    };
    staffData.push(tData);
  });

  return Promise.resolve(staffData);
};