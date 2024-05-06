// Importing the database
import { db } from "../../database/Initalise"
import { getDoc, doc} from "firebase/firestore";

// Import types
import { CoreSchoolDetails } from "../../types/Schools/CoreSchoolDetails";

export async function RetrieveSchoolData(code: string): Promise<CoreSchoolDetails | string> {

    const docRef = doc(db, "schools", code);
    let document;
    try {
        document = await getDoc(docRef);
        if(!document.exists()) return Promise.resolve("Error");
    } catch (e) {
        console.log(e);
        return Promise.resolve("Error");
    };
    const data = document.data();
    const schoolData: CoreSchoolDetails = {
        snowflake: data.snowflake,
        name: data.name,
        email: data.email,
        phone: data.phone,
        times: data.times,
        students: data.students,
        teachers: data.teachers,
        admins: data.admins
    };
    return Promise.resolve(schoolData);
}