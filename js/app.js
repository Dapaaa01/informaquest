// ==========================================
// 3. CUSTOM IN-APP MODAL ENGINE
// ==========================================
let isModalOpen = false;

function showCustomModal({
  icon = "!",
  title = "Pemberitahuan",
  message = "",
  theme = "default",
  confirmText = "MENGERTI",
  cancelText = null,
  onConfirm = null,
  onCancel = null
}) {
  const backdrop = document.getElementById("custom-modal-backdrop");
  const card = document.getElementById("custom-modal-card");
  const iconEl = document.getElementById("custom-modal-icon");
  const titleEl = document.getElementById("custom-modal-title");
  const msgEl = document.getElementById("custom-modal-message");
  const actionsEl = document.getElementById("custom-modal-actions");

  card.classList.remove("danger-theme", "gold-theme");
  if (theme === "danger") card.classList.add("danger-theme");
  if (theme === "gold") card.classList.add("gold-theme");

  iconEl.textContent = icon;
  titleEl.textContent = title;
  msgEl.innerHTML = message;
  actionsEl.innerHTML = "";

  if (cancelText) {
    const cancelBtn = document.createElement("button");
    cancelBtn.className = "btn-tactile btn-cream";
    cancelBtn.textContent = cancelText;
    cancelBtn.onclick = () => {
      SoundEngine.playClick();
      closeCustomModal();
      if (onCancel) onCancel();
    };
    actionsEl.appendChild(cancelBtn);
  }

  const okBtn = document.createElement("button");
  okBtn.className =
    theme === "danger"
      ? "btn-tactile btn-red"
      : theme === "gold"
      ? "btn-tactile btn-yellow"
      : "btn-tactile btn-lime";
  okBtn.textContent = confirmText;
  okBtn.onclick = () => {
    SoundEngine.playClick();
    closeCustomModal();
    if (onConfirm) onConfirm();
  };
  actionsEl.appendChild(okBtn);

  isModalOpen = true;
  backdrop.classList.add("show");
}

function closeCustomModal() {
  document.getElementById("custom-modal-backdrop").classList.remove("show");
  isModalOpen = false;
}

// ==========================================
// 7. STATE AKUN, COINS (AWAL 0), INVENTORY (AWAL 0)
// ==========================================
let playerState = {
  isLoggedIn: false,
  name: "",
  pin: "",
  avatar: "🤖",
  totalExp: 0,
  coins: 0,
  inventory: {
    freeze: 0,
    autosolve: 0,
    doubleexp: 0,
    fiftyfifty: 0
  },
  completedLevels: 0,
  failedLevels: [],
  totalTimeSec: 0,
  totalCorrectAll: 0,
  everRankOne: false,
  dbRowId: null
};

let authMode = "login";
let selectedRegisterAvatar = "🤖";

let currentLevelObj = null;
let currentQuestionIdx = 0;
let sessionExp = 0;
let sessionCoins = 0;
let sessionCorrect = 0;
let levelStartTimestamp = 0;
let timerInterval = null;
let timeLeft = 30;
let freezeSecondsRemaining = 0;
let doubleExpActive = false;
let answered = false;
let isExamLocked = false;
let ignoreNextFullscreenExit = false;
let previousScreenBeforeLb = "screen-login";

function getPlayerStatsKey() {
  return `informaquest_stats_${playerState.name.toLowerCase()}`;
}

function loadLocalPlayerStats() {
  if (!playerState.name) return;
  try {
    const raw = localStorage.getItem(getPlayerStatsKey());
    if (raw) {
      const parsed = JSON.parse(raw);
      playerState.failedLevels = parsed.failedLevels || [];
      playerState.totalTimeSec = parsed.totalTimeSec || 0;
      playerState.totalCorrectAll = parsed.totalCorrectAll || 0;
      playerState.everRankOne = !!parsed.everRankOne;
      playerState.coins = typeof parsed.coins === "number" ? parsed.coins : 0;
      if (parsed.inventory) {
        playerState.inventory = {
          freeze: parsed.inventory.freeze || 0,
          autosolve: parsed.inventory.autosolve || 0,
          doubleexp: parsed.inventory.doubleexp || 0,
          fiftyfifty: parsed.inventory.fiftyfifty || 0
        };
      }
    }
  } catch (e) {
    console.warn("Gagal membaca statistik lokal:", e);
  }
}

function saveLocalPlayerStats() {
  if (!playerState.name) return;
  localStorage.setItem(
    getPlayerStatsKey(),
    JSON.stringify({
      failedLevels: playerState.failedLevels,
      totalTimeSec: playerState.totalTimeSec,
      totalCorrectAll: playerState.totalCorrectAll,
      everRankOne: playerState.everRankOne,
      coins: playerState.coins,
      inventory: playerState.inventory
    })
  );
}

function formatDuration(sec) {
  const s = Math.max(0, Math.round(sec));
  const mins = Math.floor(s / 60);
  const rem = s % 60;
  return `${mins}m ${String(rem).padStart(2, "0")}s`;
}

