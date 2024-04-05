/// <reference types="vite/client" />

// Define data types for .env variables
interface ImportMetaEnv {
  APIKEY: string;
  AUTHDOMAIN: string;
  PROJECTID: string;
  STORAGEBUCKET: string;
  MESSAGINGSENDERID: string;
  APPID: string;
  MEASUREMENTID: string;
};