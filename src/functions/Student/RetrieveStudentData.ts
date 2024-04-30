import { db } from "../../database/Initalise";
import { getDoc, doc } from "firebase/firestore";
import { CoreStudentAccountDetails } from "../../types/Global/UserAccountDetails";

/**
 * Async function to retrieve all the core student data for a given student.
 * @param {string} studentSnowflakes The snowflake ID of the student to retrieve awarded badge data for.
 * @returns {Promise<BadgeData[] | string>} Returns a BadgeData[] of all badges awarded to the given student (one element per badge) or returns string if an error occurred.
 * @AJGamesArchive
 */
export async function retrieveStudentData(studentSnowflake: string): Promise<CoreStudentAccountDetails | string> {
    const docRef = doc(db, "students", studentSnowflake);
    let document;
    try {
        document = await getDoc(docRef);
        if(!document.exists()) return Promise.resolve("Error");
    } catch (e) {
        console.log(e);
        return Promise.resolve("Error");
    };
    const data = document.data();
    const mappedStudentData: CoreStudentAccountDetails = {
        snowflake: data.snowflake,
        username: data.username,
        firstName: data.firstName,
        surnameInitial: data.surnameInitial,
        password: data.password,
        school: data.school,
        token: data.token,
        badges: data.badges,
    };
    return Promise.resolve(mappedStudentData);
};