function computeAchievements() {
  const finishedAll5Clean = playerState.completedLevels >= 5 && playerState.failedLevels.length === 0;
  const zeroMistakes = finishedAll5Clean && playerState.totalCorrectAll >= 50;
  const underTwoMinutes = finishedAll5Clean && playerState.totalTimeSec > 0 && playerState.totalTimeSec <= 120;
  const underOneMinute = finishedAll5Clean && playerState.totalTimeSec > 0 && playerState.totalTimeSec <= 60;

  return [
    {
      id: "rank1",
      icon: "👑",
      title: "Sang Juara 1",
      desc: "Pernah menduduki peringkat 1 di Podium Global.",
      unlocked: playerState.everRankOne
    },
    {
      id: "finish5",
      icon: "🏁",
      title: "Penakluk Unit 1.1",
      desc: "Menyelesaikan seluruh Soal 1 – Soal 5 hingga garis finish.",
      unlocked: finishedAll5Clean
    },
    {
      id: "perfect",
      icon: "💎",
      title: "Sempurna Tanpa Salah",
      desc: "Menjawab benar seluruh 50 pertanyaan tanpa satu pun salah.",
      unlocked: zeroMistakes
    },
    {
      id: "speed2m",
      icon: "⚡",
      title: "Pelari Kilat (≤ 2 Menit)",
      desc: "Menyelesaikan Unit 1.1 dalam total waktu ≤ 2 menit.",
      unlocked: underTwoMinutes
    },
    {
      id: "speed1m",
      icon: "🚀",
      title: "Kecepatan Cahaya (≤ 1 Menit)",
      desc: "Menyelesaikan Unit 1.1 dalam total waktu ≤ 1 menit.",
      unlocked: underOneMinute
    }
  ];
}

function getUnlockedLevel() {
  return Math.min(playerState.completedLevels + 1, 5);
}

function switchScreen(screenId) {
  document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
  document.getElementById(screenId).classList.add("active");
  updateGlobalNavbar();
  syncCoinDisplays();
}

function updateGlobalNavbar() {
  const navActions = document.getElementById("global-nav-actions");
  if (!navActions) return;

  if (playerState.isLoggedIn) {
    navActions.innerHTML = `
      <button class="btn-tactile btn-cyan btn-sm" onclick="openShopModal()">
        🛒 SHOP
      </button>
      <button class="btn-tactile btn-yellow btn-sm" onclick="openProfileScreen()">
        [${sanitizeAvatar(playerState.avatar)}] ${escapeHtml(playerState.name)}
      </button>
      <button class="btn-tactile btn-cream btn-sm" onclick="openLeaderboardScreen()">
        🏆 PODIUM
      </button>
    `;
  } else {
    navActions.innerHTML = `
      <button class="btn-tactile btn-cream btn-sm" onclick="openLeaderboardScreen()">
        🏆 PODIUM
      </button>
    `;
  }
}

function handleBrandClick() {
  if (isExamLocked) return;
  SoundEngine.playClick();
  if (playerState.isLoggedIn) {
    backToMap();
  } else {
    switchScreen("screen-login");
  }
}

// ==========================================
// 8. PENGUNCIAN LAYAR PENUH & TOMBOL X / CANCEL
// ==========================================
function requestBrowserFullscreen() {
  const elem = document.documentElement;
  if (!document.fullscreenElement) {
    if (elem.requestFullscreen) {
      elem.requestFullscreen().catch(() => {});
    } else if (elem.webkitRequestFullscreen) {
      elem.webkitRequestFullscreen();
    }
  }
}

function enforceFullscreenLock() {
  isExamLocked = true;
  ignoreNextFullscreenExit = false;
  document.body.classList.add("exam-locked");
  requestBrowserFullscreen();
}

function releaseFullscreenLock() {
  isExamLocked = false;
  ignoreNextFullscreenExit = false;
  document.body.classList.remove("exam-locked");

  if (document.fullscreenElement) {
    if (document.exitFullscreen) {
      document.exitFullscreen().catch(() => {});
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    }
  }
}

async function handleExamViolationAndFail(reasonText) {
  if (!isExamLocked || !currentLevelObj) return;

  const failedLvl = currentLevelObj.level;
  const elapsedSec = Math.max(1, Math.round((Date.now() - levelStartTimestamp) / 1000));
  playerState.totalTimeSec += elapsedSec;

  clearInterval(timerInterval);
  releaseFullscreenLock();
  SoundEngine.playDisqualified();

  if (!playerState.failedLevels.includes(failedLvl)) {
    playerState.failedLevels.push(failedLvl);
  }
  if (failedLvl > playerState.completedLevels) {
    playerState.completedLevels = failedLvl;
  }
  saveLocalPlayerStats();

  try {
    if (playerState.dbRowId) {
      await supabaseClient
        .from("quiz_scores")
        .update({
          highest_level: playerState.completedLevels
        })
        .eq("id", playerState.dbRowId);
    }
  } catch (err) {
    console.error("Gagal mencatat status diskualifikasi:", err);
  }

  renderLearningMap();
  switchScreen("screen-map");

  showCustomModal({
    icon: "✕",
    title: `Soal ${failedLvl} Didiskualifikasi`,
    message: `${reasonText}<br><br>Soal ${failedLvl} ditandai <b>GAGAL (Merah)</b>, tidak dapat dikerjakan lagi, dan kamu dialihkan ke bagian berikutnya.`,
    theme: "danger",
    confirmText: "KEMBALI KE MENU UTAMA"
  });
}

document.addEventListener("fullscreenchange", () => {
  if (!isExamLocked) return;
  if (!document.fullscreenElement) {
    if (ignoreNextFullscreenExit || isModalOpen) {
      return;
    }
    handleExamViolationAndFail("Kamu keluar dari tampilan layar penuh saat ujian berlangsung!");
  }
});

document.addEventListener("visibilitychange", () => {
  if (isExamLocked && document.hidden && !isModalOpen) {
    handleExamViolationAndFail("Terdeteksi berpindah tab atau minimize layar saat ujian berlangsung!");
  }
});

