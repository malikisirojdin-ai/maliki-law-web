import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, collection, addDoc, onSnapshot, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBf6p99MRkFY4DVpoYv3vItcLMGC0vO0R0",
  authDomain: "maliki-law-firm.firebaseapp.com",
  projectId: "maliki-law-firm",
  storageBucket: "maliki-law-firm.firebasestorage.app",
  messagingSenderId: "876963385165",
  appId: "1:876963385165:web:b69542c0806789057ff104"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const koleksiPerkara = collection(db, "daftar_perkara");

document.getElementById('btnSimpan').onclick = async () => {
    const nama = document.getElementById('namaKlien').value;
    const nomor = document.getElementById('noPerkara').value;
    if (nama && nomor) {
        try {
            await addDoc(koleksiPerkara, { klien: nama, no_perkara: nomor, waktu: new Date() });
            document.getElementById('namaKlien').value = "";
            document.getElementById('noPerkara').value = "";
        } catch (e) { alert("Gagal: " + e.message); }
    } else { alert("Lengkapi data!"); }
};

onSnapshot(koleksiPerkara, (snapshot) => {
    const tbody = document.getElementById('isiTabel');
    tbody.innerHTML = "";
    snapshot.forEach((berkas) => {
        const data = berkas.data();
        const tr = document.createElement('tr');
        tr.innerHTML = `<td>${data.no_perkara}</td><td>${data.klien}</td><td><button class="btnHapus" data-id="${berkas.id}">Selesai</button></td>`;
        tbody.appendChild(tr);
    });
    document.querySelectorAll('.btnHapus').forEach(btn => {
        btn.onclick = async (e) => {
            const id = e.target.getAttribute('data-id');
            await deleteDoc(doc(db, "daftar_perkara", id));
        };
    });
});