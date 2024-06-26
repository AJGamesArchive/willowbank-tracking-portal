// Importing types
import { CompletedActivity } from "./Activity";
import { PendingActivity } from "./Activity";
import { BadgeData } from "./Badges";

// Type definition for the details required for a user account (student, teacher, admin)

// Applicable to students
export type CoreStudentAccountDetails = {
  snowflake: string;
  username: string;
  firstName: string;
  surnameInitial: string;
  password: string;
  school: string; //99-99-99
  token: string;
  badges: BadgeData[];
};
export type XPStudentAccountDetails = {
  programName: string;
  dateStarted: string;
  currentLevel: number;
  previousTargetXP: number;
  currentXP: number;
  targetXP: number; // Amount required to reach next level
  completedActivities: CompletedActivity[];
  pendingActivities: PendingActivity[];
};

// Applicable to both teacher and admin
export type CoreStaffAccountDetails = {
  snowflake: string;
  username: string;
  firstName: string;
  surname: string;
  password: string;
  schools: string[]; //99-99-99
  token: string;
};