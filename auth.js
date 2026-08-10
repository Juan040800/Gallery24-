// auth.js — Lógica de autenticación con Firebase
import { auth } from './firebase-init.js';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  sendPasswordResetEmail,
  signOut,
  onAuthStateChanged
} from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js';

const googleProvider = new GoogleAuthProvider();

// Registro con correo y contraseña
export async function registrarConCorreo(correo, contrasena) {
  const cred = await createUserWithEmailAndPassword(auth, correo, contrasena);
  return cred.user;
}

// Login con correo y contraseña
export async function iniciarSesionConCorreo(correo, contrasena) {
  const cred = await signInWithEmailAndPassword(auth, correo, contrasena);
  return cred.user;
}

// Login con Google (abre popup)
export async function iniciarSesionConGoogle() {
  const cred = await signInWithPopup(auth, googleProvider);
  return cred.user;
}

// Recuperar contraseña
export async function recuperarContrasena(correo) {
  await sendPasswordResetEmail(auth, correo);
}

// Cerrar sesión
export async function cerrarSesion() {
  await signOut(auth);
}

// Escuchar cambios de sesión (para usar en cualquier página protegida)
export function escucharEstadoAuth(callback) {
  onAuthStateChanged(auth, (usuario) => {
    callback(usuario); // usuario será null si no hay sesión activa
  });
}
