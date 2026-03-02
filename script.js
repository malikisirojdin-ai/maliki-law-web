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
// FUNGSI UNTUK BERTANYA KE GEMINI AI
const btnTanyaAI = document.getElementById('btnTanyaAI');

if (btnTanyaAI) {
    btnTanyaAI.onclick = async () => {
        const input = document.getElementById('inputAI').value;
        const hasilDiv = document.getElementById('hasilAI');
        const API_KEY_AI = AIzaSyDWAiDfzx2RWcL6m2-YioaVOx1wjbjJDaw; 

        if (!input) return alert("Tuliskan sesuatu untuk dianalisis AI!");

        hasilDiv.innerText = "Sedang berpikir...";

        try {
            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY_AI}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: "Kamu adalah asisten ahli hukum. Bantu Maliki menganalisis atau menulis draf jurnal ini: " + input }] }]
                })
            });
            const data = await response.json();
            hasilDiv.innerText = data.candidates[0].content.parts[0].text;
        } catch (e) {
            hasilDiv.innerText = "Waduh, ada error: " + e.message;
        }
    };
}