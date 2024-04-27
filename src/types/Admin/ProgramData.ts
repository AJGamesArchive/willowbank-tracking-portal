// Importing types
import { Activity } from "../Global/Activity";

// Type declaration for a core program data object
export type ProgramData = {
    snowflake: string;
    name: string;
    description: string;
    colour: string;
    badgeShape: string,
    badgeTextColor: string;
};

// Type declaration for a complete program data object
export type FullProgramData = {
    snowflake: string;
    activities: Activity[];
    colour: string;
    description: string;
    name: string;
    badgeShape: string,
    badgeTextColor: string;
};