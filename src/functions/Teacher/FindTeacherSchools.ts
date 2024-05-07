// Importing the database
import { db } from "../../database/Initalise"
import { getDoc, doc, DocumentData } from "firebase/firestore";

// Import functions
import { retrieveDocumentIDs } from "../Global/RetrieveDocumentIDs";
import { TeacherTimes } from "../../types/Teacher/TeacherTimes";
import { CoreSchoolDetails } from "../../types/Schools/CoreSchoolDetails";

export async function FindTeacherSchools(snowflake: string): Promise<TeacherTimes[] | string > {

    // Retrieve an array of all school IDs in the system
    const schoolIDs: string | string[] = await retrieveDocumentIDs('schools');
    let teacherTimeTables: TeacherTimes[] = [];

    // Ensure all id's were returned correctly
    if (typeof schoolIDs === "string") {
        return Promise.resolve("error");
    };

    try {
        if (schoolIDs.length > 0) {
            for (let i = 0; i < schoolIDs.length; i++) {
                let code = schoolIDs[i];
    
                // Retrieve the name of the school that matches the given school code
                const docRef = doc(db, "schools", code);
                let docSchool;
                try {
                    docSchool = await getDoc(docRef);
                } catch (e) {
                    console.log(e);
                    return Promise.resolve("error");
                };
    
                if (docSchool.exists()) {
                    const docData: DocumentData = docSchool.data();
                    const schoolDataMapping: CoreSchoolDetails = {
                        snowflake: docData.snowflake,
                        name: docData.name,
                        email: docData.email,
                        phone: docData.phone,
                        times: docData.times,
                        students: docData.students,
                        teachers: docData.teachers,
                        admins: docData.admins,
                    };
    
                    for (let j = 0; j < schoolDataMapping.teachers.length; j++) {
                        if (schoolDataMapping.teachers[j] === snowflake) {
                            teacherTimeTables.push({
                                schoolName: schoolDataMapping.name,
                                timetables: docData.times,
                            });
                        };
                    };
                };
            };
            return Promise.resolve(teacherTimeTables);
        };
    } catch (e) {
        console.log(e);
        return Promise.resolve("error");
    };
    return Promise.resolve("error");
};