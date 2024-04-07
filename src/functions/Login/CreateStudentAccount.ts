// Importing the database
import { db } from "../../database/Initalise"
import { getDoc, doc, DocumentData, setDoc, updateDoc } from "firebase/firestore";

// Import functions
import { generateToken } from "../Global/GenerateToken";

// Async function to handle the creation of new student accounts and adding new students to existing schools when accounts are created
export async function createStudentAccount(schoolCode: string, schoolName: string, firstName: string, surnameInitial: string, username: string, password: string): Promise<boolean> {
  // Generate an account token
  const token: string = generateToken();
  // Create the account
  try {
    const schoolDocRef = doc(db, "schools", schoolCode);
    let schoolDoc = await getDoc(schoolDocRef);
    if (!schoolDoc.exists()) {
      return false;
    };
    let docData: DocumentData = schoolDoc.data();
    if (docData.name !== schoolName) {
      return false;
    };
    let schoolStudents: string[] = docData.students;
    schoolStudents.push(username.toUpperCase());
    await updateDoc(doc(db, "schools", schoolCode), {
      students: schoolStudents,
    });
    await setDoc(doc(db, "students", username.toUpperCase()), {
      display: username,
      firstName: firstName,
      surnameInitial: surnameInitial,
      password: password,
      school: schoolCode,
      token: token,
    });
  } catch (e) {
    return false;
  };
  return true;
};