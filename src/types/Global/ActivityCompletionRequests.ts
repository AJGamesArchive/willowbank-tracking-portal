// Type declaration for activity completion request
export type ActivityRequests = {
  studentSnowflake: string;
  programSnowflake: string;
  studentName: string;
  programName: string;
  activityID: number;
  activityInfo: string;
  xpValue: number;
  dateSubmitted: string;
  logDoc: string;
  schoolName: string;
};

// Type declaration for activity completion request logs
export type ActivityRequestsLog = {
  studentSnowflake: string;
  programSnowflake: string;
  studentName: string;
  programName: string;
  activityID: number;
  activityInfo: string;
  xpValue: number;
  dateSubmitted: string;
  dateActioned: string;
  approved: boolean;
  schoolName: string;
};