// Importing database connections
import { db } from "../../database/Initalise";
import { getDocs, collection, DocumentData, query } from "firebase/firestore";

// Async function to validate that a given new username is unique
export async function isUniqueUsernameName(username: string): Promise<boolean | string> {
  const queryS = query(collection(db, "students"));
  const queryT = query(collection(db, "teachers"));
  const queryA = query(collection(db, "admins"));
  let studentDocs;
  let teacherDocs;
  let adminDocs;
  try {
    studentDocs = await getDocs(queryS);
    teacherDocs = await getDocs(queryT);
    adminDocs = await getDocs(queryA);
  } catch (e) {
    console.log(e);
    return Promise.resolve(String(e));
  };
  let foundMatch: boolean = false;
  studentDocs.forEach((doc) => {
    const docData: DocumentData = doc.data();
    if(docData.username.toUpperCase() === username.toUpperCase()) {foundMatch = true;}
  });
  teacherDocs.forEach((doc) => {
    const docData: DocumentData = doc.data();
    if(docData.username.toUpperCase() === username.toUpperCase()) {foundMatch = true;}
  });
  adminDocs.forEach((doc) => {
    const docData: DocumentData = doc.data();
    if(docData.username.toUpperCase() === username.toUpperCase()) {foundMatch = true;}
  });
  if(foundMatch) {return Promise.resolve(false);}
  return Promise.resolve(true);
};