// Import and type cast env variables
const apiKey: string = import.meta.env.APIKEY;
const authDomain: string = import.meta.env.AUTHDOMAIN;
const projectId: string = import.meta.env.PROJECTID;
const storageBucket: string = import.meta.env.STORAGEBUCKET;
const messagingSenderId: string = import.meta.env.MESSAGINGSENDERID;
const appId: string = import.meta.env.APPID;
const measurementId: string = import.meta.env.MEASUREMENTID;

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
export const firebaseConfig = {
  apiKey: apiKey,
  authDomain: authDomain,
  projectId: projectId,
  storageBucket: storageBucket,
  messagingSenderId: messagingSenderId,
  appId: appId,
  measurementId: measurementId
};
