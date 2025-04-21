// Firebase & Auth
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
  signOut,
} from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
} from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";

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
const db = getFirestore(app);

let currentUser = null;
let cart = [];

// ==============================
// AUTH: Cek Login
// ==============================
onAuthStateChanged(auth, async (user) => {
  currentUser = user;
  document.getElementById("userEmail").textContent = user.email;

  const q = query(collection(db, "users"), where("email", "==", user.email));
  const snap = await getDocs(q);
  if (!snap.empty) {
    const data = snap.docs[0].data();
    document.getElementById("userName").textContent = data.nama || "Pengguna";
  }

  tampilkanProduk();
});

// ==============================
// LOGOUT
// ==============================
document.getElementById("logoutBtn").addEventListener("click", async () => {
  await signOut(auth);

  Swal.fire({
    icon: "success",
    title: "Logout Berhasil 👋",
    text: "Sampai jumpa lagi di jewelry store kami!",
    confirmButtonColor: "#f43f5e",
  }).then(() => {
    window.location.href = "index.html";
  });
});
// ==============================
// DATA PRODUK
// Produk Filtered (default sama dengan produkList)
let produkListFiltered = [];
// ==============================
const produkList = [
  {
    id: 1, // Tambahkan id untuk setiap produk
    nama: "Cincin Elegan",
    harga: 259000,
    gambar: "produk/cincin1.jpg",
    stok: 1,
    bahan: "Emas 18K",
    deskripsi:
      "Cincin dengan desain klasik dan sentuhan modern, cocok untuk berbagai acara spesial.",
    label: "💎 Limited Edition",
  },

  {
    id: 2, // Tambahkan id untuk setiap produk
    nama: "Aurora Luxe",
    harga: 249000,
    tanggal: "2025-04-15",
    gambar: "produk/cincin2.jpg",
    stok: 2,
    bahan: "Perak & Kristal Swarovski",
    deskripsi:
      "Memancarkan keanggunan dengan kilau mewah dari kristal asli Swarovski.",
    label: "⭐ Best Seller",
  },
  {
    id: 3, // Tambahkan id untuk setiap produk
    nama: "Amethyst Dream",
    harga: 189000,
    bahan: "Batu Ametis & Rantai Baja",
    tanggal: "2025-04-10",
    gambar: "produk/kalung 4.jpg",
    stok: 2,
    deskripsi:
      "Kalung dengan batu Ametis yang menenangkan, sempurna untuk gaya elegan sehari-hari.",
    // label: "Limited Edition", //
    label: "🎁 Gift Favorite",
  },
  {
    id: 4, // Tambahkan id untuk setiap produk
    nama: "purplegold Blossom",
    harga: 209000,
    bahan: "purplegold Plated & Zircon",
    tanggal: "2025-04-12",
    gambar: "produk/gelang1.jpg",
    stok: 2,
    label: "New Arrival", // 🌟
    deskripsi: "Gelang mewah dengan nuansa ungu keemasan dan kilau zircon.",
  },
  {
    id: 5, // Tambahkan id untuk setiap produk
    nama: "Pearl Whisper",
    harga: 179000,
    bahan: "Mutiara Laut & Rantai Emas",
    tanggal: "2025-04-20",
    gambar: "produk/anting3.jpg",
    stok: 2,
    deskripsi:
      "Anting-anting anggun dengan sentuhan mutiara laut yang memikat.",
  },
  {
    id: 6, // Tambahkan id untuk setiap produk
    nama: "Crystal Bloom",
    harga: 179000,
    bahan: "Mutiara Laut & Rantai Emas",
    tanggal: "2025-04-20",
    gambar: "produk/kalung6.jpg",
    stok: 2,
    deskripsi:
      "Kalung dengan desain bunga dan kristal untuk tampilan mempesona.",
  },
  {
    id: 7, // Tambahkan id untuk setiap produk
    nama: "Zircon Halo",
    harga: 239000,
    bahan: "Perak Sterling & Zirco",
    tanggal: "2025-04-12",
    gambar: "produk/cincin5.jpg",
    stok: 2,
    deskripsi: "Cincin dengan desain halo klasik berkilau dari zircon jernih.",
  },
  {
    id: 8, // Tambahkan id untuk setiap produk
    nama: "Moonlit Silver",
    harga: 249000,
    bahan: "Mutiara Laut & Rantai Emas",
    tanggal: "2025-04-03",
    gambar: "produk/gelang2.jpeg",
    stok: 1,
    deskripsi: "Gelang perak dengan kesan tenang seperti cahaya bulan malam.",
  },
  {
    id: 9,
    nama: "Gilded Leaf",
    harga: 405000,
    gambar: "produk/anting.jpg",
    stok: 1,
    bahan: "Emas Plated & Resin",
    deskripsi:
      "Anting daun berlapis emas yang ringan dan cantik untuk sehari-hari.",
    label: "🔥 Hot Item",
  },

  {
    id: 10,
    nama: "Velvet Charm Box",
    harga: 99000,
    gambar: "produk/kalung 5.jpg",
    stok: 1,
    bahan: "Beludru & Kayu",
    deskripsi:
      "Kotak perhiasan berbahan beludru lembut dengan finishing premium.",
  },
  {
    id: 11,
    nama: "Acrylic Magic Box",
    harga: 765000,
    gambar: "produk/kalung 4.jpg",
    stok: 4,
    bahan: "Akrilik Transparan",
    deskripsi:
      "Kotak perhiasan bening, cocok untuk tampilan modern dan praktis.",
  },
  {
    id: 12,
    nama: "Royal Gift Box",
    harga: 129000,
    gambar: "produk/box.jpeg",
    stok: 2,
    bahan: "Kayu Elegan & Suede",
    deskripsi: "Kotak hadiah eksklusif dengan sentuhan kemewahan klasik.",
    label: "🎁 Gift Favorite",
  },
];
produkListFiltered = [...produkList]; // Inisialisasi produkListFiltered dengan produkList

