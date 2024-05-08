import { db } from "../../../database/Initalise";
import { doc, DocumentData, runTransaction } from "firebase/firestore";
import { BadgeData } from "../../../types/Global/Badges";
import { ActivityRequests } from "../../../types/Global/ActivityCompletionRequests";
import { XPStudentAccountDetails } from "../../../types/Global/UserAccountDetails";
import { snowflake } from "../../../classes/Snowflake";
import { dateTimeReadable } from "../../Global/GenerateTimestamp";

/**
 * Async function to award XP to a student, 
 * calculate their next target XP amount if they gain a level, 
 * handel level gaining,
 * and handel badge awarding.
 * @param {ActivityRequests} request An object of activity details and rewards to be awarded.
 * @returns A boolean to indicate whether the process was completed successfully or not.
 */
export async function awardXP(request: ActivityRequests): Promise<boolean> {
  //* Initial DB queries
  // Define progress doc path
  const progressDocRef = doc(db, "students", request.studentSnowflake, "programs", request.programSnowflake);
  const studentDocRef = doc(db, "students", request.studentSnowflake);
  const programDocRef = doc(db, "programs", request.programSnowflake);

  // Retrieve progress data
  let baseProgress: DocumentData;
  let baseStudent: DocumentData;
  let baseProgram: DocumentData;
  try {
    const success: boolean = await runTransaction(db, async (transaction): Promise<boolean> => {
      // Retrieve student progress data
      const progressDoc = await transaction.get(progressDocRef);
      if(!(progressDoc).exists()) return Promise.resolve(false);
      baseProgress = progressDoc.data();
      // Retrieve core student data from DB
      const studentDoc = await transaction.get(studentDocRef);
      if(!(studentDoc).exists()) return Promise.resolve(false);
      baseStudent = studentDoc.data();
      // Retrieve core program data from the DB
      const programDoc = await transaction.get(programDocRef);
      if(!(programDoc).exists()) return Promise.resolve(false);
      baseProgram = programDoc.data();

      //* Progress data processing
      // Mapping document data object to XP progress object
      let progress: XPStudentAccountDetails = {
        programName: baseProgress.programName,
        dateStarted: baseProgress.dateStarted,
        currentLevel: baseProgress.currentLevel,
        previousTargetXP: baseProgress.previousTargetXP,
        currentXP: baseProgress.currentXP,
        targetXP: baseProgress.targetXP,
        completedActivities: baseProgress.completedActivities,
        pendingActivities: baseProgress.pendingActivities,
      };

      // Logging starting level before XP gain
      const startingLevel: number = progress.currentLevel;

      // Add awarded XP to current XP
      progress.currentXP += request.xpValue;

      // Check if you've gained a level or not
      if(progress.targetXP > progress.currentXP) {
        await transaction.update(progressDocRef, progress);
        return Promise.resolve(true);
      };

      //* Data processing for level gaining
      // Calculate next level and next target XP
      progress.currentLevel = calculateLevel(progress.currentXP);
      progress.targetXP = calculateTargetXP(progress.currentXP);
      progress.previousTargetXP = calculatePreviousXP(progress.targetXP);

      // Write updated tracking data to database
      await transaction.update(progressDocRef, progress);

      //* Badge awarding
      // Retrieve existing badges array
      let badges: BadgeData[] = baseStudent.badges;

      // Create badge objects and award badges for all levels gained
      for(let i = startingLevel + 1; i <= progress.currentLevel; i++) {
        // Create new badge object
        const newBadge: BadgeData = {
          snowflake: snowflake.generate(),
          shape: baseProgram.badgeShape,
          colour: baseProgram.colour,
          textColour: baseProgram.badgeTextColor,
          level: i,
          awardedProgram: baseProgram.name,
          programSnowflake: baseProgram.snowflake,
          awardedFor: baseProgram.description,
          dateAwarded: dateTimeReadable(),
        };

        // Add new badge to array of badges
        badges.push(newBadge);
      };

      // Write updated badges array back to DB
      await transaction.update(studentDocRef, {
        badges: badges,
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

// Function to calculate your next target XP based on your current XP
export function calculateTargetXP(currentXP: number): number {
  if(currentXP < 100) return 100;
  if(currentXP < 200) return 200;
  if(currentXP < 300) return 300;
  if(currentXP < 400) return 400;
  if(currentXP < 500) return 500;
  if(currentXP < 600) return 600;
  if(currentXP < 800) return 800;
  if(currentXP < 1000) return 1000;
  if(currentXP < 1200) return 1200;
  if(currentXP < 1400) return 1400;
  if(currentXP < 1600) return 1600;
  if(currentXP < 1800) return 1800;
  if(currentXP < 2000) return 2000;
  return ((Math.floor(currentXP / 500) + 1) * 500);
};

// Function to calculate your level based of your current XP
export function calculateLevel(currentXP: number): number {
  if(currentXP < 600) {
    return 1 + Math.floor(currentXP / 100);
  };
  if(currentXP < 2000) {
    return 7 + Math.floor((currentXP -= 600) / 200);
  };
  return 14 + Math.floor((currentXP -= 2000) / 500);
};

// Function to calculate your previous target XP
export function calculatePreviousXP(targetXP: number): number {
  if(targetXP <= 600) return targetXP - 100;
  if(targetXP <= 2000) return targetXP - 200;
  return targetXP - 500;
};