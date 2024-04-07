// Import data
import { animalTypes } from "../../data/AnimalData";

// Function to generate a password based on the users imputed first name and surname initial
// Returns a password in the format of: [Surname Initial][Animal Name][Forename Initial][@][Current Seconds]
// Example - wELEPHANTA@39
export function generatePassword(firstName: string, surnameInitial: string): string {
  // Declare base password variable
  let password: string;

  // Declaring array to store letter casing options
  const letterCasingOptions: boolean[] = [true, false];

  // Add surname initial to password and randomize it's case
  password = (letterCasingOptions[Math.floor(Math.random() * letterCasingOptions.length)]) ? `${surnameInitial.toUpperCase()}` : `${surnameInitial.toLowerCase()}`;

  // Add random animal name to password and randomize it's case
  password += (letterCasingOptions[Math.floor(Math.random() * letterCasingOptions.length)]) ? `${animalTypes[Math.floor(Math.random() * animalTypes.length)].toUpperCase()}` : `${animalTypes[Math.floor(Math.random() * letterCasingOptions.length)].toLowerCase()}`;

  // Add forename initial to password and randomize it's case
  password += (letterCasingOptions[Math.floor(Math.random() * letterCasingOptions.length)]) ? `${firstName[0].toUpperCase()}` : `${firstName[0].toLowerCase()}`;

  // Add an '@' to password
  password += "@";

  // Add a timestamp to the end of the password in the form of the current seconds
  password += `${new Date().getSeconds()}`;

  return password;
};