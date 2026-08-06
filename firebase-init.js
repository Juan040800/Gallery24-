// Gallery24 — Conexión a Firebase
// -----------------------------------------------------------------
// Este archivo SOLO inicializa Firebase y deja listas dos conexiones:
//   - auth: para registro / inicio de sesión
//   - db:   para leer y escribir datos en Firestore
//
// Otras páginas lo van a usar así:
//   import { auth, db } from './firebase-init.js';
//
// Nota para aprendizaje: como este archivo usa "import/export", tanto
// este archivo como cualquiera que lo use deben cargarse con
// <script type="module">, no con un <script> normal.

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAcMW9GQYDcFIcawQBKqMAtoxfoa_U_HCw",
  authDomain: "gallery24-b7d94.firebaseapp.com",
  projectId: "gallery24-b7d94",
  storageBucket: "gallery24-b7d94.firebasestorage.app",
  messagingSenderId: "827851764588",
  appId: "1:827851764588:web:36e1b26b941c69a61ff949",
  measurementId: "G-L6FYP0JZ02"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

console.log("Firebase conectado ✅");
