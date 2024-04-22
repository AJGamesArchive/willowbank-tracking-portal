// Function to generate a node ID to use for snowflake creation
export function generateNodeID(): number {
  // Generate a random number between 0 (inclusive) and 1 (exclusive)
  const random = Math.random();

  // Scale the random number to fit within the desired range
  const scaledRandom = random * (999 - 100);

  // Shift the scaled random number to the desired starting point (min)
  const randomNumberInRange = scaledRandom + 100;

  // Return the generated random number
  return Math.floor(randomNumberInRange); // Use Math.floor to round down to an integer
};