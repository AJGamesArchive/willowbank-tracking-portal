// Importing the database
import { db } from "../../database/Initalise"
import { setDoc, updateDoc, doc } from "firebase/firestore";
import { PasswordRequest } from "../../types/Global/PasswordRequest";
import { getResetRequests } from "./GetResetRequests";
import { getLogs } from "./GetLogs";
import { dateTime } from "./GenerateTimestamp";

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
        const index = allAccounts.findIndex(account => account.username === remove.username)
        console.log(allAccounts)
        console.log(remove)
        console.log(index)
        if (index > -1) 
        {
            allAccounts.splice(index, 1);
        }

        console.log(allAccounts)
        // Write back to database
        const docRef = doc(db, "requests", "password-resets");
        
        await setDoc(docRef, {
            activeRequests: (allAccounts.length === 0) ? false : true,
            requests: allAccounts
        });

        
        const logDocRef = doc(db, "requests", "password-resets", "request-logs", remove.created)
            updateDoc(logDocRef, {
                ignored: true,
                completed: dateTime()
            });

    // change to ignored and completed timestamp to current time
        // request -> created -> key for log request -> add boolean on end
        // request -> password-resets -> request-logs (key is date) set to true
        return Promise.resolve(true);
    }
    catch (e)
    {
        return Promise.resolve(false);
    }
}