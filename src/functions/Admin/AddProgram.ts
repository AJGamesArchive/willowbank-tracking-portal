import { db } from "../../database/Initalise"
import { doc, setDoc } from "firebase/firestore";

// Async function to add a new program to the system
export async function addProgram(programName: string, programDescription: string, programColour: string): Promise<boolean> {
    try {
        await setDoc(doc(db, "programs", programName.toUpperCase()), {
            displayName: programName,
            description: programDescription,
            colour: programColour,
            activities: [],
        });
        return Promise.resolve(true);
    } catch (e) {
        return Promise.resolve(false);
    };
};