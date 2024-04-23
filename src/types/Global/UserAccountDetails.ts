// Importing types
import { Activity } from "./Activity";

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
};
export type XPStudentAccountDetails = {
  programName: string;
  currentLevel: number;
  currentXP: number;
  targetXP: number; // Amount required to reach next level
  completedActivities: Activity[];
};

// Applicable to both teacher and admin
export type CoreStaffAccountDetails = {
  snowflake: string;
  username: string;
  firstName: string;
  surnameInitial: string;
  password: string;
  schools: string[]; //99-99-99
  token: string;
};