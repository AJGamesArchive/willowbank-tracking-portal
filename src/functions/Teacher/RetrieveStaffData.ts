import { db } from "../../database/Initalise";
import { getDoc, doc } from "firebase/firestore";
import { CoreStaffAccountDetails } from "../../types/Global/UserAccountDetails";

/**
 * Async function to retrieve all the core staff data for a given student.
 * @param {string} staffSnowflake The snowflake ID of the staff account to retrieve all core data from
 * @param {string} accountType The name of the DB collection tha the given account is stored in (teachers, admins)
 * @returns All core account details for a given member of staff.
 */
export async function retrieveStaffData(staffSnowflake: string, accountType: string): Promise<CoreStaffAccountDetails | string> {
    const docRef = doc(db, accountType, staffSnowflake);
    let document;
    try {
        document = await getDoc(docRef);
        if(!document.exists()) return Promise.resolve("Error");
    } catch (e) {
        console.log(e);
        return Promise.resolve("Error");
    };
    const data = document.data();
    const mappedStudentData: CoreStaffAccountDetails = {
        snowflake: data.snowflake,
        username: data.username,
        firstName: data.firstName,
        surname: data.surname,
        password: data.password,
        schools: data.school,
        token: data.token,
    };
    return Promise.resolve(mappedStudentData);
}; 