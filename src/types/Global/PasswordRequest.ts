// Type declaration for password reset request
export type PasswordRequest = {
  username: string;
  accountType: string;
  created: string;
};

// Type declaration for password reset request logs
export type PasswordRequestLog = {
  username: string;
  accountType: string;
  created: string;
  completed: string;
  newPassword: string;
  ignored: boolean;
};