// Importing the database
import { db } from "../../database/Initalise"
import { getDoc, doc } from "firebase/firestore";

// Async function to retrieve all the document ID's for a given collection in the database
export async function getResetRequests(): Promise<string | string[]> {
    const docRef = doc(db, "requests", "password-resets");
    const docPasswordReset = await getDoc(docRef);

    if (docPasswordReset.exists())
    {
        var requests = docPasswordReset.data().requests;
    }
    else
    {
        const error: string = `An unexpected error occurred.`;
        return Promise.resolve(error)
    }

    return Promise.resolve(requests);
}