import { Error } from "../Global/Error";

export type SchoolCreationStatus = {
    success: boolean;
    errored: boolean;
    errorMessage: Error;
}