document.addEventListener("contextmenu", (e) => {
  if (isExamLocked) e.preventDefault();
});
document.addEventListener("keydown", (e) => {
  if (!isExamLocked) return;
  if (
    e.key === "F12" ||
    (e.ctrlKey && ["t", "n", "w", "u", "c", "v"].includes(e.key.toLowerCase())) ||
    (e.ctrlKey && e.shiftKey && ["i", "j", "c"].includes(e.key.toLowerCase()))
  ) {
    e.preventDefault();
  }
});

function confirmQuitExam() {
  SoundEngine.playClick();
  ignoreNextFullscreenExit = true;

  showCustomModal({
    icon: "⚠️",
    title: "Keluar dari Arena Ujian?",
    message: "Jika kamu keluar sekarang, <b>Soal ini akan langsung dianggap GAGAL (Merah)</b>, skor bagian ini hangus, dan tidak bisa dikerjakan kembali.",
    theme: "danger",
    confirmText: "YA, KELUAR & GAGALKAN",
    cancelText: "BATAL (LANJUT UJIAN)",
    onConfirm: () => {
      ignoreNextFullscreenExit = false;
      handleExamViolationAndFail("Kamu memilih keluar dari arena ujian sebelum menyelesaikannya.");
    },
    onCancel: () => {
      ignoreNextFullscreenExit = false;
      if (isExamLocked && !document.fullscreenElement) {
        requestBrowserFullscreen();
      }
    }
  });
}

// ==========================================
// 9. SISTEM LOGIN, REGISTER & LOGOUT
// ==========================================
function switchAuthMode(mode) {
  SoundEngine.playClick();
  authMode = mode;
  document.getElementById("tab-login").classList.toggle("active", mode === "login");
  document.getElementById("tab-register").classList.toggle("active", mode === "register");
  document.getElementById("register-avatar-field").style.display = mode === "register" ? "flex" : "none";
  document.getElementById("auth-submit-btn").innerHTML =
    mode === "login"
      ? `<span>🚀 MULAI LINTASAN BELAJAR</span><span>→</span>`
      : `<span>✨ DAFTAR MAHASISWA & MULAI</span><span>→</span>`;
  hideAuthError();
}

function selectRegisterAvatar(btn) {
  SoundEngine.playClick();
  document.querySelectorAll(".av-tile").forEach(b => b.classList.remove("selected"));
  btn.classList.add("selected");
  selectedRegisterAvatar = sanitizeAvatar(btn.getAttribute("data-av"));
}

function showAuthError(msg) {
  const el = document.getElementById("auth-error-msg");
  el.textContent = msg;
  el.classList.add("show");
}

function hideAuthError() {
  document.getElementById("auth-error-msg").classList.remove("show");
}

async function handleAuthSubmit() {
  SoundEngine.startBGM();
  SoundEngine.playClick();
  hideAuthError();

  const username = document.getElementById("auth-username").value.trim();
  const pin = document.getElementById("auth-pin").value.trim();

  if (!username || username.length < 3) {
    showAuthError("Username minimal 3 karakter.");
    return;
  }
  if (!pin || pin.length < 4) {
    showAuthError("PIN akses minimal 4 digit/karakter.");
    return;
  }

  const submitBtn = document.getElementById("auth-submit-btn");
  submitBtn.disabled = true;
  submitBtn.innerHTML = `<span>⏳ MENGHUBUNGKAN...</span>`;

  try {
    const { data, error } = await supabaseClient
      .from("quiz_scores")
      .select("*")
      .ilike("player_name", username)
      .order("exp_score", { ascending: false })
      .limit(1);

    if (error) throw error;

    if (authMode === "login") {
      if (!data || data.length === 0) {
        showAuthError("Akun belum terdaftar. Silakan pilih tab 'DAFTAR BARU'.");
        return;
      }
      const userRow = data[0];
      if ((userRow.pin_code || "1234") !== pin) {
        showAuthError("PIN salah! Pastikan memasukkan PIN yang benar.");
        return;
      }

      playerState = {
        isLoggedIn: true,
        name: userRow.player_name,
        pin: userRow.pin_code || pin,
        avatar: sanitizeAvatar(userRow.avatar),
        totalExp: userRow.exp_score || 0,
        coins: 0,
        inventory: { freeze: 0, autosolve: 0, doubleexp: 0, fiftyfifty: 0 },
        completedLevels: Math.min(userRow.highest_level || 0, 5),
        failedLevels: [],
        totalTimeSec: 0,
        totalCorrectAll: 0,
        everRankOne: false,
        dbRowId: userRow.id
      };
      loadLocalPlayerStats();
    } else {
      if (data && data.length > 0) {
        showAuthError("Username sudah dipakai mahasiswa lain! Pilih nama lain atau Masuk.");
        return;
      }

      const cleanAv = sanitizeAvatar(selectedRegisterAvatar);
      const { data: inserted, error: insertErr } = await supabaseClient
        .from("quiz_scores")
        .insert([
          {
            player_name: username,
            pin_code: pin,
            avatar: cleanAv,
            exp_score: 0,
            highest_level: 0,
            correct_answers: 0,
            total_questions: 50
          }
        ])
        .select();

      if (insertErr) throw insertErr;

      playerState = {
        isLoggedIn: true,
        name: username,
        pin: pin,
        avatar: cleanAv,
        totalExp: 0,
        coins: 0,
        inventory: { freeze: 0, autosolve: 0, doubleexp: 0, fiftyfifty: 0 },
        completedLevels: 0,
        failedLevels: [],
        totalTimeSec: 0,
        totalCorrectAll: 0,
        everRankOne: false,
        dbRowId: inserted[0].id
      };
      saveLocalPlayerStats();
    }

    localStorage.setItem("informaquest_session", JSON.stringify({
      name: playerState.name,
      pin: playerState.pin
    }));

    renderLearningMap();
    switchScreen("screen-map");
  } catch (err) {
    showAuthError("Kendala koneksi: " + err.message);
  } finally {
    submitBtn.disabled = false;
    submitBtn.innerHTML =
      authMode === "login"
        ? `<span>🚀 MULAI LINTASAN BELAJAR</span><span>→</span>`
        : `<span>✨ DAFTAR MAHASISWA & MULAI</span><span>→</span>`;
  }
}

