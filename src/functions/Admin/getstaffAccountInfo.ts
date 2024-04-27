import { db } from "../../database/Initalise";
import { getDocs, query, collection, DocumentData } from "firebase/firestore";

// Import types
import { CoreStudentAccountDetails } from "../../types/Global/UserAccountDetails";
import { CoreStaffAccountDetails } from "../../types/Global/UserAccountDetails";


export async function getstaffAccountInfo(accountType: string): Promise< CoreStaffAccountDetails[] | string> {

//sets arrays to store student , teacher and admin data
let teacherData: CoreStaffAccountDetails[] = [];
let adminData: CoreStaffAccountDetails[] = [];

//creates querys for searching database
const qT = query(collection(db, "teachers"));
const qA = query(collection(db, "admins"));

//creates document variables to store account infromation
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
      surnameInitial: docData.surnameInitial,
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
      surnameInitial: docData.surnameInitial,
      password: docData.password,
      schools: docData.school,
      token: docData.token
    };
    adminData.push(aData);
});



switch (accountType) {
    case "T":{
        return Promise.resolve (teacherData) ; 
        break;
     }
    case "A":{
        return Promise.resolve (adminData) ;
        break;
    }
}
  return Promise.resolve("Error");
}