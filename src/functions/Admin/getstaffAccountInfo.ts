import { db } from "../../database/Initalise";
import { getDocs, query, collection, DocumentData } from "firebase/firestore";

// Import types
import { CoreStaffAccountDetails } from "../../types/Global/UserAccountDetails";

/**
 * Async function to retrieve all staff accounts info
 * @param accountType The type of account to retrieve data for (teachers, admins)
 * @returns An array of all account details for a collection of staff accounts
 */
export async function getstaffAccountInfo(accountType: string): Promise< CoreStaffAccountDetails[] | string> {

  //sets arrays to store student , teacher and admin data
  let teacherData: CoreStaffAccountDetails[] = [];
  let adminData: CoreStaffAccountDetails[] = [];

  // Creates queries for searching database
  const qT = query(collection(db, "teachers"));
  const qA = query(collection(db, "admins"));

  // Creates document variables to store account information
  let docT;
  let docA;

  //fetches document data for teacher
  try {
      docT = await getDocs(qT);
    } catch (e) {
      return Promise.resolve("Error");
    };

  // fetches document data for admin
  try {
      docA = await getDocs(qA);
    } catch (e) {
      return Promise.resolve("Error");
    };


  //saves data for teacher
  docT.forEach((d) => {
    const docData: DocumentData = d.data();
    const tData: CoreStaffAccountDetails = {
      snowflake: docData.snowflake,
      username: docData.username,
      firstName: docData.firstname,
      surname: docData.surname,
      password: docData.password,
      schools: docData.school,
      token: docData.token
    };
    teacherData.push(tData);
  });

  //saves data for admin
  docA.forEach((d) => {
    const docData: DocumentData = d.data();
    const aData: CoreStaffAccountDetails = {
      snowflake: docData.snowflake,
      username: docData.username,
      firstName: docData.firstname,
      surname: docData.surname,
      password: docData.password,
      schools: docData.school,
      token: docData.token
    };
    adminData.push(aData);
  });

  switch (accountType) {
    case "T":{
      return Promise.resolve (teacherData);
    }
    case "A":{
        return Promise.resolve (adminData);
      }
  }
  return Promise.resolve("Error");
};