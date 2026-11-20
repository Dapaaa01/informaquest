// ==========================================
// 1. KONFIGURASI SUPABASE
// ==========================================

const SUPABASE_URL = "https://bgkgigeichjxudxjkmoy.supabase.co";
const SUPABASE_KEY = "sb_publishable_aNqjAOh4Zd3MiNZp0EaMZA_5Gei692z";
const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

const ALLOWED_AVATARS = ["🤖", "👾", "👽", "👻", "🧙‍♂️", "🦊", "🐼", "🐸"];

function sanitizeAvatar(av) {
  if (typeof av === "string" && av.trim().length > 0) {
    const clean = av.trim();
    if (ALLOWED_AVATARS.includes(clean)) {
      return clean;
    }
  }
  return ALLOWED_AVATARS[0];
}

// ==========================================
// 2. KATALOG SHOP & POWER-UP SYSTEM
// ==========================================

const SHOP_CATALOG = [
  {
    id: "freeze",
    badge: "❄ 15s",
    name: "Time Freeze (15s)",
    price: 150,
    desc: "Membekukan hitungan mundur timer selama 15 detik saat menganalisis objek 3D."
  },
  {
    id: "autosolve",
    badge: "🤖 AUTO",
    name: "Auto-Solve Answer",
    price: 250,
    desc: "Otomatis memilih jawaban yang benar pada soal aktif beserta bonus EXP."
  },
  {
    id: "doubleexp",
    badge: "⚡ 2X",
    name: "2x EXP Booster",
    price: 200,
    desc: "Menggandakan 2x lipat perolehan EXP pada soal berikutnya jika dijawab benar."
  },
  {
    id: "fiftyfifty",
    badge: "🎯 50:50",
    name: "50:50 Eliminator",
    price: 120,
    desc: "Menghapus dua pilihan jawaban yang salah pada soal yang sedang aktif."
  }
];

function openShopModal() {
  if (!playerState.isLoggedIn) {
    showCustomModal({
      icon: "🔒",
      title: "Login Diperlukan",
      message: "Masuk atau daftar akun Mahasiswa terlebih dahulu untuk mengakses InformaQuest Shop.",
      theme: "default"
    });
    return;
  }
  SoundEngine.playClick();
  renderShopItems();
  document.getElementById("shop-modal-backdrop").classList.add("show");
}

function closeShopModal() {
  SoundEngine.playClick();
  document.getElementById("shop-modal-backdrop").classList.remove("show");
}

function renderShopItems() {
  document.getElementById("shop-balance-display").textContent = playerState.coins;
  const grid = document.getElementById("shop-items-grid");
  grid.innerHTML = SHOP_CATALOG.map(item => {
    const owned = playerState.inventory[item.id] || 0;
    const canAfford = playerState.coins >= item.price;
    return `
      <div class="shop-item-card">
        <div>
          <div class="si-top">
            <span class="si-icon">${item.badge}</span>
            <span class="si-owned">DIMILIKI: ${owned}</span>
          </div>
          <div class="si-name">${item.name}</div>
          <div class="si-desc">${item.desc}</div>
        </div>
        <button class="btn-tactile ${canAfford ? "btn-yellow" : "btn-cream"} btn-sm btn-block"
          ${canAfford ? "" : "disabled"}
          onclick="buyShopItem('${item.id}')">
          🛒 BELI • ◈ ${item.price}
        </button>
      </div>
    `;
  }).join("");
}

function buyShopItem(itemId) {
  const item = SHOP_CATALOG.find(i => i.id === itemId);
  if (!item || playerState.coins < item.price) return;

  SoundEngine.playCorrect();
  playerState.coins -= item.price;
  playerState.inventory[itemId] = (playerState.inventory[itemId] || 0) + 1;
  saveLocalPlayerStats();
  syncCoinDisplays();
  renderShopItems();
}

function syncCoinDisplays() {
  const mapCoins = document.getElementById("map-total-coins");
  if (mapCoins) mapCoins.textContent = `◈ ${playerState.coins}`;

  const profCoins = document.getElementById("prof-total-coins");
  if (profCoins) profCoins.textContent = `◈ ${playerState.coins}`;

  const quizCoins = document.getElementById("quiz-coin-display");
  if (quizCoins) quizCoins.textContent = playerState.coins;
}