function logoutUser() {
  SoundEngine.playClick();
  clearInterval(timerInterval);
  releaseFullscreenLock();
  localStorage.removeItem("informaquest_session");
  playerState = {
    isLoggedIn: false,
    name: "",
    pin: "",
    avatar: "🤖",
    totalExp: 0,
    coins: 0,
    inventory: { freeze: 0, autosolve: 0, doubleexp: 0, fiftyfifty: 0 },
    completedLevels: 0,
    failedLevels: [],
    totalTimeSec: 0,
    totalCorrectAll: 0,
    everRankOne: false,
    dbRowId: null
  };
  document.getElementById("auth-pin").value = "";
  switchScreen("screen-login");
}

async function checkSavedSession() {
  renderReadingDeck();
  const saved = localStorage.getItem("informaquest_session");
  if (!saved) return;

  try {
    const parsed = JSON.parse(saved);
    if (!parsed.name || !parsed.pin) return;

    const { data, error } = await supabaseClient
      .from("quiz_scores")
      .select("*")
      .ilike("player_name", parsed.name)
      .limit(1);

    if (!error && data && data.length > 0 && (data[0].pin_code || "1234") === parsed.pin) {
      const userRow = data[0];
      playerState = {
        isLoggedIn: true,
        name: userRow.player_name,
        pin: parsed.pin,
        avatar: sanitizeAvatar(userRow.avatar),
        totalExp: userRow.exp_score || 0,
        coins: 0,
        inventory: { freeze: 0, autosolve: 0, doubleexp: 0, fiftyfifty: 0 },
        completedLevels: Math.min(userRow.highest_level || 0, 5),
        failedLevels: [],
        totalTimeSec: 0,
        totalCorrectAll: 0,
        everRankOne: false,
        dbRowId: userRow.id
      };
      loadLocalPlayerStats();
      renderLearningMap();
      switchScreen("screen-map");
    }
  } catch (e) {
    console.warn("Session restore dilewati:", e);
  }
}

// ==========================================
// 10. LAYAR PROFIL MAHASISWA
// ==========================================
async function openProfileScreen() {
  if (!playerState.isLoggedIn) return;
  SoundEngine.playClick();

  const av = sanitizeAvatar(playerState.avatar);
  document.getElementById("prof-avatar-big").textContent = av;
  document.getElementById("prof-username").textContent = playerState.name;
  document.getElementById("prof-title-badge").textContent = "🎓 MAHASISWA";
  document.getElementById("prof-total-exp").textContent = `${playerState.totalExp} EXP`;
  document.getElementById("prof-total-coins").textContent = `◈ ${playerState.coins}`;
  document.getElementById("prof-time-spent").textContent = formatDuration(playerState.totalTimeSec);

  try {
    const { data } = await supabaseClient
      .from("quiz_scores")
      .select("player_name, exp_score")
      .order("exp_score", { ascending: false });

    if (data) {
      const idx = data.findIndex(r => r.player_name.toLowerCase() === playerState.name.toLowerCase());
      document.getElementById("prof-global-rank").textContent = idx !== -1 ? `${idx + 1}` : "-";
      if (idx === 0 && playerState.totalExp > 0) {
        playerState.everRankOne = true;
        saveLocalPlayerStats();
      }
    }
  } catch (e) {
    document.getElementById("prof-global-rank").textContent = "-";
  }

  const achList = computeAchievements();
  const unlockedCount = achList.filter(a => a.unlocked).length;
  document.getElementById("prof-ach-counter").textContent = `${unlockedCount} / 5`;

  const achContainer = document.getElementById("prof-achievements-list");
  achContainer.innerHTML = achList
    .map(
      a => `
      <div class="ach-item ${a.unlocked ? "unlocked" : ""}">
        <div class="ach-icon">${a.icon}</div>
        <div class="ach-meta">
          <div class="ach-title">${a.title}</div>
          <div class="ach-desc">${a.desc}</div>
        </div>
        <div class="ach-status">${a.unlocked ? "✓" : "🔒"}</div>
      </div>
    `
    )
    .join("");

  const unlocked = getUnlockedLevel();
  const listEl = document.getElementById("prof-levels-breakdown");
  listEl.innerHTML = "";
  levelsData.forEach(lvl => {
    const isFailed = playerState.failedLevels.includes(lvl.level);
    const done = !isFailed && lvl.level <= playerState.completedLevels;
    const active = !isFailed && !done && lvl.level === unlocked;

    const badgeHtml = isFailed
      ? `<span class="mono" style="color:#dc2626; font-weight:800; font-size:0.75rem;">✕ GAGAL</span>`
      : done
      ? `<span class="mono" style="color:#059669; font-weight:800; font-size:0.75rem;">✓ SELESAI</span>`
      : active
      ? `<span class="mono" style="color:#ea580c; font-weight:800; font-size:0.75rem;">★ AKTIF</span>`
      : `<span class="mono" style="color:#71717a; font-weight:800; font-size:0.75rem;">🔒 TERKUNCI</span>`;

    const row = document.createElement("div");
    row.className = "prof-lvl-row";
    row.innerHTML = `<span><b>${lvl.mapLabel}:</b> ${lvl.title}</span> ${badgeHtml}`;
    listEl.appendChild(row);
  });

  switchScreen("screen-profile");
}

