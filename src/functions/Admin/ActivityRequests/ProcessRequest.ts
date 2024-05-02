import { db } from "../../../database/Initalise";
import { getDoc, doc, updateDoc } from "firebase/firestore";
import { ActivityRequests } from "../../../types/Global/ActivityCompletionRequests";
import { PendingActivity } from "../../../types/Global/Activity";
import { dateTimeReadable } from "../../Global/GenerateTimestamp";

/**
 * Async function to decline an activity completion request. Function updates request log and processes request on a students progress tracker.
 * @param {ActivityRequests} request The object containing all request details. 
 * @returns {boolean} Returns a boolean to indicate whether the process was completed successfully or not.
 * @AJGamesArchive
 */
export async function processActivityRequests(request: ActivityRequests): Promise<boolean> {
  // Define all DB doc and data variables
  const studentDocRef = doc(db, "students", request.studentSnowflake, "programs", request.programSnowflake);
  const requestDocRef = doc(db, "requests", "activity-completions");
  const logDocRef = doc(db, "requests", "activity-completions", "request-logs", request.logDoc);
  let studentDoc;
  let requestDoc;
  let pendingActivities: PendingActivity[] = [];
  let pendingRequests: ActivityRequests[] = [];
  // Send requests to the DB to retrieve data
  try {
    studentDoc = await getDoc(studentDocRef);
    requestDoc = await getDoc(requestDocRef);
    if(!studentDoc.exists() || !requestDoc.exists()) return Promise.resolve(false);
    pendingActivities = studentDoc.data().pendingActivities;
    pendingRequests = requestDoc.data().requests;
  } catch (e) {
    console.log(e);
    return Promise.resolve(false);
  };
  // Update data collections
  let updatedPendingActivities: PendingActivity[] = [];
  pendingActivities.forEach((a) => {
    if(a.id !== request.activityID) updatedPendingActivities.push(a);
  });
  let updatedPendingRequests: ActivityRequests[] = [];
  pendingRequests.forEach((r) => {
    if(r.activityID !== request.activityID || r.studentSnowflake !== request.studentSnowflake || r.programSnowflake !== request.programSnowflake) updatedPendingRequests.push(r);
  });
  const activeRequests: boolean = (updatedPendingRequests.length === 0) ? false : true;
  // Write updated data to DB
  try {
    await updateDoc(studentDocRef, {
      pendingActivities: updatedPendingActivities,
    });
    await updateDoc(requestDocRef, {
      activeRequests: activeRequests,
      requests: updatedPendingRequests,
    });
    await updateDoc(logDocRef, {
      dateActioned: dateTimeReadable(),
    });
  } catch (e) {
    console.log(e);
    return Promise.resolve(false);
  };
  return Promise.resolve(true);
};