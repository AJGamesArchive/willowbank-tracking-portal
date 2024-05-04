import { db } from "../../../database/Initalise";
import { doc, runTransaction } from "firebase/firestore";
import { ActivityRequests } from "../../../types/Global/ActivityCompletionRequests";
import { PendingActivity } from "../../../types/Global/Activity";
import { CompletedActivity } from "../../../types/Global/Activity";
import { dateTimeReadable } from "../../Global/GenerateTimestamp";

/**
 * Async function to process an activity completion request. Function updates request log and processes request on a students progress tracker.
 * Function will call the XP system function to update a students progress if the request is approved.
 * @param {ActivityRequests} request The object containing all request details. 
 * @param {boolean} approved Whether the request is being approved or denied.
 * @returns {boolean} Returns a boolean to indicate whether the process was completed successfully or not.
 * @AJGamesArchive
 */
export async function processActivityRequests(request: ActivityRequests, approved: boolean): Promise<boolean> {
  //* Define all DB doc and data variables
  const studentDocRef = doc(db, "students", request.studentSnowflake, "programs", request.programSnowflake);
  const requestDocRef = doc(db, "requests", "activity-completions");
  const logDocRef = doc(db, "requests", "activity-completions", "request-logs", request.logDoc);
  let studentDoc;
  let requestDoc;
  let pendingActivities: PendingActivity[] = [];
  let completedActivities: CompletedActivity[] = [];
  let pendingRequests: ActivityRequests[] = [];
  
  //* Handel request errors and be integrity
  try {
    const success: boolean = await runTransaction(db, async (transaction): Promise<boolean> => {
      //* Send requests to the DB to retrieve data
      // Retrieve student and request doc data
      studentDoc = await transaction.get(studentDocRef);
      requestDoc = await transaction.get(requestDocRef);
      if(!studentDoc.exists() || !requestDoc.exists()) return Promise.resolve(false);
      pendingActivities = studentDoc.data().pendingActivities;
      completedActivities = studentDoc.data().completedActivities;
      pendingRequests = requestDoc.data().requests;

      //* Update data collections
      // Remove activity from pending activities and add activity to completed activities if request is approved
      let updatedPendingActivities: PendingActivity[] = [];
      pendingActivities.forEach((a) => {
        if(a.id !== request.activityID) updatedPendingActivities.push(a);
        if(approved && a.id === request.activityID) {
          const completedActivity: CompletedActivity = {
            dateCompleted: a.dateSubmitted,
            id: a.id,
            description: a.description,
            xpValue: a.xpValue,
            dateAdded: a.dateAdded,
            difficulty: a.difficulty,
          };
          completedActivities.push(completedActivity);
        };
      });

      // Remove request from pending requests array
      let updatedPendingRequests: ActivityRequests[] = [];
      pendingRequests.forEach((r) => {
        if(r.activityID !== request.activityID || r.studentSnowflake !== request.studentSnowflake || r.programSnowflake !== request.programSnowflake) updatedPendingRequests.push(r);
      });
      const activeRequests: boolean = (updatedPendingRequests.length === 0) ? false : true;

      //* Write updated data to DB
      await transaction.update(studentDocRef, {
        pendingActivities: updatedPendingActivities,
        completedActivities: completedActivities,
      });
      await transaction.update(requestDocRef, {
        activeRequests: activeRequests,
        requests: updatedPendingRequests,
      });
      await transaction.update(logDocRef, {
        approved: approved,
        dateActioned: dateTimeReadable(),
      });
      return Promise.resolve(true);
    });
    if(!success) return Promise.resolve(false);
  } catch (e) {
    console.log(e);
    return Promise.resolve(false);
  };
  return Promise.resolve(true);
};