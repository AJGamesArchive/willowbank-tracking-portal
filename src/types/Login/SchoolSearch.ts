// Import types
import { Error } from "../Global/Error";

// Type declaration for checking whether a school exists
export type SchoolSearch = {
  exists: boolean;
  schoolName: string;
  errored: boolean;
  errorMessage: Error;
};