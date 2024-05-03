import { Activity } from "../Global/Activity";

// Type declaration to define an array of activities that have been assessed as complete or incomplete
export type AssessedActivities = {
    completed: boolean;
    pending: boolean;
    activity: Activity;
    date: string;
};