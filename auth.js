// ============================================================
// Gallery24 - auth.js
// Gestión de autenticación con Firebase
// ============================================================

import { auth } from "./firebase-init.js";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  onAuthStateChanged,
  updateProfile
} from "https://www.gstatic.com/firebasejs/12.17.1/firebase-auth.js";

// ============================================================
// UTILIDAD PARA MOSTRAR MENSAJES
// ============================================================

function mostrarMensaje(mensaje, tipo = "info") {
  console.log(`[${tipo.toUpperCase()}] ${mensaje}`);
  alert(mensaje); // Luego podemos reemplazarlo por notificaciones elegantes
}

// ============================================================
// REGISTRO
// ============================================================

export async function registrarUsuario(nombre, email, password) {
  try {

    const credencial = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    await updateProfile(credencial.user, {
      displayName: nombre
    });

    mostrarMensaje("Cuenta creada correctamente ✅", "success");

    return credencial.user;

  } catch (error) {

    mostrarMensaje(traducirError(error.code), "error");

    throw error;
  }
}

// ============================================================
// LOGIN
// ============================================================

export async function iniciarSesion(email, password) {

  try {

    const credencial = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );

    mostrarMensaje("Bienvenido a Gallery24 🎨", "success");

    return credencial.user;

  } catch (error) {

    mostrarMensaje(traducirError(error.code), "error");

    throw error;
  }
}

// ============================================================
// LOGOUT
// ============================================================

export async function cerrarSesion() {

  try {

    await signOut(auth);

    mostrarMensaje("Sesión cerrada correctamente.", "success");

  } catch (error) {

    mostrarMensaje(traducirError(error.code), "error");

  }

}

// ============================================================
// RECUPERAR CONTRASEÑA
// ============================================================

export async function recuperarPassword(email) {

  try {

    await sendPasswordResetEmail(auth, email);

    mostrarMensaje(
      "Se envió un correo para recuperar tu contraseña.",
      "success"
    );

  } catch (error) {

    mostrarMensaje(traducirError(error.code), "error");

  }

}

// ============================================================
// OBSERVADOR DE SESIÓN
// ============================================================

onAuthStateChanged(auth, (user) => {

  if (user) {

    console.log("Usuario conectado:");
    console.log(user);

  } else {

    console.log("No hay sesión iniciada.");

  }

});

// ============================================================
// TRADUCTOR DE ERRORES
// ============================================================

function traducirError(codigo) {

  switch (codigo) {

    case "auth/email-already-in-use":
      return "Este correo ya está registrado.";

    case "auth/invalid-email":
      return "Correo electrónico inválido.";

    case "auth/weak-password":
      return "La contraseña debe tener al menos 6 caracteres.";

    case "auth/user-not-found":
      return "No existe una cuenta con ese correo.";

    case "auth/wrong-password":
      return "Contraseña incorrecta.";

    case "auth/invalid-credential":
      return "Correo o contraseña incorrectos.";

    case "auth/network-request-failed":
      return "No hay conexión a Internet.";

    default:
      return "Ocurrió un error inesperado.";
  }

}
