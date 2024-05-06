// Importing the database
import { db } from "../../../database/Initalise";
import { doc, runTransaction } from "firebase/firestore";
import { CoreSchoolDetails } from "../../../types/Schools/SchoolAccountDetails";

// Import functions
import { snowflake } from "../../../classes/Snowflake";
import { retrieveDocumentIDs } from "../../Global/RetrieveDocumentIDs";
import { SchoolTimeSlot } from "../../../types/Schools/SchoolTimeSlot";

export async function createSchool(schoolCode: string, schoolName: string, schoolEmail: string, schoolPhone: string, schoolTimes: SchoolTimeSlot[]): Promise<boolean> {

    // Generate an account snowflake
    const schoolSnowflake: string = snowflake.generate();
    let schoolStudents: string [] = []
    let schoolteachers: string [] = []
    let Admins: string | string[] = await retrieveDocumentIDs('admins');

    if (typeof Admins === "string") {
        return Promise.resolve(false);
    }

    // Create the account data objects
    const coreDetails: CoreSchoolDetails = {
        snowflake: schoolSnowflake,
        name: schoolName,
        email: schoolEmail,
        phone: schoolPhone,
        times: schoolTimes,
        students: schoolStudents,
        teachers: schoolteachers,
        admins: Admins
    };
  
    // Create the account
    try {
      // Transaction for writing to DB
      await runTransaction(db, async (transaction): Promise<void> => {
  
        // Create school account document
        await transaction.set(doc(db, "schools", schoolCode), coreDetails);
  
      });
    } catch (e) {
      return Promise.resolve(false);
    };
    return Promise.resolve(true);
  };