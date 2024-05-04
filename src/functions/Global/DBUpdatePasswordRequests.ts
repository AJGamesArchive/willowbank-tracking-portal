// Importing the database
import { db } from "../../database/Initalise"
import { getDoc, doc, runTransaction } from "firebase/firestore";
import { PasswordRequest } from "../../types/Global/PasswordRequest";
import { getResetRequests } from "./GetResetRequests";
import { dateTimeReadable } from "./GenerateTimestamp";
import { generatePassword } from '../../functions/Login/GeneratePassword.ts';

// JESS COMMENT YOUR FUNCTION PROPERLY
export async function removeResetRequest(remove : PasswordRequest, ignore : Boolean, newPassword: string): Promise<boolean> {
    try 
    {
        // Pull all accounts from database
        const allAccounts = await getResetRequests();
        
        // Ignore if string
        if ( typeof allAccounts === "string")
        {
            return Promise.resolve(false);
        };
        
        // Remove password request
        const index = allAccounts.findIndex(account => account.snowflake === remove.snowflake)
        if (index > -1) 
        {
            allAccounts.splice(index, 1);
        };

        // Write back to database
        const docRef = doc(db, "requests", "password-resets");

        // Transaction to write data
        await runTransaction(db, async (transaction): Promise<void> => {
            await transaction.set(docRef, {
                activeRequests: (allAccounts.length === 0) ? false : true,
                requests: allAccounts
            });
            const logDocRef = doc(db, "requests", "password-resets", "request-logs", remove.created)
            await transaction.update(logDocRef, {
                ignored: ignore,
                completed: dateTimeReadable(),
                newPassword: newPassword,
            });
        });

        return Promise.resolve(true);
    }
    catch (e)
    {
        return Promise.resolve(false);
    };
};

export async function resetPassword ( account : PasswordRequest ) : Promise<string>
{
    const docRef = doc(db, `${account.accountType}`, `${account.snowflake}`);
    try
    {
        const Account = await getDoc(docRef)
        if (!Account.exists()) {
            return Promise.resolve("");
        }
        var name : string = Account.data().firstName
        var surnameInitial : string = Account.data().surnameInitial
        var newPassword = generatePassword(name, surnameInitial)
        await runTransaction(db, async (transaction): Promise<void> => {
            await transaction.update(docRef, {
                password : newPassword
            });
        });
        return Promise.resolve(newPassword);
    }
    catch (e) {
        return Promise.resolve("")
    }
}