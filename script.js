import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp,
} from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";

// Tambahkan setelah konfigurasi firebase di index
const db = getFirestore();

// Fungsi simpan checkout
async function simpanOrder() {
  const user = window.loggedUser;
  if (!user) return;

  try {
    await addDoc(collection(db, "orders"), {
      uid: user.uid,
      email: user.email,
      items: cart,
      total: cart.reduce((sum, item) => sum + item.harga * item.jumlah, 0),
      timestamp: serverTimestamp(),
    });
    console.log("Pesanan tersimpan!");
  } catch (err) {
    console.error("Gagal simpan pesanan:", err);
  }
}

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

let produkListFiltered = [...produkList];

document.getElementById("searchInput").addEventListener("input", function () {
  const keyword = this.value.toLowerCase();
  produkListFiltered = produkList.filter((p) =>
    p.nama.toLowerCase().includes(keyword)
  );
  applySort();
});

document.getElementById("sortHarga").addEventListener("change", function () {
  applySort();
});

function applySort() {
  const keyword = document.getElementById("searchInput").value.toLowerCase();
  const sortHarga = document.getElementById("sortHarga").value;
  // const sortRating = document.getElementById("sortRating").value;
  const hargaMin = parseInt(document.getElementById("hargaMin").value) || 0;
  const hargaMax =
    parseInt(document.getElementById("hargaMax").value) || Infinity;
  const filterBahan = document.getElementById("filterBahan").value;

  let hasil = produkList.filter((p) => {
    return (
      p.nama.toLowerCase().includes(keyword) &&
      p.harga >= hargaMin &&
      p.harga <= hargaMax &&
      (filterBahan === "" || p.bahan === filterBahan)
    );
  });

  if (sortHarga === "terendah") {
    hasil.sort((a, b) => a.harga - b.harga);
  } else if (sortHarga === "tertinggi") {
    hasil.sort((a, b) => b.harga - a.harga);
  }

  tampilkanProduk(hasil);
}
document.getElementById("searchInput").addEventListener("input", applySort);
document.getElementById("sortHarga").addEventListener("change", applySort);
// document.getElementById("sortRating").addEventListener("change", applySort);
document.getElementById("hargaMin").addEventListener("input", applySort);
document.getElementById("hargaMax").addEventListener("input", applySort);
document.getElementById("filterBahan").addEventListener("change", applySort);

function resetFilter() {
  document.getElementById("searchInput").value = "";
  document.getElementById("sortHarga").value = "";
  // document.getElementById("sortRating").value = "";
  document.getElementById("hargaMin").value = "";
  document.getElementById("hargaMax").value = "";
  document.getElementById("filterBahan").value = "";

  // Kembalikan semua produk seperti awal
  tampilkanProduk(produkList);
}
//  keranjang
let cart = [];
// Fungsi tambah ke keranjang
function tambahKeKeranjang(produkId) {
  const produk = produkList.find((p) => p.id === produkId);
  if (!produk) return;

  const itemDiKeranjang = cart.find((item) => item.id === produkId);
  if (itemDiKeranjang) {
    if (itemDiKeranjang.jumlah < produk.stok) {
      itemDiKeranjang.jumlah += 1;
    } else {
      alert("Stok produk tidak cukup untuk ditambah.");
    }
  } else {
    cart.push({ ...produk, jumlah: 1 });
  }

  updateKeranjangUI(); // ✔ update jumlah
  tampilkanKeranjang(); // ✔ isi panel keranjang
  document.getElementById("cartPanel").classList.remove("translate-x-full"); // ✔ tampilkan panel
}

// Update tampilan jumlah di sticky cart
function updateKeranjangUI() {
  const cartCountEl = document.getElementById("cartCount");
  const totalItem = cart.reduce((acc, item) => acc + item.jumlah, 0);
  cartCountEl.textContent = totalItem;

  // Update tombol keranjang jadi "Sudah di Keranjang"
  document.querySelectorAll(".btnKeranjang").forEach((btn) => {
    const idProduk = parseInt(btn.getAttribute("data-id"));
    const itemDiKeranjang = cart.find((item) => item.id === idProduk);

    if (itemDiKeranjang) {
      btn.textContent = "✔ Sudah di Keranjang";
      btn.disabled = false;

      // Disable jika stok habis
      if (itemDiKeranjang.jumlah >= itemDiKeranjang.stok) {
        btn.disabled = true;
        btn.classList.add("bg-gray-400", "cursor-not-allowed");
        btn.classList.remove("bg-purple-600", "hover:bg-purple-700");
      }
    } else {
      const produk = produkList.find((p) => p.id === idProduk);
      if (produk.stok <= 0) {
        btn.textContent = "Stok Habis";
        btn.disabled = true;
        btn.classList.add("bg-gray-400", "cursor-not-allowed");
        btn.classList.remove("bg-purple-600", "hover:bg-purple-700");
      } else {
        btn.textContent = "+ Keranjang";
        btn.disabled = false;
        btn.classList.remove("bg-gray-400", "cursor-not-allowed");
        btn.classList.add("bg-purple-600", "hover:bg-purple-700");
      }
    }
  });
}

// Event listener untuk tombol "+ Keranjang" ditambahkan sekali saja
function tambahkanEventListenerKeranjang() {
  const btnKeranjang = document.querySelectorAll(".btnKeranjang");
  btnKeranjang.forEach((btn) => {
    btn.addEventListener("click", function () {
      const idProduk = parseInt(this.getAttribute("data-id"));
      tambahKeKeranjang(idProduk);
    });
  });
}

