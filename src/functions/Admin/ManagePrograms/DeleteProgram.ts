// Importing database connections
import { db } from "../../../database/Initalise";
import { deleteDoc, doc, query, collection, getDocs, getDoc, DocumentData } from "firebase/firestore";
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

    // Delete the program data from all students who have not completed any activities for the program
    for(let i = 0; i < studentSnowflakes.length; i++) {
      const programDocRef = doc(db, "students", studentSnowflakes[i], "programs", snowflake);
      const programDoc = await getDoc(programDocRef);
      if(!programDoc.exists()) {return Promise.resolve(false)};
      const trackingData: DocumentData = programDoc.data();
      const activities: Activity[] = trackingData.completedActivities;
      if(activities.length !== 0) {continue;}
      await deleteDoc(programDocRef);
    };

    // Delete the core program data
    await deleteDoc(docRef);

  } catch (e) {
    console.log(e);
    return Promise.resolve(false);
  };
  return Promise.resolve(true);
};