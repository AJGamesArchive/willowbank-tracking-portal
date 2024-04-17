// Importing the database
import { db } from "../../database/Initalise"
import { setDoc, doc } from "firebase/firestore";
import { PasswordRequest } from "../../types/Global/PasswordRequest";
import { getResetRequests } from "./GetResetRequests";
import { getLogs } from "./GetLogs";

// Async function to retrieve all the document ID's for a given collection in the database
export async function removeResetRequest(remove : PasswordRequest): Promise<boolean> {
    try 
    {
        // Pull all accounts from database
        const allAccounts = await getResetRequests();
        
        // Ignore if string
        if ( typeof allAccounts === "string")
        {
            return Promise.resolve(false);
        }
        
        // Remove password request
        const index = allAccounts.indexOf(remove);
        if (index > -1) 
        {
            allAccounts.splice(index, 1);
        }

        // Write back to database
        const docRef = doc(db, "requests", "password-resets");
        await setDoc(docRef, allAccounts), 
        {
            activeRequests: (allAccounts.length === 0) ? false : true,
            requests: allAccounts
        };

        const logs = getLogs();
        if (typeof logs === "string")
        {
            
        }
        // request -> created -> key for log request -> add boolean on end
        // request -> password-resets -> request-logs (key is date) set to true
        return Promise.resolve(true);
    }
    catch (e)
    {
        return Promise.resolve(false);
    }
}