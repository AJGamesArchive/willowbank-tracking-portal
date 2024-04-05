// Import types
import { Error } from "../Global/Error";

// Type declaration for validating login credentials
export type CredentialValidation = {
  valid: boolean;
  errored: boolean;
  errorMessage: Error;
};