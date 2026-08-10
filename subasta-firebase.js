// Gallery24 — Subasta en tiempo real (Firestore)
// -----------------------------------------------------------------
// Reemplaza la simulación anterior (pujas inventadas con Math.random)
// por datos reales compartidos entre todos los que tengan la página abierta.

import { db } from './firebase-init.js';
import {
  doc, getDoc, setDoc,
  onSnapshot, collection, addDoc,
  query, orderBy, limit,
  runTransaction, serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.17.1/firebase-firestore.js";

// Por ahora trabajamos un solo lote "en vivo". Cuando tengamos varios
// lotes reales, este id vendrá de la URL o de una lista de lotes.
const LOTE_ID = 'lote-03';
const loteRef = doc(db, 'subastas', LOTE_ID);
const pujasRef = collection(db, 'subastas', LOTE_ID, 'pujas');

const currentAmountEl = document.getElementById('currentAmount');
const leaderNameEl = document.getElementById('leaderName');
const activityFeedEl = document.getElementById('activityFeed');

let currentBidEnMemoria = 0; // se actualiza con cada snapshot, para validar antes de pujar

function formatCOP(n) {
  return '$' + n.toLocaleString('es-CO');
}

// ---------- Identificar a quién puja ----------
// Simplificación de hoy: pedimos el nombre una sola vez y lo recordamos
// en este navegador. Cuando migremos a Firebase Authentication, esto se
// reemplaza por el nombre real de la cuenta.
function getBidderName() {
  let name = localStorage.getItem('gallery24_bidder_name');
  if (!name) {
    name = window.prompt('¿Cómo te llamas? (para identificar tu puja)') || 'Anónimo';
    localStorage.setItem('gallery24_bidder_name', name);
  }
  return name;
}

// ---------- Crear el lote en Firestore si nadie lo ha creado todavía ----------
async function seedLoteSiNoExiste() {
  const snap = await getDoc(loteRef);
  if (!snap.exists()) {
    await setDoc(loteRef, {
      currentBid: 980000,
      leaderName: 'Andrés M.',
      leaderTag: 'en sala',
    });
  }
}

// ---------- Escuchar el lote en tiempo real ----------
function escucharLote() {
  onSnapshot(loteRef, (snap) => {
    if (!snap.exists()) return;
    const data = snap.data();
    currentBidEnMemoria = data.currentBid;
    currentAmountEl.textContent = formatCOP(data.currentBid);
    const lugar = data.leaderTag === 'remoto' ? 'en línea' : 'en sala';
    leaderNameEl.textContent = `${data.leaderName} — ${lugar}`;
  });
}

// ---------- Escuchar el historial de pujas en tiempo real ----------
function escucharPujas() {
  const q = query(pujasRef, orderBy('creadoEn', 'desc'), limit(6));
  onSnapshot(q, (snap) => {
    activityFeedEl.innerHTML = '';
    snap.forEach((docSnap) => {
      const p = docSnap.data();
      const row = document.createElement('div');
      row.className = 'activity-row';
      row.innerHTML = `<span class="who">${p.name} <span class="tag">${p.tag}</span></span><span class="amt">${formatCOP(p.amount)}</span>`;
      activityFeedEl.appendChild(row);
    });
  });
}

// ---------- Pujar (con transacción, para que dos pujas simultáneas no choquen) ----------
async function pujar(monto) {
  if (!monto || monto <= currentBidEnMemoria) {
    alert('Tu oferta debe ser mayor a ' + formatCOP(currentBidEnMemoria));
    return;
  }

  const nombre = getBidderName();

  try {
    await runTransaction(db, async (transaction) => {
      const snap = await transaction.get(loteRef);
      const actual = snap.data().currentBid;
      if (monto <= actual) {
        throw new Error('Alguien más pujó primero. Oferta actual: ' + formatCOP(actual));
      }
      transaction.update(loteRef, {
        currentBid: monto,
        leaderName: nombre,
        leaderTag: 'remoto',
      });
    });

    await addDoc(pujasRef, {
      name: nombre,
      amount: monto,
      tag: 'remoto',
      creadoEn: serverTimestamp(),
    });
  } catch (err) {
    alert(err.message);
  }
}

// ---------- Conectar los botones que ya existen en el HTML ----------
document.querySelectorAll('.bid-opt').forEach((opt) => {
  opt.addEventListener('click', () => {
    const inc = parseInt(opt.dataset.inc, 10);
    pujar(currentBidEnMemoria + inc);
  });
});

document.getElementById('customBidBtn').addEventListener('click', () => {
  const input = document.getElementById('customBid');
  const val = parseInt(input.value, 10);
  pujar(val);
  input.value = '';
});

// ---------- Arrancar ----------
seedLoteSiNoExiste().then(() => {
  escucharLote();
  escucharPujas();
});