// ==============================
// FUNGSI TAMPILAN PRODUK
// ==============================
function tampilkanProduk(list = produkListFiltered) {
  const container = document.getElementById("product-container");
  container.innerHTML = "";

  list.forEach((produk) => {
    const produkHTML = `
      <div class="bg-purple rounded-2xl border border-purple-100 shadow-md hover:shadow-xl hover:border-purple-300 transition duration-300 transform hover:scale-[1.02] overflow-hidden flex flex-col">
       ${
         produk.label
           ? `<span class="absolute top-3 left-3 bg-purple-500 text-white text-xs px-2 py-1 rounded-full shadow">${produk.label}</span>`
           : ""
       }
        <img src="${produk.gambar}" alt="${
      produk.nama
    }" class="w-full h-60 object-cover" />
        <div class="p-4 flex-1 flex flex-col justify-between">
          <div>
            <h3 class="text-lg font-semibold text-purple-800 mb-1">${
              produk.nama
            }</h3>
            <p class="text-purple-600 font-bold mb-1">Rp ${produk.harga.toLocaleString(
              "id-ID"
            )}</p>
            <p class="text-sm text-gray-500 mb-1">Bahan: <span class="text-gray-700">${
              produk.bahan
            }</span></p>
            <p class="text-sm text-gray-500 mb-2">Stok: <span class="text-gray-700">${
              produk.stok
            }</span></p>
          </div>
          <button 
            data-id="${produk.id}" 
            class="btnKeranjang mt-auto w-full bg-purple-500 text-white py-2 rounded-xl hover:bg-purple-600 transition font-medium"
            ${
              produk.stok === 0
                ? "disabled class='opacity-50 cursor-not-allowed'"
                : ""
            }
          >
            ${produk.stok === 0 ? "Stok Habis" : "+ Keranjang"}
          </button>
           <button 
  class="mt-2 w-full bg-emerald-600 text-white py-2 rounded-xl hover:bg-emerald-700 transition font-medium btnDetail"
  data-id="${produk.id}"
>
  🔍 Detail
</button>
        </div>
      </div>
    `;
    container.innerHTML += produkHTML;
  });

  tambahkanEventListenerKeranjang();
  document.querySelectorAll(".btnDetail").forEach((btn) => {
    btn.addEventListener("click", function (e) {
      e.stopPropagation();
      const idProduk = parseInt(this.getAttribute("data-id"));
      tampilkanDetail(idProduk);
    });
  });

  feather.replace();
}

