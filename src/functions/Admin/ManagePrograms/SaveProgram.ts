import { db } from "../../../database/Initalise"
import { doc, query, collection, getDocs, runTransaction } from "firebase/firestore";
import { snowflake } from "../../../classes/Snowflake";
import { XPStudentAccountDetails } from "../../../types/Global/UserAccountDetails";
import { dateTimeReadable } from "../../Global/GenerateTimestamp";

// Async function to add a new program to the system
export async function saveProgram(programSnowflake: string, programName: string, programDescription: string, programColour: string, programShape: string, programTextColor: string, isNew: boolean): Promise<boolean> {
  try {
    if(isNew) {
      // Retrieve all student snowflakes
      const q = query(collection(db, "students"));
      const studentDocs = await getDocs(q);
      let studentSnowflakes: string[] = [];
      studentDocs.forEach((d) => {
        studentSnowflakes.push(d.data().snowflake);
      });

      // Transaction
      await runTransaction(db, async (transaction): Promise<void> => {
        // Create the new program document
        const newSnowflake: string = snowflake.generate();
        await transaction.set(doc(db, "programs", newSnowflake), {
          snowflake: newSnowflake,
          name: programName,
          description: programDescription,
          colour: programColour,
          totalActivities: 0,
          activities: [],
          badgeShape: programShape,
          badgeTextColor: programTextColor,
        });

        // Define a blank XP tracking object for the new program
        const xpTracker: XPStudentAccountDetails = {
          programName: programName,
          dateStarted: dateTimeReadable(),
          currentLevel: 1,
          previousTargetXP: 0,
          currentXP: 0,
          targetXP: 100,
          completedActivities: [],
          pendingActivities: [],
        };

        // Assign the new program to all students
        for(let i = 0; i < studentSnowflakes.length; i++) {
          await transaction.set(doc(db, "students", studentSnowflakes[i], "programs", newSnowflake), xpTracker);
        };
      });
    } else {
      await runTransaction(db, async (transaction): Promise<void> => {
        // Update the given program document
        await transaction.update(doc(db, "programs", programSnowflake), {
          name: programName,
          description: programDescription,
          colour: programColour,
          badgeShape: programShape,
          badgeTextColor: programTextColor,
        });
      });
    };
  } catch (e) {
    return Promise.resolve(false);
  };
  return Promise.resolve(true);
};