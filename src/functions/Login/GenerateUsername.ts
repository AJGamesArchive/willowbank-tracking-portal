// Import types
import { UsernameGen } from "../../types/Login/UsernameGen";

// Import functions
import { retrieveDocumentIDs } from "../Global/RetrieveDocumentIDs";

// Async function to generate a username based on a students first name and surname initial
export async function generateUsername(firstName: string, surnameInitial: string): Promise<UsernameGen> {
  // Retrieve an array of all existing usernames
  const studentUsernames: string | string[] = await retrieveDocumentIDs("students");
  if (typeof studentUsernames === "string") {
    const error: UsernameGen = {
      success: false,
      name: "",
    };
    return Promise.resolve(error);
  };

  // Generated a username and ensure it's unique - keeps generating usernames until it's get a unique username
  let counter: number = 1;
  let genUsername: string;
  while (true) {
    genUsername = `${firstName[0]}${surnameInitial}${counter}`
    let isUnique: boolean = true;
    studentUsernames.forEach((existingUsername) => {
      if (existingUsername === genUsername) {
        counter++;
        isUnique = false;
      };
    });
    if (isUnique) {
      break;
    };
  };

  // Return generated username
  const success: UsernameGen = {
    success: true,
    name: genUsername,
  };
  return Promise.resolve(success);
};