async function updatePlayerAvatar(newAv) {
  SoundEngine.playClick();
  const cleanAv = sanitizeAvatar(newAv);
  playerState.avatar = cleanAv;
  document.getElementById("prof-avatar-big").textContent = cleanAv;
  document.getElementById("map-player-avatar").textContent = cleanAv;
  updateGlobalNavbar();

  if (playerState.dbRowId) {
    await supabaseClient
      .from("quiz_scores")
      .update({ avatar: cleanAv })
      .eq("id", playerState.dbRowId);
  }
}

// ==========================================
// 11. PETA LINTASAN SECTION 1, UNIT 1.1 & SECTION 1, UNIT 1.2 BLUR
// ==========================================
const roadGradientColors = [
  ["#bef264", "#67e8f9"],
  ["#67e8f9", "#60a5fa"],
  ["#60a5fa", "#c084fc"],
  ["#c084fc", "#fb923c"]
];

function buildGradatedBoardRoad(direction, idx, state) {
  const div = document.createElement("div");
  div.className = "board-road-turn";
  const pathD =
    direction === "left-to-right"
      ? "M 48 2 C 48 22, 192 18, 192 38"
      : "M 192 2 C 192 22, 48 18, 48 38";

  const [c1, c2] = roadGradientColors[idx] || ["#bef264", "#fde047"];
  const gradId = `roadGrad_${idx}_${Math.random().toString(36).slice(2, 6)}`;
  const strokeRef =
    state === "failed"
      ? "#f87171"
      : state === "locked"
      ? "#3f3f46"
      : `url(#${gradId})`;

  div.innerHTML = `
    <svg viewBox="0 0 240 40" preserveAspectRatio="none">
      <defs>
        <linearGradient id="${gradId}" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${c1}" />
          <stop offset="100%" stop-color="${c2}" />
        </linearGradient>
      </defs>
      <path class="road-casing" d="${pathD}" />
      <path class="road-surface" stroke="${strokeRef}" d="${pathD}" />
      <path class="road-center-dash" d="${pathD}" />
    </svg>
  `;
  return div;
}

function renderLearningMap() {
  const unlocked = getUnlockedLevel();
  const pct = Math.round((playerState.completedLevels / 5) * 100);
  const allSection1Finished = playerState.completedLevels >= 5;

  document.getElementById("map-player-avatar").textContent = sanitizeAvatar(playerState.avatar);
  document.getElementById("map-player-name").textContent = playerState.name;
  document.getElementById("map-player-rank-title").textContent = "🎓 MAHASISWA";
  document.getElementById("map-total-exp").textContent = playerState.totalExp;
  document.getElementById("map-mini-bar-fill").style.width = `${pct}%`;
  document.getElementById("map-pct-text").textContent = `${pct}%`;
  syncCoinDisplays();

  const container = document.getElementById("duolingo-path");
  container.innerHTML = "";

  // SECTION 1, UNIT 1.1: Soal 1 – Soal 5
  levelsData.forEach((lvl, idx) => {
    const isFailed = playerState.failedLevels.includes(lvl.level);
    const isCompleted = !isFailed && lvl.level <= playerState.completedLevels;
    const isCurrent = !allSection1Finished && !isFailed && !isCompleted && lvl.level === unlocked;
    const laneClass = idx % 2 === 0 ? "left-lane" : "right-lane";

    let statusClass = "locked";
    let statusText = `🔒 ${lvl.mapLabel.toUpperCase()} • TERKUNCI`;
    let nodeSymbol = `${lvl.level}`;
    let tileStyle = "";

    if (isFailed) {
      statusClass = "failed";
      statusText = `✕ ${lvl.mapLabel.toUpperCase()} • GAGAL`;
      nodeSymbol = "✕";
    } else if (isCompleted) {
      statusClass = "completed";
      statusText = `✓ ${lvl.mapLabel.toUpperCase()} • SELESAI`;
      nodeSymbol = "✓";
    } else if (isCurrent) {
      statusClass = "current";
      statusText = `★ ${lvl.mapLabel.toUpperCase()} • AKTIF (KLIK MULAI)`;
      nodeSymbol = `${lvl.level}`;
      tileStyle = `background: ${lvl.gradient};`;
    }

    const stationDiv = document.createElement("div");
    stationDiv.className = `track-station ${laneClass}`;
    stationDiv.innerHTML = `
      <div class="station-medallion ${statusClass}" style="${isCurrent ? `background:${lvl.gradient};` : ""}" onclick="startLevel(${lvl.level})">
        <span>${nodeSymbol}</span>
      </div>
      <div class="station-tile ${statusClass}" style="${tileStyle}" onclick="startLevel(${lvl.level})">
        <div class="st-status">${statusText}</div>
        <div class="st-title">${lvl.mapLabel} — ${lvl.title}</div>
        <div class="st-desc">${lvl.subtitle}</div>
      </div>
    `;
    container.appendChild(stationDiv);

    if (idx < levelsData.length - 1) {
      let roadState = "locked";
      if (isFailed) roadState = "failed";
      else if (isCompleted || isCurrent) roadState = "active";
      const dir = idx % 2 === 0 ? "left-to-right" : "right-to-left";
      container.appendChild(buildGradatedBoardRoad(dir, idx, roadState));
    }
  });

  // SECTION 1, UNIT 1.2 (BLUR & TIDAK BISA DIKLIK + COMING SOON)
  const sec2Wrapper = document.createElement("div");
  sec2Wrapper.className = "section-2-wrapper";

  let blurNodesHtml = "";
  levelsData.slice(0, 2).forEach((lvl, idx) => {
    const laneClass = idx % 2 === 0 ? "left-lane" : "right-lane";
    blurNodesHtml += `
      <div class="track-station ${laneClass}" style="margin-bottom: 10px;">
        <div class="station-medallion locked">
          <span>${lvl.level}</span>
        </div>
        <div class="station-tile locked">
          <div class="st-status">UNIT 1.2 • SOAL ${lvl.level}</div>
          <div class="st-title">${lvl.mapLabel} — ${lvl.title}</div>
        </div>
      </div>
    `;
  });

  sec2Wrapper.innerHTML = `
    <div class="section-2-coming-overlay">
      <div class="sec2-pill">
        <span>📍 SECTION 1, UNIT 1.2</span>
        <strong>🔒 COMING SOON</strong>
      </div>
    </div>
    <div class="section-2-blur-content" aria-hidden="true">
      ${blurNodesHtml}
    </div>
  `;
  container.appendChild(sec2Wrapper);
}

