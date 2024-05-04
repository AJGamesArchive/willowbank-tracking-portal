// Importing database connections
import { db } from "../../../database/Initalise";
import { doc, query, collection, getDocs, DocumentData, runTransaction } from "firebase/firestore";
import { Activity } from "../../../types/Global/Activity";

// Async function to delete a given program
export async function deleteProgram(snowflake: string): Promise<boolean> {
  const docRef = doc(db, "programs", snowflake);
  try {
    // Retrieve all student snowflakes
    const q = query(collection(db, "students"));
    const studentDocs = await getDocs(q);
    let studentSnowflakes: string[] = [];
    studentDocs.forEach((d) => {
      studentSnowflakes.push(d.data().snowflake);
    });

    // DB Transaction
    const success: boolean = await runTransaction(db, async (transaction): Promise<boolean> => {
      // Delete the program data from all students who have not completed any activities for the program
      let docRefs: any[] = [];
      let docsData: any[] = [];
      for(let i = 0; i < studentSnowflakes.length; i++) {
        const programDocRef = doc(db, "students", studentSnowflakes[i], "programs", snowflake);
        const programDoc = await transaction.get(programDocRef);
        if(!programDoc.exists()) {return Promise.resolve(false)};
        const trackingData: DocumentData = programDoc.data();
        const activities: Activity[] = trackingData.completedActivities;
        docRefs.push(programDocRef);
        docsData.push(activities);
      };
      for(let i = 0; i < docsData.length; i++) {
        if(docsData[i].length !== 0) {continue;}
        await transaction.delete(docRefs[i]);
      };

      // Delete the core program data
      await transaction.delete(docRef);

      return Promise.resolve(true);
    });
    if(!success) return Promise.resolve(false);
  } catch (e) {
    console.log(e);
    return Promise.resolve(false);
  };
  return Promise.resolve(true);
};