function applySort() {
  const keyword = document.getElementById("searchInput").value.toLowerCase();
  const sortHarga = document.getElementById("sortHarga").value;
  // const sortRating = document.getElementById("sortRating").value;
  const hargaMin = parseInt(document.getElementById("hargaMin").value) || 0;
  const hargaMax =
    parseInt(document.getElementById("hargaMax").value) || Infinity;
  const filterBahan = document.getElementById("filterBahan").value;

  produkListFiltered = produkList.filter((p) => {
    return (
      p.nama.toLowerCase().includes(keyword) &&
      p.harga >= hargaMin &&
      p.harga <= hargaMax &&
      (filterBahan === "" || p.bahan === filterBahan)
    );
  });

  if (sortHarga === "terendah")
    produkListFiltered.sort((a, b) => a.harga - b.harga);
  else if (sortHarga === "tertinggi")
    produkListFiltered.sort((a, b) => b.harga - a.harga);

  tampilkanProduk(produkListFiltered);
}

// Event pencarian dan filter
["searchInput", "sortHarga", "hargaMin", "hargaMax", "filterBahan"].forEach(
  (id) => {
    const el = document.getElementById(id);
    if (el) el.addEventListener("input", applySort);
  }
);

function tambahkanEventListenerKeranjang() {
  document.querySelectorAll(".btnKeranjang").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = parseInt(btn.dataset.id);
      const produk = produkList.find((p) => p.id === id);
      const item = cart.find((i) => i.id === id);
      if (item) {
        if (item.jumlah < produk.stok) item.jumlah++;
        else alert("Stok tidak cukup.");
      } else {
        cart.push({ ...produk, jumlah: 1 });
      }
      updateKeranjangUI();
      tampilkanKeranjang(); // 🔥 inilah yang bikin auto-refresh keranjang!
    });
  });
}

function updateKeranjangUI() {
  const cartCount = cart.reduce((sum, i) => sum + i.jumlah, 0);
  document.getElementById("cartCount").textContent = cartCount;
}

// ==============================
// KERANJANG
// ==============================
document
  .getElementById("stickyCart")
  .addEventListener("click", tampilkanKeranjang);
document.getElementById("closeCartPanel").addEventListener("click", () => {
  document.getElementById("cartPanel").classList.add("translate-x-full");
});

function tampilkanKeranjang() {
  const container = document.getElementById("cartContainer");
  container.innerHTML = "";

  if (cart.length === 0) {
    container.innerHTML = `<p class='text-gray-500 text-center'>Keranjang kosong.</p>`;
    return;
  }

  cart.forEach((item) => {
    const row = document.createElement("div");
    row.className = "flex gap-3 border-b pb-4 mb-4";

    row.innerHTML = `
      <img src="${item.gambar}" alt="${
      item.nama
    }" class="w-16 h-16 object-cover rounded" />
      <div class="flex-1">
        <div class="flex justify-between">
          <h4 class="font-semibold">${item.nama}</h4>
          <button class="hapusItem text-red-500" data-id="${item.id}">✕</button>
        </div>
        <p class="text-sm text-gray-500">IDR ${item.harga.toLocaleString()}</p>
        <div class="flex items-center mt-2 space-x-2">
          <button class="kurangBtn bg-gray-200 px-2 rounded" data-id="${
            item.id
          }">−</button>
          <span>${item.jumlah}</span>
          <button class="tambahBtn bg-gray-200 px-2 rounded" data-id="${
            item.id
          }">+</button>
        </div>
      </div>
    `;

    container.appendChild(row);
  });

  const total = cart.reduce((t, i) => t + i.harga * i.jumlah, 0);
  container.innerHTML += `
    <div class="text-right font-bold pt-4 border-t">
      Total: IDR ${total.toLocaleString()}
    </div>
    <button id="checkoutBtn" class="mt-4 w-full bg-emerald-600 text-white py-2 rounded hover:bg-emerald-700">
      🛍 Checkout
    </button>
  `;

  // Event: Hapus
  document.querySelectorAll(".hapusItem").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = parseInt(btn.dataset.id);
      cart = cart.filter((item) => item.id !== id);
      updateKeranjangUI();
      tampilkanKeranjang();
    });
  });

  // Event: Tambah
  document.querySelectorAll(".tambahBtn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = parseInt(btn.dataset.id);
      const item = cart.find((i) => i.id === id);
      if (item && item.jumlah < item.stok) {
        item.jumlah++;
        updateKeranjangUI();
        tampilkanKeranjang();
      }
    });
  });

  // Event: Kurang
  document.querySelectorAll(".kurangBtn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = parseInt(btn.dataset.id);
      const item = cart.find((i) => i.id === id);
      if (item && item.jumlah > 1) {
        item.jumlah--;
      } else {
        cart = cart.filter((i) => i.id !== id);
      }
      updateKeranjangUI();
      tampilkanKeranjang();
    });
  });

  document.getElementById("cartPanel").classList.remove("translate-x-full");
}