// ==========================================
// 13. LOGIKA MENU SOAL + POWER-UP ITEMS
// ==========================================
function renderQuizPowerupDock() {
  const dock = document.getElementById("quiz-powerup-dock");
  if (!dock) return;

  dock.innerHTML = SHOP_CATALOG.map(item => {
    const qty = playerState.inventory[item.id] || 0;
    const isDisabled = answered || qty <= 0 || (item.id === "doubleexp" && doubleExpActive);
    return `
      <button class="pu-use-btn" ${isDisabled ? "disabled" : ""} onclick="useQuizPowerup('${item.id}')">
        <span>${item.badge} ${item.name}</span>
        <span class="pu-count">${qty}</span>
      </button>
    `;
  }).join("");
}

function useQuizPowerup(itemId) {
  if (answered || !currentLevelObj) return;
  const qty = playerState.inventory[itemId] || 0;
  if (qty <= 0) return;

  SoundEngine.playLevelClear();
  playerState.inventory[itemId] = qty - 1;
  saveLocalPlayerStats();

  const q = currentLevelObj.questions[currentQuestionIdx];
  const buttons = document.querySelectorAll(".option-btn");

  if (itemId === "freeze") {
    freezeSecondsRemaining = 15;
    document.getElementById("timer-pill").classList.add("frozen");
  } else if (itemId === "doubleexp") {
    doubleExpActive = true;
  } else if (itemId === "fiftyfifty") {
    let removed = 0;
    buttons.forEach((btn, idx) => {
      if (idx !== q.correct && removed < 2 && !btn.classList.contains("eliminated")) {
        btn.classList.add("eliminated");
        removed++;
      }
    });
  } else if (itemId === "autosolve") {
    renderQuizPowerupDock();
    selectAnswer(q.correct);
    return;
  }

  renderQuizPowerupDock();
}

function startLevel(levelNum) {
  const isFailed = playerState.failedLevels.includes(levelNum);
  const isCompleted = !isFailed && levelNum <= playerState.completedLevels;
  const unlocked = getUnlockedLevel();

  if (isFailed) {
    SoundEngine.playWrong();
    showCustomModal({
      icon: "✕",
      title: `Soal ${levelNum} Didiskualifikasi`,
      message: `Soal ${levelNum} telah ditandai gagal (merah) dan tidak dapat dikerjakan ulang.`,
      theme: "danger"
    });
    return;
  }

  if (isCompleted) {
    SoundEngine.playWrong();
    showCustomModal({
      icon: "✓",
      title: `Soal ${levelNum} Sudah Selesai`,
      message: `Kamu sudah menyelesaikan Soal ${levelNum}. Setiap bagian hanya dapat dikerjakan satu kali.`,
      theme: "default"
    });
    return;
  }

  if (levelNum > unlocked) {
    SoundEngine.playWrong();
    showCustomModal({
      icon: "🔒",
      title: `Soal ${levelNum} Masih Terkunci`,
      message: `Selesaikan <b>Soal ${unlocked}</b> terlebih dahulu untuk membuka bagian ini.`,
      theme: "default"
    });
    return;
  }

  SoundEngine.startBGM();
  SoundEngine.playClick();

  currentLevelObj = levelsData.find(l => l.level === levelNum);
  currentQuestionIdx = 0;
  sessionExp = 0;
  sessionCoins = 0;
  sessionCorrect = 0;
  freezeSecondsRemaining = 0;
  doubleExpActive = false;
  levelStartTimestamp = Date.now();

  document.getElementById("session-exp-display").textContent = "0";

  enforceFullscreenLock();
  switchScreen("screen-quiz");

  setTimeout(() => {
    initThreeJS();
    loadQuestion();
  }, 60);
}

