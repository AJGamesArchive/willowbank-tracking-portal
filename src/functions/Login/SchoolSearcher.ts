// Importing the database
import { db } from "../../database/Initalise"
import { getDoc, doc, DocumentData } from "firebase/firestore";

// Import types
import { SchoolSearch } from "../../types/Login/SchoolSearch"

// Import functions
import { retrieveDocumentIDs } from "../Global/RetrieveDocumentIDs"

// Async function to check if a school exists from a given code
export async function schoolSearcher(code: string): Promise<SchoolSearch> {
  // Retrieve an array of all school IDs in the system
  const schoolIDs: string | string[] = await retrieveDocumentIDs('schools');
  
  // Ensure all id's were returned correctly
  if (typeof schoolIDs === "string") {
    const error: SchoolSearch = {
      exists: false,
      schoolName: 'n/a',
      errored: true,
      errorMessage: {
        severity: 'danger',
        header: 'Unexpected Error',
        message: `School IDs could not be retrieved. ${schoolIDs}`
      },
    };
    return Promise.resolve(error);
  };

  // Check that the entered school code is valid
  let validCode: boolean = false;
  schoolIDs.forEach((id) => {
    if (id === code) {
      validCode = true;
    };
  });
  if (!validCode) {
    const error: SchoolSearch = {
      exists: false,
      schoolName: 'n/a',
      errored: true,
      errorMessage: {
        severity: 'danger',
        header: 'Invalid School ID',
        message: `The entered school ID could not be found. Please try a different school code.`
      },
    };
    return Promise.resolve(error);
  };

  // Retrieve the name of the school that matches the given school code
  const docRef = doc(db, "schools", code);
  let docSchool;
  try {
    docSchool = await getDoc(docRef);
  } catch (e) {
    const error: SchoolSearch = {
      exists: true,
      schoolName: 'Could not be found.',
      errored: true,
      errorMessage: {
        severity: 'danger',
        header: 'Unexpected Error Occurred',
        message: `The name of the school that matches the given code could not be found. Please try again.`
      },
    };
    return Promise.resolve(error);
  };
  if (docSchool.exists()) {
    const docData: DocumentData = docSchool.data();
    const schoolName: string = docData.name;
    const confirmation: SchoolSearch = {
      exists: true,
      schoolName: schoolName,
      errored: false,
      errorMessage: {
        severity: 'success',
        header: 'Success',
        message: `The name of the school was retrieved successfully.`
      },
    };
    return Promise.resolve(confirmation);
  };

  // Return an unexpected error for when the school exists but the document does not exist?
  const error: SchoolSearch = {
    exists: true,
    schoolName: 'Could not be found.',
    errored: true,
    errorMessage: {
      severity: 'danger',
      header: 'Unexpected Error Occurred',
      message: `The data of the school that matches the given code could not be found. Please try again.`
    },
  };
  return Promise.resolve(error);
};