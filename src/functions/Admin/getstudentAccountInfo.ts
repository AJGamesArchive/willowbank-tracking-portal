import { db } from "../../database/Initalise";
import { getDocs, query, collection, DocumentData } from "firebase/firestore";

// Import types
import { CoreStudentAccountDetails } from "../../types/Global/UserAccountDetails";
import { CoreStaffAccountDetails } from "../../types/Global/UserAccountDetails";


export async function getStudentAccountInfo(accountType: string): Promise<CoreStudentAccountDetails[] | string> {

//sets arrays to store student , teacher and admin data
let studentData: CoreStudentAccountDetails[] = [];


//creates querys for searching database
const qS = query(collection(db, "students"));


//creates document variables to store account infromation
let docS;


//fetches document data for student
try {
    docS = await getDocs(qS);
  } catch (e) {
    return Promise.resolve("Error");
  };


 // saves data for student 
 
 docS.forEach((d) => {
    const docData: DocumentData = d.data();
    const sData: CoreStudentAccountDetails = {
      snowflake: docData.snowflake,
      username: docData.username,
      firstName: docData.firstname,
      surnameInitial: docData.surnameInitial,
      password: docData.password,
      school: docData.school,
      token: docData.token
    };
    studentData.push(sData);
 });


return Promise.resolve (studentData); }