function loadQuestion() {
  answered = false;
  freezeSecondsRemaining = 0;
  const q = currentLevelObj.questions[currentQuestionIdx];
  const totalQ = currentLevelObj.questions.length;

  const progressPct = (currentQuestionIdx / totalQ) * 100;
  document.getElementById("progress-fill").style.width = `${progressPct}%`;

  Object.keys(singleObjectsMap).forEach(key => {
    singleObjectsMap[key].visible = key === q.partId;
  });
  activePartMesh = singleObjectsMap[q.partId] || null;
  if (activePartMesh) {
    activePartMesh.rotation.set(0.15, -0.35, 0);
  }
  SoundEngine.playWhoosh();

  document.getElementById("question-meta").textContent = `SOAL ${currentQuestionIdx + 1}`;
  document.getElementById("question-text").textContent = q.question;

  const optionsList = document.getElementById("options-list");
  optionsList.innerHTML = "";
  const letters = ["A", "B", "C", "D"];

  q.options.forEach((opt, idx) => {
    const btn = document.createElement("button");
    btn.className = "option-btn";
    btn.innerHTML = `<span class="option-key">${letters[idx]}</span> <span>${opt}</span>`;
    btn.onclick = () => selectAnswer(idx);
    optionsList.appendChild(btn);
  });

  const banner = document.getElementById("feedback-banner");
  banner.classList.remove("show", "is-correct", "is-wrong");

  renderQuizPowerupDock();
  startTimer();
}

function startTimer() {
  clearInterval(timerInterval);
  timeLeft = 30;
  const timerEl = document.getElementById("timer-display");
  const pillEl = document.getElementById("timer-pill");
  timerEl.textContent = timeLeft;
  pillEl.classList.remove("urgent", "frozen");

  timerInterval = setInterval(() => {
    if (freezeSecondsRemaining > 0) {
      freezeSecondsRemaining--;
      timerEl.textContent = `${timeLeft} [FREEZE]`;
      if (freezeSecondsRemaining === 0) {
        pillEl.classList.remove("frozen");
      }
      return;
    }

    timeLeft--;
    if (timeLeft > 0) {
      timerEl.textContent = timeLeft;
      if (timeLeft <= 7) {
        pillEl.classList.add("urgent");
      }
    } else {
      timerEl.textContent = "0";
      clearInterval(timerInterval);
      if (!answered) {
        handleTimeOut();
      }
    }
  }, 1000);
}

function handleTimeOut() {
  answered = true;
  doubleExpActive = false;
  renderQuizPowerupDock();
  SoundEngine.playWrong();
  const q = currentLevelObj.questions[currentQuestionIdx];
  const buttons = document.querySelectorAll(".option-btn");
  buttons.forEach(b => (b.disabled = true));
  buttons[q.correct].classList.add("correct");

  const banner = document.getElementById("feedback-banner");
  banner.classList.add("show", "is-wrong");
  document.getElementById("feedback-title").textContent = "⏰ WAKTU 30 DETIK HABIS! (+0 EXP)";
  document.getElementById("feedback-desc").textContent = q.explanation;
  document.getElementById("next-btn").textContent =
    currentQuestionIdx === currentLevelObj.questions.length - 1
      ? "SELESAIKAN"
      : "SOAL BERIKUTNYA →";
}

function selectAnswer(selectedIdx) {
  if (answered) return;
  answered = true;
  clearInterval(timerInterval);
  document.getElementById("timer-pill").classList.remove("urgent", "frozen");

  const q = currentLevelObj.questions[currentQuestionIdx];
  const buttons = document.querySelectorAll(".option-btn");
  buttons.forEach(b => (b.disabled = true));

  const banner = document.getElementById("feedback-banner");
  const fbTitle = document.getElementById("feedback-title");
  const fbDesc = document.getElementById("feedback-desc");

  if (selectedIdx === q.correct) {
    SoundEngine.playCorrect();
    buttons[selectedIdx].classList.add("correct");
    sessionCorrect++;
    const speedBonus = Math.max(0, timeLeft) * 2;
    const multiplier = doubleExpActive ? 2 : 1;
    const earnedExp = (100 + speedBonus) * multiplier;
    const earnedCoins = 25 + Math.floor(timeLeft / 3);

    sessionExp += earnedExp;
    sessionCoins += earnedCoins;
    playerState.coins += earnedCoins;
    doubleExpActive = false;

    document.getElementById("session-exp-display").textContent = sessionExp;
    syncCoinDisplays();

    banner.classList.add("show", "is-correct");
    fbTitle.textContent = `✓ TEPAT! +${earnedExp} EXP & +◈ ${earnedCoins}`;
  } else {
    doubleExpActive = false;
    SoundEngine.playWrong();
    buttons[selectedIdx].classList.add("wrong");
    buttons[q.correct].classList.add("correct");
    banner.classList.add("show", "is-wrong");
    fbTitle.textContent = "✕ KURANG TEPAT — CEK PEMBAHASAN:";
  }

  renderQuizPowerupDock();
  fbDesc.textContent = q.explanation;
  document.getElementById("next-btn").textContent =
    currentQuestionIdx === currentLevelObj.questions.length - 1
      ? "SELESAIKAN"
      : "SOAL BERIKUTNYA →";
}

function nextQuestion() {
  SoundEngine.playClick();
  currentQuestionIdx++;
  if (currentQuestionIdx < currentLevelObj.questions.length) {
    loadQuestion();
  } else {
    document.getElementById("progress-fill").style.width = "100%";
    completeCurrentLevel();
  }
}

