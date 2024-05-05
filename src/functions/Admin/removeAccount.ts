// imports
import { db } from "../../database/Initalise";
import { runTransaction, doc } from "firebase/firestore";

export async function removeAccount(snowflake : string, accountType : string) {
    const docRef = doc(db, accountType, snowflake)
    
    try {
        await runTransaction(db, async (transaction) => {
            await transaction.delete(docRef)
        })
    } catch (e) {
        console.log(e);
        return Promise.resolve(false);
    }
    return Promise.resolve(true);
}