// Pastikan event listener hanya dipasang setelah produk ditampilkan
function tampilkanProduk(list = produkList) {
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
  class="mt-2 w-full bg-purple-600 text-white py-2 rounded-xl hover:bg-purple-700 transition font-medium btnDetail"
  data-id="${produk.id}"
>
  🔍 Detail
</button>
        </div>
      </div>
    `;
    container.innerHTML += produkHTML;
  });

  // Pasang event listener untuk tombol "+ Keranjang" setelah produk ditampilkan
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

// Panggil tampilkanProduk saat DOM sudah siap
document.addEventListener("DOMContentLoaded", () => {
  tampilkanProduk(); // otomatis pakai produkList
});

// Fungsi tambah ke keranjang
// Fungsi untuk menampilkan keranjang belanja
function tampilkanKeranjang() {
  const containerKeranjang = document.getElementById("cartContainer");
  containerKeranjang.innerHTML = ""; // Bersihkan sebelumnya

  if (cart.length === 0) {
    containerKeranjang.innerHTML =
      "<p class='text-gray-500 text-center'>Keranjang Anda kosong.</p>";
    return;
  }

  cart.forEach((item) => {
    const itemHTML = `
      <div class="flex items-start justify-between border-b pb-4">
        <div class="flex gap-3">
          <img src="${item.gambar}" alt="${
      item.nama
    }" class="w-16 h-16 object-cover rounded-md" />
          <div>
            <h4 class="font-semibold">${item.nama}</h4>
  <p class="text-sm text-gray-600">Rp ${item.harga.toLocaleString("id-ID")}</p>
  <p class="text-xs text-gray-500">Bahan: ${item.bahan}</p>
            <div class="flex items-center mt-2 space-x-2">
              <button class="kurangBtn bg-gray-300 px-2 rounded" data-id="${
                item.id
              }">−</button>
              <span>${item.jumlah}</span>
              <button class="tambahBtn bg-gray-300 px-2 rounded" data-id="${
                item.id
              }">+</button>
            </div>
          </div>
        </div>
        <button class="btnHapusProduk text-red-600 hover:text-red-800" data-id="${
          item.id
        }">✕</button>
      </div>
    `;
    containerKeranjang.innerHTML += itemHTML;
  });

  // Total
  const totalHarga = cart.reduce(
    (total, item) => total + item.harga * item.jumlah,
    0
  );
  containerKeranjang.innerHTML += `
    <div class="text-right font-bold border-t pt-4">
      Total: Rp. ${totalHarga.toLocaleString()}
    </div>
     <button id="checkoutBtn" class="mt-4 w-full bg-purple-600 text-white py-2 rounded-md hover:bg-purple-700 transition">
    🛍 Checkout Sekarang
  </button>
  `;

  // Event listener tombol hapus
  document.querySelectorAll(".btnHapusProduk").forEach((btn) => {
    btn.addEventListener("click", function () {
      const produkId = parseInt(this.getAttribute("data-id"));
      hapusDariKeranjang(produkId);
    });
  });

  // Event listener tambah jumlah
  document.querySelectorAll(".tambahBtn").forEach((btn) => {
    btn.addEventListener("click", function () {
      const id = parseInt(this.getAttribute("data-id"));
      const item = cart.find((i) => i.id === id);
      if (item && item.jumlah < item.stok) {
        item.jumlah++;
        updateKeranjangUI();
        tampilkanKeranjang();
      }
    });
  });

  // Event listener kurang jumlah
  document.querySelectorAll(".kurangBtn").forEach((btn) => {
    btn.addEventListener("click", function () {
      const id = parseInt(this.getAttribute("data-id"));
      const item = cart.find((i) => i.id === id);
      if (item && item.jumlah > 1) {
        item.jumlah--;
      } else {
        // Kalau jumlah jadi 0, hapus aja
        cart = cart.filter((i) => i.id !== id);
      }
      updateKeranjangUI();
      tampilkanKeranjang();
    });
  });
}

// Fungsi untuk menghapus produk dari keranjang
function hapusDariKeranjang(produkId) {
  // Filter untuk menghapus produk yang dipilih
  cart = cart.filter((item) => item.id !== produkId);
  updateKeranjangUI(); // Update UI keranjang setelah penghapusan
  tampilkanKeranjang(); // Update tampilan keranjang
}

// Panggil tampilkanKeranjang ketika halaman keranjang dibuka
document.addEventListener("DOMContentLoaded", () => {
  tampilkanKeranjang(); // Pastikan menampilkan keranjang saat halaman terbuka
});
// Buka modal keranjang saat ikon keranjang diklik
// Buka panel keranjang saat tombol ikon diklik
document.getElementById("stickyCart").addEventListener("click", () => {
  tampilkanKeranjang(); // tampilkan isi
  document.getElementById("cartPanel").classList.remove("translate-x-full");
});

// Tutup panel saat tombol close diklik
document.getElementById("closeCartPanel").addEventListener("click", () => {
  document.getElementById("cartPanel").classList.add("translate-x-full");
});

document.addEventListener("click", function (e) {
  if (e.target && e.target.id === "checkoutBtn") {
    if (!window.isLoggedIn) {
      Swal.fire({
        icon: "warning",
        title: "Login Dulu Yuk!",
        text: "Kamu harus login dulu sebelum bisa checkout 🛒",
        confirmButtonColor: "#f43f5e", // purple-500
      }).then(() => {
        window.location.href = "login.html";
      });
    } else {
      Swal.fire({
        icon: "success",
        title: "Checkout Berhasil!",
        html: `Terima kasih, <strong>${window.loggedUser.email}</strong> telah berbelanja di <strong>JewelBox</strong>! 🧢`,
        confirmButtonColor: "#f43f5e", // purple-500
      });

      cart = [];
      updateKeranjangUI();
      tampilkanKeranjang();
      document.getElementById("cartPanel").classList.add("translate-x-full");
    }
  }
});
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
      tambahKeKeranjang(produk.id);
    }
  });
}