async function completeCurrentLevel() {
  SoundEngine.playLevelClear();
  releaseFullscreenLock();

  const levelDurationSec = Math.max(1, Math.round((Date.now() - levelStartTimestamp) / 1000));
  playerState.totalTimeSec += levelDurationSec;
  playerState.totalCorrectAll += sessionCorrect;
  playerState.totalExp += sessionExp;

  if (currentLevelObj.level > playerState.completedLevels) {
    playerState.completedLevels = currentLevelObj.level;
  }

  try {
    if (playerState.dbRowId) {
      await supabaseClient
        .from("quiz_scores")
        .update({
          exp_score: playerState.totalExp,
          highest_level: playerState.completedLevels,
          correct_answers: playerState.totalCorrectAll
        })
        .eq("id", playerState.dbRowId);
    }

    const { data: topRows } = await supabaseClient
      .from("quiz_scores")
      .select("player_name, exp_score")
      .order("exp_score", { ascending: false })
      .limit(1);

    if (
      topRows &&
      topRows.length > 0 &&
      topRows[0].player_name.toLowerCase() === playerState.name.toLowerCase() &&
      playerState.totalExp > 0
    ) {
      playerState.everRankOne = true;
    }
  } catch (err) {
    console.error("Gagal sinkronisasi akumulasi EXP:", err);
  }

  saveLocalPlayerStats();

  document.getElementById("clear-badge").textContent = `✓ ${currentLevelObj.mapLabel.toUpperCase()} TUNTAS`;
  document.getElementById("clear-title").textContent =
    playerState.completedLevels < 5
      ? `Soal ${playerState.completedLevels + 1} Sekarang Terbuka!`
      : "Section 1, Unit 1 Selesai!";
  document.getElementById("clear-session-exp").textContent = `+${sessionExp} EXP`;
  document.getElementById("clear-session-coins").textContent = `+◈ ${sessionCoins}`;
  document.getElementById("clear-total-exp").textContent = `${playerState.totalExp} EXP`;
  document.getElementById("clear-time-taken").textContent = formatDuration(levelDurationSec);

  switchScreen("screen-stage-clear");
}

function backToMap() {
  clearInterval(timerInterval);
  releaseFullscreenLock();
  renderLearningMap();
  switchScreen("screen-map");
}

// ==========================================
// 14. MENU PODIUM & PAPAN PERINGKAT
// ==========================================
async function openLeaderboardScreen() {
  SoundEngine.playClick();
  const activeScreen = document.querySelector(".screen.active");
  if (activeScreen && activeScreen.id !== "screen-leaderboard") {
    previousScreenBeforeLb = activeScreen.id;
  }
  switchScreen("screen-leaderboard");
  await loadLeaderboard();
}

function returnFromLeaderboard() {
  SoundEngine.playClick();
  if (playerState.isLoggedIn) {
    renderLearningMap();
    switchScreen("screen-map");
  } else {
    switchScreen(previousScreenBeforeLb || "screen-login");
  }
}

async function loadLeaderboard() {
  const tbody = document.getElementById("leaderboard-body");
  const statusEl = document.getElementById("leaderboard-status");
  const tableEl = document.getElementById("lb-table");
  tbody.innerHTML = "";

  try {
    const { data, error } = await supabaseClient
      .from("quiz_scores")
      .select("*")
      .order("exp_score", { ascending: false })
      .limit(25);

    if (error) throw error;

    [1, 2, 3].forEach(pos => {
      document.getElementById(`p${pos}-avatar`).textContent = "-";
      document.getElementById(`p${pos}-name`).textContent = "Belum Terisi";
      document.getElementById(`p${pos}-exp`).textContent = "0 EXP";
      document.getElementById(`p${pos}-sub`).textContent = "Mahasiswa";
    });

    if (!data || data.length === 0) {
      statusEl.textContent = "Belum ada mahasiswa tercatat.";
      tableEl.style.display = "none";
      return;
    }

    for (let i = 0; i < Math.min(3, data.length); i++) {
      const pos = i + 1;
      const row = data[i];
      const isMe = playerState.isLoggedIn && row.player_name.toLowerCase() === playerState.name.toLowerCase();

      if (pos === 1 && isMe && row.exp_score > 0) {
        playerState.everRankOne = true;
        saveLocalPlayerStats();
      }

      document.getElementById(`p${pos}-avatar`).textContent = sanitizeAvatar(row.avatar);
      document.getElementById(`p${pos}-name`).textContent = row.player_name + (isMe ? " (Kamu)" : "");
      document.getElementById(`p${pos}-exp`).textContent = `${row.exp_score} EXP`;
      document.getElementById(`p${pos}-sub`).textContent = "Mahasiswa";
    }

    const restPlayers = data.slice(3);
    if (restPlayers.length === 0) {
      statusEl.textContent = "Baru ada 3 mahasiswa teratas di podium.";
      tableEl.style.display = "none";
    } else {
      tableEl.style.display = "table";
      statusEl.textContent = `Peringkat 4 – ${data.length}`;

      restPlayers.forEach((row, idx) => {
        const rank = idx + 4;
        const isMe = playerState.isLoggedIn && row.player_name.toLowerCase() === playerState.name.toLowerCase();
        const av = sanitizeAvatar(row.avatar);

        const tr = document.createElement("tr");
        if (isMe) tr.className = "me";
        tr.innerHTML = `
          <td><span class="rank-badge">${rank}</span></td>
          <td><span class="mini-av-badge">${av}</span> ${escapeHtml(row.player_name)} ${isMe ? "(Kamu)" : ""}</td>
          <td>Mahasiswa</td>
          <td class="mono" style="font-weight: 800;">${row.exp_score} EXP</td>
        `;
        tbody.appendChild(tr);
      });
    }
  } catch (err) {
    console.error("Supabase Select Error:", err);
    statusEl.textContent = "Error: " + err.message;
  }
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

window.addEventListener("DOMContentLoaded", checkSavedSession);