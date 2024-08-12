import { initializeApp } from "firebase/app";
import 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCZnx-q0lvAlCsFPqHmcVHmjWrPg4JtncU",
  authDomain: "sistema-de-orcamento-d88d2.firebaseapp.com",
  projectId: "sistema-de-orcamento-d88d2",
  storageBucket: "sistema-de-orcamento-d88d2.appspot.com",
  messagingSenderId: "732107154322",
  appId: "1:732107154322:web:ee3cf596057a6bf3f4d74b",
  measurementId: "G-8KK7SDCD5M"
};

// Initialize Firebase
//if(firebaseConfig.apps.length === 0){
  const Firebase = initializeApp(firebaseConfig);
    //const analytics = getAnalytics(Firebase);
//}
export default Firebase;

//const app = initializeApp(firebaseConfig);
//const analytics = getAnalytics(app);