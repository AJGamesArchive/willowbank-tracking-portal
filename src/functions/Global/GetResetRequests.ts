// Importing the database
import { db } from "../../database/Initalise"
import { getDoc, doc } from "firebase/firestore";
import { PasswordRequest } from "../../types/Global/PasswordRequest";

// Async function to retrieve all the document ID's for a given collection in the database
export async function getResetRequests(): Promise<string | PasswordRequest[]> {
    
    const docRef = doc(db, "requests", "password-resets");
    try 
    {
        const docPasswordReset = await getDoc(docRef);

        if (!docPasswordReset.exists())
        {
            return Promise.resolve("ERROR");
        }
        var requests: PasswordRequest[] = docPasswordReset.data().requests;
    }
    catch (e)
    {
        return Promise.resolve(`${e}`); 
    }
    return Promise.resolve(requests);
}