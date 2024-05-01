import { db } from "../../database/Initalise";
import { getDoc, doc } from "firebase/firestore";

// Async function to return the name of a school based on a given school code
export async function getSchoolName(code: string): Promise<string | undefined> {
  const docRef = doc(db, "schools", code);
  let document;
  let schoolName: string = '';
  try {
    document = await getDoc(docRef);
    if(!document.exists()) return Promise.resolve(undefined);
    schoolName = document.data().name;
  } catch (e) {
    console.log(e);
    return Promise.resolve(undefined);
  };
  return Promise.resolve(schoolName);
};