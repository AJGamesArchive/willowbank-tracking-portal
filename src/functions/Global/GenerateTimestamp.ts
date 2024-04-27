// Create string with current date and time in format of YYYY-MM-DD-HH-MM-SS-RR
// Example: 2024-04-14-21-33-45-74
/*
YYYY = Year
MM = Month
DD = Day
HH = Hour
MM = Minute
SS = Second
RR = Random Digits
*/
export function dateTime() {
  const today = new Date();
  const numbers: number[] = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  const randomDigits: string = `${numbers[Math.floor(Math.random() * numbers.length)]}${numbers[Math.floor(Math.random() * numbers.length)]}`;
  const date: string = today.getFullYear() + "-" + String(today.getMonth() + 1).padStart(2, "0") + "-" + String(today.getDate()).padStart(2, "0") + "-" + String(today.getHours()).padStart(2, "0") + "-" + String(today.getMinutes()).padStart(2, "0") + "-" + String(today.getSeconds()).padStart(2, "0") + "-" + `${randomDigits}`;
  return date;
};

// Function to return the current date and time in a human readable format
// Returns format as: DD/MM/YYYY - HH/MM
// Example: 27/04/2024 - 01:19
export function dateTimeReadable() {
  const today = new Date();
  const date: string = String(today.getDate()).padStart(2, "0") + "/" + String(today.getMonth() + 1).padStart(2, "0") + "/" + today.getFullYear() + "-" + String(today.getHours()).padStart(2, "0") + ":" + String(today.getMinutes()).padStart(2, "0");
  return date;
};