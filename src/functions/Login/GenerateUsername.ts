// Import types
import { UsernameGen } from "../../types/Login/UsernameGen";

// Import functions
import { isUniqueUsernameName } from "../Validation/IsUniqueUsername";

// Async function to generate a username based on a students first name and surname initial
export async function generateUsername(firstName: string, surnameInitial: string): Promise<UsernameGen> {
  // Generated a username and ensure it's unique - keeps generating usernames until it's get a unique username
  let counter: number = 1;
  let genUsername: string;
  while (true) {
    genUsername = `${firstName[0].toUpperCase()}${surnameInitial.toUpperCase()}${counter}`
    let isUnique: boolean | string = await isUniqueUsernameName(genUsername);
    if(typeof isUnique === "string") {
      return Promise.resolve({
        success: false,
        name: "",
      });
    };
    if(!isUnique) {
      counter++;
      continue;
    };
    break;
  };

  // Return generated username
  const success: UsernameGen = {
    success: true,
    name: genUsername,
  };
  return Promise.resolve(success);
};