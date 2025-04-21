// === IMPORT FIREBASE (Versi 10) ===
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  signInWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  doc,
  setDoc,
  getDoc,
} from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";

// === KONFIGURASI FIREBASE ===
const firebaseConfig = {
  apiKey: "AIzaSyCcn2psbwGtCMNofbtMMVLrzn5GjFDggYM",
  authDomain: "login2-3d9de.firebaseapp.com",
  projectId: "login2-3d9de",
  storageBucket: "login2-3d9de.firebasestorage.app",
  messagingSenderId: "297506282512",
  appId: "1:297506282512:web:f4ef35d1b809b1ce1d3e95",
  measurementId: "G-ND1JCBQE89",
};

// === INISIALISASI FIREBASE ===
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();

// === LOGIN DENGAN EMAIL / USERNAME ===
async function loginWithUsernameOrEmail(identifier, password) {
  let emailToUse = identifier;

  if (!identifier.includes("@")) {
    const q = query(
      collection(db, "users"),
      where("username", "==", identifier)
    );
    const snapshot = await getDocs(q);

    if (!snapshot.empty) {
      const userDoc = snapshot.docs[0];
      emailToUse = userDoc.data().email;
    } else {
      throw new Error("Username tidak ditemukan.");
    }
  }

  return signInWithEmailAndPassword(auth, emailToUse, password);
}

// === DOM LOADED ===
document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");
  const loginError = document.getElementById("loginError");
  const googleBtn = document.getElementById("googleLoginButton");

  // === LOGIN FORM (EMAIL / USERNAME)
  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const identifier = document
        .getElementById("usernameOrEmail")
        .value.trim();
      const password = document.getElementById("password").value;

      try {
        const result = await loginWithUsernameOrEmail(identifier, password);
        const user = result.user;

        const userDoc = await getDoc(doc(db, "users", user.uid));
        const userData = userDoc.data();

        if (!userData)
          throw new Error("Data pengguna tidak ditemukan di database.");

        localStorage.setItem(
          "loginUser",
          JSON.stringify({
            email: user.email,
            role: userData.role,
            username: userData.username,
          })
        );

        // === SweetAlert: Login sukses ===
        await Swal.fire({
          icon: "success",
          title: "Login Berhasil!",
          text: `Halo, ${userData.username || "pengguna"} 👋`,
          timer: 1500,
          showConfirmButton: false,
        });

        // Redirect berdasarkan role
        switch (userData.role) {
          case "admin":
            window.location.href = "dashboard_sistem.html";
            break;
          case "kasir":
            window.location.href = "dashboard_kasir.html";
            break;
          default:
            window.location.href = "dashboard.html";
        }
      } catch (err) {
        console.error("Login error:", err.message);

        Swal.fire({
          icon: "error",
          title: "Login Gagal!",
          text: err.message,
          confirmButtonColor: "#dc2626",
        });
      }
    });
  }

  // === LOGIN DENGAN GOOGLE ===
  if (googleBtn) {
    googleBtn.addEventListener("click", () => {
      signInWithPopup(auth, provider)
        .then(async (result) => {
          const user = result.user;
          const userRef = doc(db, "users", user.uid);

          await setDoc(
            userRef,
            {
              email: user.email,
              username: user.email.split("@")[0],
              role: "pelanggan",
            },
            { merge: true }
          );

          localStorage.setItem(
            "loginUser",
            JSON.stringify({
              email: user.email,
              role: "pelanggan",
            })
          );

          await Swal.fire({
            icon: "success",
            title: "Login Google Berhasil!",
            text: `Selamat datang, ${user.displayName}`,
            timer: 1500,
            showConfirmButton: false,
          });

          window.location.href = "produk.html";
        })
        .catch((error) => {
          console.error("Login error:", error);
          Swal.fire({
            icon: "error",
            title: "Login Gagal",
            text: error.message,
          });
        });
    });
  }

  // === TOGGLE PASSWORD ICON ===
  const passwordInput = document.getElementById("password");
  const toggleIcon = document.getElementById("togglePassword");

  if (passwordInput && toggleIcon) {
    toggleIcon.addEventListener("click", () => {
      const isHidden = passwordInput.type === "password";
      passwordInput.type = isHidden ? "text" : "password";
      toggleIcon.textContent = isHidden ? "🙈" : "👁️";
    });
  }
});

// === LOGOUT
window.logout = () => {
  signOut(auth).then(() => {
    localStorage.removeItem("loginUser");
    alert("Berhasil logout");
    window.location.reload();
  });
};
