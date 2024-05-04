import { db } from "../../database/Initalise"
import { getDoc, doc } from "firebase/firestore";
import { PasswordRequestLog } from "../../types/Global/PasswordRequest";

// JESS COMMENT YOUR FUNCTION PROPERLY
export async function getLogs() : Promise<string | PasswordRequestLog[]> {
    
    const docRef = doc(db, "requests", "password-resets", "request-logs");
    try
    {
        const logs = await getDoc(docRef);
        if (logs.exists())
        {
            var Logs = logs.data().data;
        }
    }
    catch (e)
    {
        return Promise.resolve(`${e}`); 
    }
    return Promise.resolve(Logs);
}