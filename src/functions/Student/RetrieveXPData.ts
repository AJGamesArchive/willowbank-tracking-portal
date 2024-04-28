import { XPStudentAccountDetails } from "../../types/Global/UserAccountDetails";
import { db } from "../../database/Initalise";
import { getDocs, query, collection } from "firebase/firestore";

/**
 * Async function to retrieve all of a given students progress on all programs they are assigned to.
 * @param {string} studentSnowflake The snowflake ID of the student to retrieve program progress for.
 * @returns {Promise<XPStudentAccountDetails[] | string>} Returns an array of the given students progress for each program (one element per program) or a string if an error occurred.
 * @AJGamesArchive
 */
export async function retrieveXPData(studentSnowflake: string): Promise<XPStudentAccountDetails[] | string> {
    let data: XPStudentAccountDetails[] = [];
    const q = query(collection(db, "students", studentSnowflake, "programs"));
    let documents;
    try {
        documents = await getDocs(q);
    } catch (e) {
        console.log(e);
        return Promise.resolve("Error");
    };
    documents.forEach((d) => {
        const docDate = d.data();
        data.push({
            programName: docDate.programName,
            dateStarted: docDate.dateStarted,
            currentLevel: docDate.currentLevel,
            previousTargetXP: docDate.previousTargetXP,
            currentXP: docDate.currentXP,
            targetXP: docDate.targetXP,
            completedActivities: docDate.completedActivities,
        });
    });
    return Promise.resolve(data);
};