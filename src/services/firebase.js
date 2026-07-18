import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBEu_nLp9pC1CvbOEZvXoTQbDJ3sPjw9UA",
  authDomain: "takim-kur.firebaseapp.com",
  projectId: "takim-kur",
  storageBucket: "takim-kur.firebasestorage.app",
  messagingSenderId: "558310061858",
  appId: "1:558310061858:web:15e81f70840f12bea4177b",
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);