// ==============================
// CHECKOUT
// ==============================
document.addEventListener("click", function (e) {
  if (e.target && e.target.id === "checkoutBtn") {
    if (!currentUser) {
      alert("Harus login untuk checkout!");
      return;
    }

    // Simpan data cart ke localStorage
    localStorage.setItem("cartCheckout", JSON.stringify(cart));

    // Kosongkan keranjang dan arahkan ke struk
    cart = [];
    updateKeranjangUI();
    tampilkanKeranjang();
    document.getElementById("cartPanel").classList.add("translate-x-full");

    // Redirect ke struk
    window.location.href = "sukses.html";
  }
});

function tampilkanStruk() {
  const struk = document.getElementById("strukContent");
  const waktu = new Date().toLocaleString();
  let isi = `<p><strong>Waktu:</strong> ${waktu}</p><ul class="list-disc ml-4">`;
  cart.forEach((item) => {
    isi += `<li>${item.nama} × ${
      item.jumlah
    } — IDR ${item.harga.toLocaleString()}</li>`;
  });
  const total = cart.reduce((t, i) => t + i.harga * i.jumlah, 0);
  isi += `</ul><p class="mt-2 font-bold">Total: IDR ${total.toLocaleString()}</p>`;
  struk.innerHTML = isi;
  document.getElementById("strukModal").classList.remove("hidden");
}
function tampilkanDetail(id) {
  const produk = produkList.find((p) => p.id === id);
  if (!produk) return;

  Swal.fire({
    title: produk.nama,
    html: `
      <img src="${produk.gambar}" alt="${
      produk.nama
    }" class="w-full rounded-lg mb-4 shadow" style="max-height: 240px; object-fit: cover;" />
      <p class="text-lg font-bold text-purple-700 mb-2">Rp ${produk.harga.toLocaleString(
        "id-ID"
      )}</p>
      <p><strong>Bahan:</strong> ${produk.bahan}</p>
      <p><strong>Stok:</strong> ${produk.stok}</p>
      <p class="text-sm text-gray-600 italic mt-3">${
        produk.deskripsi || "Deskripsi belum tersedia."
      }</p>
    `,
    confirmButtonText: "➕ Tambah ke Keranjang",
    showCancelButton: true,
    cancelButtonText: "Tutup",
    confirmButtonColor: "#9333ea",
    cancelButtonColor: "#d1d5db",
    showCloseButton: true,
  }).then((result) => {
    if (result.isConfirmed) {
      const item = cart.find((i) => i.id === produk.id);
      if (item) {
        if (item.jumlah < produk.stok) item.jumlah++;
        else return alert("Stok tidak cukup.");
      } else {
        cart.push({ ...produk, jumlah: 1 });
      }
      updateKeranjangUI();
      tampilkanKeranjang();
    }
  });
}
