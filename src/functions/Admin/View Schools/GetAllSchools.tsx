import { db } from "../../../database/Initalise"; 
import { getDoc, doc, DocumentData } from "firebase/firestore";

// Import functions
import { retrieveDocumentIDs } from "../../Global/RetrieveDocumentIDs"; 
import { AllSchoolDetails } from "../../../types/Admin/AllSchoolDetails";

export async function getAllSchools(): Promise<AllSchoolDetails[] | string> {

    // Retrieve an array of all school IDs in the system
    const schoolIDs: string | string[] = await retrieveDocumentIDs('schools');
    let schoolDetails: AllSchoolDetails[] = [];

    // Ensure all id's were returned correctly
    if (typeof schoolIDs === "string") {
        return Promise.resolve("error");
    };

    try {
        if (schoolIDs.length > 0) {
            for (let i = 0; i < schoolIDs.length; i++) {
                console.log(i);
                console.log(schoolIDs);
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
                    const schoolDataMapping: AllSchoolDetails = {
                        schoolName: docData.name,
                        schoolCode: code,
                        schoolEmail: docData.email,
                        schoolPhone: docData.phone,
                        timetable: docData.times,
                        schoolStudents: docData.students,
                        schoolTeachers: docData.teachers,
                        schoolAdmins: docData.admins,
                    };

                    schoolDetails.push(schoolDataMapping);

                };
            };
            return Promise.resolve(schoolDetails);
        };
    } catch (e) {
        console.log(e);
        return Promise.resolve("error");
    };
    return Promise.resolve("error");
}