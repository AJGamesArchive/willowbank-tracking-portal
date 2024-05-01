import { db } from "../../database/Initalise";
import { getDoc, doc, updateDoc, setDoc, DocumentData } from "firebase/firestore";
import { ActivityRequests } from "../../types/Global/ActivityCompletionRequests";
import { ActivityRequestsLog } from "../../types/Global/ActivityCompletionRequests";
import { Activity } from "../../types/Global/Activity";
import { PendingActivity } from "../../types/Global/Activity";
import { dateTimeReadable } from "../Global/GenerateTimestamp";
import { dateTime } from "../Global/GenerateTimestamp";

/**
 * Async function to create an activity completed request to send to admin review.
 * @param {string} studentSnowflake The snowflake ID of the student to create the activity request for.
 * @param {string} studentName The name of the student who the activity request is being created for.
 * @param {string} programSnowflake The snowflake ID of the program the activity request is for.
 * @param {string} programName The name of the program the activity request is for.
 * @param {Activity} activity An Activity object containing the details of the activity to create a request for.
 * @param {string} schoolName The name of the school the student attends.
 * @returns {boolean} Returns a boolean to indicate whether or not the process was completed successfully.
 * @AJGamesArchive
 */
export async function createActivityCompleteRequest(studentSnowflake: string, studentName: string, programSnowflake: string, programName: string, activity: Activity, schoolName: string): Promise<boolean> {
  // Create timestamps for the request creation
  const submissionDate: string = dateTime();
  const submissionDateReadable: string = dateTimeReadable();
  // Create the pending activity object to log that this activity is now pending in the students progress tracker
  const pendingActivity: PendingActivity = {
    dateSubmitted: submissionDateReadable,
    id: activity.id,
    description: activity.description,
    xpValue: activity.xpValue,
    dateAdded: activity.dateAdded,
    difficulty: activity.difficulty,
  };
  // Defining the activity request object and corresponding log object for store data needed to process and review activity requests
  const request: ActivityRequests = {
    studentSnowflake: studentSnowflake,
    programSnowflake: programSnowflake,
    studentName: studentName,
    programName: programName,
    activityID: activity.id,
    activityInfo: activity.description,
    xpValue: activity.xpValue,
    dateSubmitted: submissionDateReadable,
    logDoc: submissionDate,
    schoolName: schoolName,
  };
  const requestLog: ActivityRequestsLog = {
    studentSnowflake: studentSnowflake,
    programSnowflake: programSnowflake,
    studentName: studentName,
    programName: programName,
    activityID: activity.id,
    activityInfo: activity.description,
    xpValue: activity.xpValue,
    dateSubmitted: submissionDateReadable,
    dateActioned: '',
    approved: false,
    schoolName: schoolName,
  };
  // Save all created objects to their respective place in the database
  const studentDocRef = doc(db, "students", studentSnowflake, "programs", programSnowflake);
  const requestsDocRef = doc(db, "requests", "activity-completions");
  const requestsLogDocRef = doc(db, "requests", "activity-completions", "request-logs", submissionDate);
  let studentDoc;
  let requestsDoc;
  let requestLogsDoc;
  let studentDocData: DocumentData;
  let requestsDocData: DocumentData;
  let pendingActivities: PendingActivity[] = [];
  let requests: ActivityRequests[] = [];
  try {
    // Retrieve required documents from the database and ensure they exist
    studentDoc = await getDoc(studentDocRef);
    requestsDoc = await getDoc(requestsDocRef);
    requestLogsDoc = await getDoc(requestsLogDocRef);
    if(!studentDoc.exists()) return Promise.resolve(false);
    if(!requestsDoc.exists()) {
      await setDoc(requestsDocRef, {
        activeRequests: false,
        requests: [],
      });
      requestsDoc = await getDoc(requestsDocRef);
    };
    if(!requestsDoc.exists()) return Promise.resolve(false);
    // Retrieve all document data
    studentDocData = studentDoc.data();
    requestsDocData = requestsDoc.data();
    // Retrieve existing array of pending activities and add the new pending activity to the array
    pendingActivities = studentDocData.pendingActivities;
    pendingActivities.push(pendingActivity);
    // Retrieve existing array of requests and add the new request to the array
    requests = requestsDocData.requests;
    requests.push(request);
    // Write all data back to the database
    await updateDoc(studentDocRef, {
      pendingActivities: pendingActivities,
    });
    await updateDoc(requestsDocRef, {
      activeRequests: true,
      requests: requests,
    });
    await setDoc(requestsLogDocRef, requestLog);
  } catch (e) {
    console.log(e);
    return Promise.resolve(false);
  };
  return Promise.resolve(true);
};