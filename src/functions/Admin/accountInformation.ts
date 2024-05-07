import { db } from "../../database/Initalise";
import { doc, getDoc } from "firebase/firestore";

// Define a type for the user data
export interface UserData {
    username: string;
    firstName: string;
    surnameInitial: string;
    surname: string;
    school:string;
    schools: string[];
    password: string;
    snowflake: string;
}

//TODO Maybe remove this function??
// Function to retrieve user data from the database
export async function getUserData(snowflake: string, category: string): Promise<UserData | string> {
    try {
        const docRef = doc(db, category, snowflake);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            // Extract data from the document snapshot
            const userData: UserData = docSnap.data() as UserData;
            console.log("here: ",userData)
            return Promise.resolve(userData);
        } else {
            // Document does not exist
            console.log("error")
            return Promise.resolve("Error");
        };
    } catch (error) {
        console.error("Error fetching user data:", error);
        console.log("error")
        return Promise.resolve("Error");
    };
};