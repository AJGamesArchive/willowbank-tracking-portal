// Importing the database
import { db } from "../../database/Initalise"
import { doc, DocumentData, runTransaction } from "firebase/firestore";
import { CoreStaffAccountDetails } from "../../types/Global/UserAccountDetails";


// Import functions
import { generateToken } from "../Global/GenerateToken";
import { snowflake } from "../../classes/Snowflake";

export async function createStaffAccount (accountType : string, schoolCode : string[], schoolName : string[], firstName : string, surname : string, username : string, password : string) : Promise<boolean> {
    // Generate account token and snowflake
    const token : string = generateToken();
    const accountSnowflake : string = snowflake.generate();

    const coreAccountDetails : CoreStaffAccountDetails = {
        snowflake: accountSnowflake,
        username: username,
        firstName: firstName,
        surname: surname,
        password: password,
        schools: schoolCode,
        token: token,
    }

    // Try to create the account
    try 
    { 
        const result = await runTransaction (db, async (transaction): Promise<boolean> =>
        {
            // allSuccessful is false until whole transaction has worked as
            // expected

             // Checking school codes are all correct
            for (var i = 0; i < schoolCode.length; i++)
            {
                const schoolDocRef = doc(db, "schools", schoolCode[i]);
                let schoolDoc = await transaction.get(schoolDocRef);

                // If document doesn't exist return 
                if (!schoolDoc.exists()) {
                    return Promise.resolve(false);
                };
                let docData : DocumentData = schoolDoc.data();
                
                // If problem with school name return 
                //This if statement is check if an existing school name is equal to an array of strings?
                if (docData.name !== schoolName[i]) {
                    return Promise.resolve(false);
                };
                
                // For teacher
                if (accountType === 'teachers')
                {
                    // Add teacher's snowflake to school
                    let schoolTeach : string[] = docData.teacher
                    schoolTeach.push(accountSnowflake);
                    await transaction.update(doc(db, "teachers", schoolCode[i]), {
                        teachers : schoolTeach,
                    })
                }
                // For admin
                else
                {
                    // Add admin's snowflake to school
                    let schoolAdmins : string[] = docData.admins
                    schoolAdmins.push(accountSnowflake);
                    await transaction.update(doc(db, "admins", schoolCode[i]), {
                        admins : schoolAdmins,
                    });                
                }
                
            }

            if (accountType === 'teachers')
            {
                await transaction.set(doc(db, "teachers", accountSnowflake), coreAccountDetails);
            }
            else if (accountType === 'admins')
            {
                await transaction.set(doc(db, "admins", accountSnowflake), coreAccountDetails);
            }
            
            return Promise.resolve(true)
        });
        return Promise.resolve(result)
    }
    catch (e)
    {
        return Promise.resolve(false)
    }
}   