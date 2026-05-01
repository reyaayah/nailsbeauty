// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCG-eZuOecjQYs5dNAUv5QOl5Bmvjv0sP0",
    authDomain: "nailsbeauty-978c5.firebaseapp.com",
    projectId: "nailsbeauty-978c5",
    storageBucket: "nailsbeauty-978c5.firebasestorage.app",
    messagingSenderId: "402268561511",
    appId: "1:402268561511:web:df3bd2d1ae70875ccef4c2",
    measurementId: "G-1EJKR5GZ03"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);