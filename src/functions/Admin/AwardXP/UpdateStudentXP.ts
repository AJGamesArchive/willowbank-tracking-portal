import { db } from '../../../database/Initalise';
import { DocumentData, doc, getDoc, runTransaction } from "firebase/firestore";
import { XPStudentAccountDetails } from '../../../types/Global/UserAccountDetails';
import { calculateLevel } from '../ActivityRequests/AwardXP';
import { BadgeData } from '../../../types/Global/Badges';
import { dateTimeReadable } from '../../Global/GenerateTimestamp';
import { snowflake } from '../../../classes/Snowflake';
import { ProgramData } from '../../../types/Admin/ProgramData';
import { calculateTargetXP } from '../ActivityRequests/AwardXP';
import { calculatePreviousXP } from '../ActivityRequests/AwardXP';

/**
 * Function to update a students current XP value for a given program and award & revoke any levels and badges accordingly
 * @param studentSnowflake Snowflake of the student to update details for. 
 * @param programSnowflake Snowflake of the program to update progress for.
 * @param newXPAmount The new XP value to be set for the given students program details.
 * @returns A boolean to indicate whether the process was completed successfully. 
 */
export async function updateStudentXP(studentSnowflake: string, programSnowflake: string, newXPAmount: number): Promise<boolean> {
  // Student program progress doc ref
  const docRef = doc(db, "students", studentSnowflake, "programs", programSnowflake);
  const badgeDocRef = doc(db, "students", studentSnowflake);
  const programDocRef = doc(db, "programs", programSnowflake);
  // Catch errors
  try {
    // Retrieve required data
    const document = await getDoc(docRef);
    const badgeDoc = await getDoc(badgeDocRef);
    const programDoc = await getDoc(programDocRef);
    if(!document.exists() || !badgeDoc.exists() || !programDoc.exists()) return Promise.resolve(false);
    const docData: DocumentData = document.data();
    const badgeDocData: DocumentData = badgeDoc.data();
    const programDocData: DocumentData = programDoc.data();
    const baseProgress: XPStudentAccountDetails = {
      programName: docData.programName,
      dateStarted: docData.dateStarted,
      currentLevel: docData.currentLevel,
      previousTargetXP: docData.previousTargetXP,
      currentXP: docData.currentXP,
      targetXP: docData.targetXP,
      completedActivities: docData.completedActivities,
      pendingActivities: docData.pendingActivities,
    };
    let badges: BadgeData[] = badgeDocData.badges;
    const programData: ProgramData = {
      snowflake: programDocData.snowflake,
      name: programDocData.name,
      description: programDocData.description,
      colour: programDocData.colour,
      badgeShape: programDocData.badgeShape,
      badgeTextColor: programDocData.badgeTextColor,
    };
    let updatedProgress: XPStudentAccountDetails = { ...baseProgress };

    // Update students progress to reflect updated XP value
    updatedProgress.currentXP = newXPAmount;
    updatedProgress.targetXP = calculateTargetXP(newXPAmount);
    updatedProgress.previousTargetXP = calculatePreviousXP(updatedProgress.targetXP);
    updatedProgress.currentLevel = calculateLevel(newXPAmount);

    // Add any newly award badges
    if(updatedProgress.currentLevel > baseProgress.currentLevel) {
      for(let i = baseProgress.currentLevel + 1; i <= updatedProgress.currentLevel; i++) {
        // Create new badge object
        const newBadge: BadgeData = {
          snowflake: snowflake.generate(),
          shape: programData.badgeShape,
          colour: programData.colour,
          textColour: programData.badgeTextColor,
          level: i,
          awardedProgram: programData.name,
          programSnowflake: programData.snowflake,
          awardedFor: 'Admin awarded xp.',
          dateAwarded: dateTimeReadable(),
        };

        // Add new badge to array of badges
        badges.push(newBadge);
      };
    };

    // Remove any revoke level badges
    if(updatedProgress.currentLevel < baseProgress.currentLevel) {
      // Search for all badges that need removing and log their array index
      let removeBadges: number[] = [];
      for(let i = baseProgress.currentLevel; i > updatedProgress.currentLevel; i--) {
        for(let j = 0; j < badges.length; j++) {
          if(badges[j].programSnowflake === programSnowflake && badges[j].level === i) removeBadges.push(j);
        };
      };
      // Loop through array of indexes and remove all required badges
      removeBadges.forEach((i) => {
        badges.splice(i, 1);
      });
    };

    console.log(badges); //! Remove later

    // Transaction to update DB data
    await runTransaction(db, async (transaction): Promise<void> => {
      await transaction.update(docRef, updatedProgress);
      await transaction.update(badgeDocRef, {
        badges: badges,
      });
    });
  } catch(e) {
    console.log(e);
    return Promise.resolve(false);
  };
  return Promise.resolve(true);
};