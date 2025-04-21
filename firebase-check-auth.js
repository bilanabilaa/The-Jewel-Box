// firebase-check-auth.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";

// Firebase config (sama seperti yg kamu pakai sebelumnya)
const firebaseConfig = {
  apiKey: "AIzaSyCcn2psbwGtCMNofbtMMVLrzn5GjFDggYM",
  authDomain: "login2-3d9de.firebaseapp.com",
  projectId: "login2-3d9de",
  storageBucket: "login2-3d9de.firebasestorage.app",
  messagingSenderId: "297506282512",
  appId: "1:297506282512:web:f4ef35d1b809b1ce1d3e95",
  measurementId: "G-ND1JCBQE89",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

window.isLoggedIn = false;
window.loggedUser = null;

onAuthStateChanged(auth, (user) => {
  if (user) {
    window.isLoggedIn = true;
    window.loggedUser = user;
    console.log("Sudah login sebagai:", user.email);
  } else {
    window.isLoggedIn = false;
    window.loggedUser = null;
    console.log("Belum login.");
  }
});
