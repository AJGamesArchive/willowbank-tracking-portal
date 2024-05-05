// Importing the database
import { db } from "../../../database/Initalise";
import { getDoc, doc, DocumentData } from "firebase/firestore";

// Import functions
import { retrieveDocumentIDs } from "../../Global/RetrieveDocumentIDs";

//Import Types
import { SchoolCreationStatus } from "../../../types/Schools/SchoolCreationStatus";

export async function CheckSchoolBase(code: string, name: string, email: string, phone: string): Promise<SchoolCreationStatus> {

    const schoolCodes: string | string[] = await retrieveDocumentIDs('schools');

    // Ensure all id's were returned correctly
    if (typeof schoolCodes === "string") {
        const error: SchoolCreationStatus = {
        success: false,
        errored: true,
            errorMessage: {
                severity: 'danger',
                header: 'Unexpected Error',
                message: `School IDs could not be retrieved. ${schoolCodes}`
            },
        }
        return Promise.resolve(error);
    };

    // Check that the entered school code is valid
    let validCode: boolean = true;
    schoolCodes.forEach((id) => {
        if (id === code) {
            validCode = false;
        };
    });

    //If Code already exists
    if (!validCode) {
        const schoolCodeFound: SchoolCreationStatus = {
            success: false,
            errored: false,
            errorMessage: {
                severity: 'danger',
                header: 'School Code Already in Use',
                message: `The school code that you have entered is already in use, please pick another.`
            }
        };
        return Promise.resolve(schoolCodeFound);
    };

    for (let i = 0; i < schoolCodes.length; i++) {

        // Retrieve the name of the school that matches the given school code
        const docRef = doc(db, "schools", schoolCodes[i]);
        let docSchool;
        try {
            docSchool = await getDoc(docRef);
        } catch (e) {
            const error: SchoolCreationStatus = {
                success: false,
                errored: true,
                errorMessage: {
                    severity: 'danger',
                    header: 'Unexpected Error Occurred',
                    message: `There was an error in retrieving where to store your school. Please try again.`
                  }
            };
            return Promise.resolve(error);
        };
 
        if (docSchool.exists()) {
            const docData: DocumentData = docSchool.data();
            const schoolName: string = docData.name;
            const schoolEmail: string = docData.email;
            const schoolPhone: string = docData.phone;
            console.log(schoolName);

            if (name.toUpperCase() === schoolName.toUpperCase()) {
                
                const nameDuplicate: SchoolCreationStatus = {
                    success: false,
                    errored: false,
                    errorMessage: {
                        severity: 'danger',
                        header: 'School Name Already Exists',
                        message: `There is a school on the site with the same name. Please enter another name or change the name of existing one.`
                      }
                };
                return Promise.resolve(nameDuplicate);
            }

            if (email.toUpperCase() === schoolEmail.toUpperCase()) {
                
                const emailDuplicate: SchoolCreationStatus = {
                    success: false,
                    errored: false,
                    errorMessage: {
                        severity: 'danger',
                        header: 'School Email Already Exists',
                        message: `There is a school on the site with the same email. Please enter another email or change the email of existing one.`
                      }
                };
                return Promise.resolve(emailDuplicate);
            }

            if (phone === schoolPhone) {
                
                const phoneDuplicate: SchoolCreationStatus = {
                    success: false,
                    errored: false,
                    errorMessage: {
                        severity: 'danger',
                        header: 'School Phone Number Already Exists',
                        message: `There is a school on the site with the same phone number. Please enter another phone number or change the phone number of existing one.`
                      }
                };
                return Promise.resolve(phoneDuplicate);
            }
        };
    }

    // Return an unexpected error for when the school exists but the document does not exist?
    const error: SchoolCreationStatus = {
        success: false,
        errored: true,
        errorMessage: {
            severity: 'danger',
            header: 'Unexpected Error Occurred',
            message: `The data of the school that matches the given code could not be found. Please try again.`
        }
    };

    return Promise.resolve(error);
};