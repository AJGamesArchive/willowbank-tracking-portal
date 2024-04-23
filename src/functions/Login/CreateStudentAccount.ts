// Importing the database
import { db } from "../../database/Initalise"
import { getDoc, doc, DocumentData, setDoc, updateDoc, query, collection, getDocs } from "firebase/firestore";
import { CoreStudentAccountDetails } from "../../types/Global/UserAccountDetails";
import { XPStudentAccountDetails } from "../../types/Global/UserAccountDetails";

// Import functions
import { generateToken } from "../Global/GenerateToken";
import { snowflake } from "../../classes/Snowflake";

// Async function to handle the creation of new student accounts and adding new students to existing schools when accounts are created
export async function createStudentAccount(schoolCode: string, schoolName: string, firstName: string, surnameInitial: string, username: string, password: string): Promise<boolean> {
  // Generate an account token
  const token: string = generateToken();

  // Generate an account snowflake
  const accountSnowflake: string = snowflake.generate();

  // Create the account data objects
  const coreDetails: CoreStudentAccountDetails = {
    snowflake: accountSnowflake,
    username: username,
    firstName: firstName,
    surnameInitial: surnameInitial,
    password: password,
    school: schoolCode,
    token: token,
  };

  // Create the account
  try {
    // Assign the new student to their school
    const schoolDocRef = doc(db, "schools", schoolCode);
    let schoolDoc = await getDoc(schoolDocRef);
    if (!schoolDoc.exists()) {
      return Promise.resolve(false);
    };
    let docData: DocumentData = schoolDoc.data();
    if (docData.name !== schoolName) {
      return Promise.resolve(false);
    };
    let schoolStudents: string[] = docData.students;
    schoolStudents.push(accountSnowflake);
    await updateDoc(doc(db, "schools", schoolCode), {
      students: schoolStudents,
    });

    // Create student account document
    await setDoc(doc(db, "students", accountSnowflake), coreDetails);

    // Retrieve all program data
    const programQuery = query(collection(db, "programs"));
    const programDocs = await getDocs(programQuery);
    const programData: DocumentData[] = [];
    programDocs.forEach((d) => {
      const docData: DocumentData = d.data();
      programData.push(docData);
    });

    // Assign all programs to the new student
    for(let i = 0; i < programData.length; i++) {
      const xpDetails: XPStudentAccountDetails = {
        programName: programData[i].name,
        currentLevel: 1,
        currentXP: 0,
        targetXP: 100,
        completedActivities: [],
      };
      await setDoc(doc(db, "students", accountSnowflake, "programs", programData[i].snowflake), xpDetails);
    };
  } catch (e) {
    return Promise.resolve(false);
  };
  return Promise.resolve(true);
};