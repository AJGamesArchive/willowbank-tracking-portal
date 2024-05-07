// imports
import { db } from "../../database/Initalise";
import { runTransaction, doc } from "firebase/firestore";
import { retrieveDocumentIDs } from "../Global/RetrieveDocumentIDs";

/**
 * Function to delete a user from the system completely.
 * @param snowflake Snowflake of the account to delete
 * @param accountType Type of account to be deleted (students, teachers, admins)
 * @returns Returns a boolean to indicate whether the process was successful or not.
 */
export async function removeAccount(snowflake : string, accountType : string): Promise<boolean> {
    const docRef = doc(db, accountType, snowflake)
    try {
        let activeProgramSnowflakes: string[] | string = await retrieveDocumentIDs(accountType, snowflake, "programs");
        if(typeof activeProgramSnowflakes === "string") return Promise.resolve(false);
        await runTransaction(db, async (transaction) => {
            await activeProgramSnowflakes.forEach(async (p) => {
                await transaction.delete(doc(db, accountType, snowflake, "programs", p));
            });
            await transaction.delete(docRef)
        });
    } catch (e) {
        console.log(e);
        return Promise.resolve(false);
    };
    return Promise.resolve(true);
};