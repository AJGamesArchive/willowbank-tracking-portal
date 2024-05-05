import { db } from "../../database/Initalise";
import { doc, runTransaction } from "firebase/firestore";

/**
 * async function to take in core account details and update the given details in the DB
 * @param {string} accountType The name of the collection that the given account is tied to in the database (students, teachers, admins)
 * @param {string} snowflake The snowflake ID of the account that needs details updating
 * @param {string} firstName The updated account first name - Pass in 'undefined' to ignore param
 * @param {string} surnameInitial The updated account surname initial - Pass in 'undefined' to ignore param
 * @param {string} username The updated account username - Pass in 'undefined' to ignore param
 * @param {string} password The updated account password - Pass in 'undefined' to ignore param
 * @returns {Promise<boolean>} Returns either true or false to indicate whether the operation was successful or not.
 * @Ethan
 */
export async function updateCoreAccountDetails(accountType: string, snowflake: string, firstName: string = "", surnameInitial: string = "", username: string = "", password: string = "",school: string[] = []): Promise<boolean> {
  // Ensure at least 1 core detail needs updating
  if(!firstName && !surnameInitial && !username && !password) return Promise.resolve(false);
  // Collect all core details and put them into an object
  let details: any = {};
  if(firstName) details.firstName = firstName;
  if(username) details.username = username;
  if(password) details.password = password;
  if (accountType === 'students')
    {
      if(school.length !== 0) details.school = school[0]
      if(surnameInitial) details.surnameInitial = surnameInitial;
    }
  else 
    {
    if(school.length !== 0) details.schools = school
    if (surnameInitial) details.surname = surnameInitial;
    }
  // Update the DB
  try {
    await runTransaction(db, async (transaction): Promise<void> => {
      await transaction.update(doc(db, accountType, snowflake), details);
    });
  } catch (e) {
    console.log(e);
    return Promise.resolve(false);
  };
  return Promise.resolve(true);
};