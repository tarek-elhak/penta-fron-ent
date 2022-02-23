import { initializeApp } from "firebase/app";
const firebaseConfig = {
    apiKey: "",
    authDomain: "",
    databaseURL: "",
    projectId: "",
    storageBucket: "",
    messagingSenderId: "",
    appId: "",
    measurementId: ""
};
// initialize the firebase app
export const app = initializeApp(firebaseConfig);

