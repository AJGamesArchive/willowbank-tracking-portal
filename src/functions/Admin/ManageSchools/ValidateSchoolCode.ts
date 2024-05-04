// Importing the database
import { db } from "../../database/Initalise"
import { getDoc, doc, DocumentData } from "firebase/firestore";

// Import types
import { SchoolSearch } from "../../types/Login/SchoolSearch"

// Import functions
import { retrieveDocumentIDs } from "../Global/RetrieveDocumentIDs"