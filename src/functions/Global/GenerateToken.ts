// Function to generate a random token string
export function generateToken(): string {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let token: string = "";
  for (let i = 1; i <= 30; i++) {
    token += characters[Math.floor(Math.random() * characters.length)];
    if (i % 5 === 0 && i !== 30) {
      token += "-";
    };
  };
  return token;
};