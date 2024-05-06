import { SchoolTimeSlot } from "./SchoolTimeSlot";

// Applicable to students
export type CoreSchoolDetails = {
    snowflake: string;
    name: string;
    email: string;
    phone: string;
    times: SchoolTimeSlot[];
    students: string[];
    teachers: string[];
    admins: string | string[];
  };