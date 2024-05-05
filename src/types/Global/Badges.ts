// Defining a data type for the badge data required to be stored for badge generation to work
export type BadgeData = {
  snowflake: string;
  shape: string;
  colour: string;
  textColour: string;
  level: number;
  awardedProgram: string;
  programSnowflake: string;
  awardedFor: string;
  dateAwarded: string;
};