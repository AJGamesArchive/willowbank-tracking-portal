// Type declaration for password reset request
export type PasswordRequest = {
  snowflake: string;
  username: string;
  accountType: string;
  created: string;
};

// Type declaration for password reset request logs
export type PasswordRequestLog = {
  snowflake: string;
  username: string;
  accountType: string;
  created: string;
  completed: string;
  newPassword: string;
  ignored: boolean;
};