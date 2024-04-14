// Create string with current date and time in format of YYYY-MM-DD-HH-MM
// Example: 2024-04-14-21-33
export function dateTime() {
  const today = new Date()
  const date: string = today.getFullYear() + "-" + String(today.getMonth() + 1).padStart(2, "0") + "-" + String(today.getDate()).padStart(2, "0") + "-" + String(today.getHours()).padStart(2, "0") + "-" + String(today.getMinutes()).padStart(2, "0")
  return date;
};