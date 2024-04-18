// Importing the database
import { db } from "../../database/Initalise"
import { getDoc, setDoc, updateDoc, doc } from "firebase/firestore";
import { PasswordRequest } from "../../types/Global/PasswordRequest";
import { getResetRequests } from "./GetResetRequests";
import { dateTime } from "./GenerateTimestamp";
import { generatePassword } from '../../functions/Login/GeneratePassword.ts';

// Async function to retrieve all the document ID's for a given collection in the database
export async function removeResetRequest(remove : PasswordRequest, ignore : Boolean): Promise<boolean> {
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
        if (index > -1) 
        {
            allAccounts.splice(index, 1);
        }

        // Write back to database
        const docRef = doc(db, "requests", "password-resets");
        
        await setDoc(docRef, {
            activeRequests: (allAccounts.length === 0) ? false : true,
            requests: allAccounts
        });

        const logDocRef = doc(db, "requests", "password-resets", "request-logs", remove.created)
            updateDoc(logDocRef, {
                ignored: ignore,
                completed: dateTime()
            });

        return Promise.resolve(true);
    }
    catch (e)
    {
        return Promise.resolve(false);
    }
}

export async function resetPassword ( account : PasswordRequest ) : Promise<string>
{
    const docRef = doc(db, `${account.accountType}`, `${account.username}`)
    console.log(docRef)
    try
    {
        const Account = await getDoc(docRef)
        if (!Account.exists()) {
            return Promise.resolve("");
        }
        var name : string = Account.data().firstName
        var surnameInitial : string = Account.data().surnameInitial
        var newPassword = generatePassword(name, surnameInitial)
        await updateDoc(docRef, {
            password : newPassword
        });
        return Promise.resolve(newPassword);
    }
    catch (e) {
        return Promise.resolve("")
    }
}