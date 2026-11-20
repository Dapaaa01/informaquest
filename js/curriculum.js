// ==========================================
// 5. DEK BACAAN BERTINGKAT (SECTION 1: 1.1-1.5 & SECTION 2: 2.1-2.5)
// ==========================================
const readingCurriculum = {
  1: [
    {
      unit: "1.1",
      kicker: "SECTION 1 // UNIT 1.1",
      title: "Fondasi Informatika",
      available: true,
      intro: "Rangkuman lengkap seluruh materi Unit 1.1 yang menjadi acuan langsung pada 5 paket soal 3D:",
      topics: [
        {
          heading: "1. Arsitektur Perangkat Keras Komputer",
          points: [
            "<strong>CPU & Motherboard:</strong> CPU mengeksekusi operasi aritmatika dan logika (ALU & Control Unit), sedangkan Motherboard menghubungkan seluruh jalur bus antar komponen.",
            "<strong>RAM DDR5 & SSD NVMe:</strong> RAM bersifat <em>volatile</em> untuk data aplikasi aktif; SSD berbasis chip flash NAND menyimpan data permanen (<em>non-volatile</em>).",
            "<strong>GPU, PSU, Pendingin & Casing:</strong> GPU pada slot PCIe x16 merender grafis 3D; PSU mengubah arus AC ke DC; kipas/heatsink mencegah <em>overheating</em>; baterai CMOS menjaga konfigurasi UEFI/BIOS; dan Front I/O menyediakan tombol daya serta port USB/audio."
          ]
        },
        {
          heading: "2. Perangkat Lunak & Sistem Operasi",
          points: [
            "<strong>Kernel, Device Driver & UEFI/BIOS:</strong> Kernel menjadi inti penghubung software dan hardware; Driver menerjemahkan kendali perangkat; UEFI/BIOS melakukan uji awal POST saat booting.",
            "<strong>Compiler, Virtual Memory & File System:</strong> Compiler menerjemahkan kode sumber menjadi kode mesin biner; Paging membagi memori virtual; File System (NTFS/ext4) menyusun hierarki folder dan berkas.",
            "<strong>GUI, CLI, Virtual Machine & CPU Scheduler:</strong> GUI memakai antarmuka grafis, CLI memakai perintah teks, Hypervisor menjalankan OS virtual, dan Scheduler mengatur giliran multitasking."
          ]
        },
        {
          heading: "3. Jaringan Komputer & Infrastruktur Internet",
          points: [
            "<strong>Router, Switch & Access Point:</strong> Router merutekan paket antar jaringan berdasarkan IP; Switch meneruskan frame LAN via MAC Address; Access Point memancarkan Wi-Fi.",
            "<strong>Kabel UTP (RJ45) & Fiber Optik:</strong> UTP menggunakan konektor 8-pin RJ45, sedangkan Fiber Optik mentransmisikan pulsa cahaya berkecepatan tinggi.",
            "<strong>Server, Modem ONT, Firewall, Paket TCP/IP & DNS:</strong> Server melayani klien; Modem/ONT terhubung ke ISP; Firewall menyaring lalu lintas; paket data dikirim via TCP/IP; dan DNS menerjemahkan domain menjadi alamat IP."
          ]
        },
        {
          heading: "4. Algoritma & Struktur Data",
          points: [
            "<strong>Flowchart, Looping & Gerbang Logika:</strong> Belah ketupat (<em>Decision</em>) mewakili percabangan kondisi; Looping mengulang instruksi; gerbang AND menghasilkan 1 hanya jika semua input 1.",
            "<strong>Array, Stack (LIFO) & Queue (FIFO):</strong> Array menyimpan data berindeks dari 0; Stack bekerja secara LIFO; Queue bekerja secara FIFO.",
            "<strong>Binary Tree, Graph, Sorting & Hash Table:</strong> Binary Tree memiliki maksimal 2 anak per simpul; Graph memodelkan simpul-sisi jaringan; Sorting mengurutkan data; Hash Table memetakan kunci ke nilai dalam waktu O(1)."
          ]
        },
        {
          heading: "5. Keamanan Siber, Kecerdasan Buatan & IoT",
          points: [
            "<strong>Enkripsi, 2FA, Biometrik & Anti-Phishing:</strong> Enkripsi mengubah plaintext menjadi ciphertext; 2FA menambah verifikasi OTP; Biometrik memindai sidik jari/wajah; Anti-Phishing mencegah pencurian kredensial tautan palsu.",
            "<strong>Mikrokontroler, Sensor, Aktuator & IoT Gateway:</strong> Mikrokontroler (ESP32/Arduino) membaca sinyal lingkungan dari Sensor, menggerakkan Aktuator fisik, dan terhubung ke cloud melalui IoT Gateway.",
            "<strong>Artificial Neural Network & Basis Data:</strong> Neural Network meniru neuron otak untuk pengenalan pola AI, sementara DBMS mengelola basis data relasional terstruktur."
          ]
        }
      ],
      reference:
        "Tanenbaum & Austin (2013) Structured Computer Organization; Silberschatz et al. (2018) Operating System Concepts; Kurose & Ross (2021) Computer Networking; Cormen et al. (2022) Introduction to Algorithms; Stallings (2020) Cryptography and Network Security; Russell & Norvig (2020) Artificial Intelligence."
    },
    {
      unit: "1.2",
      kicker: "SECTION 1 // UNIT 1.2",
      title: "Sistem Bilangan & Logika Digital",
      available: false,
      message: "Modul bacaan untuk Section 1, Unit 1.2 sedang dalam tahap penyusunan dan akan segera hadir.",
      reference: "Kurikulum InformaQuest — Pembaruan Section 1, Unit 1.2 (Coming Soon)."
    },
    {
      unit: "1.3",
      kicker: "SECTION 1 // UNIT 1.3",
      title: "Pemrograman Terstruktur",
      available: false,
      message: "Modul bacaan untuk Section 1, Unit 1.3 sedang dalam tahap penyusunan dan akan segera hadir.",
      reference: "Kurikulum InformaQuest — Pembaruan Section 1, Unit 1.3 (Coming Soon)."
    },
    {
      unit: "1.4",
      kicker: "SECTION 1 // UNIT 1.4",
      title: "Manajemen Basis Data",
      available: false,
      message: "Modul bacaan untuk Section 1, Unit 1.4 sedang dalam tahap penyusunan dan akan segera hadir.",
      reference: "Kurikulum InformaQuest — Pembaruan Section 1, Unit 1.4 (Coming Soon)."
    },
    {
      unit: "1.5",
      kicker: "SECTION 1 // UNIT 1.5",
      title: "Etika Digital & Komputasi Cloud",
      available: false,
      message: "Modul bacaan untuk Section 1, Unit 1.5 sedang dalam tahap penyusunan dan akan segera hadir.",
      reference: "Kurikulum InformaQuest — Pembaruan Section 1, Unit 1.5 (Coming Soon)."
    }
  ],
  2: [
    {
      unit: "2.1",
      kicker: "SECTION 2 // UNIT 2.1",
      title: "Arsitektur Mikroprosesor Lanjut",
      available: false,
      message: "Materi bacaan untuk Section 2, Unit 2.1 akan segera dibuka setelah pembaruan kurikulum berikutnya.",
      reference: "Kurikulum InformaQuest — Pembaruan Section 2, Unit 2.1 (Coming Soon)."
    },
    {
      unit: "2.2",
      kicker: "SECTION 2 // UNIT 2.2",
      title: "Protokol Routing & Keamanan Jaringan",
      available: false,
      message: "Materi bacaan untuk Section 2, Unit 2.2 akan segera dibuka setelah pembaruan kurikulum berikutnya.",
      reference: "Kurikulum InformaQuest — Pembaruan Section 2, Unit 2.2 (Coming Soon)."
    },
    {
      unit: "2.3",
      kicker: "SECTION 2 // UNIT 2.3",
      title: "Kompleksitas Algoritma & Graf",
      available: false,
      message: "Materi bacaan untuk Section 2, Unit 2.3 akan segera dibuka setelah pembaruan kurikulum berikutnya.",
      reference: "Kurikulum InformaQuest — Pembaruan Section 2, Unit 2.3 (Coming Soon)."
    },
    {
      unit: "2.4",
      kicker: "SECTION 2 // UNIT 2.4",
      title: "Pembelajaran Mesin & Visi Komputer",
      available: false,
      message: "Materi bacaan untuk Section 2, Unit 2.4 akan segera dibuka setelah pembaruan kurikulum berikutnya.",
      reference: "Kurikulum InformaQuest — Pembaruan Section 2, Unit 2.4 (Coming Soon)."
    },
    {
      unit: "2.5",
      kicker: "SECTION 2 // UNIT 2.5",
      title: "Sistem Terdistribusi & Edge IoT",
      available: false,
      message: "Materi bacaan untuk Section 2, Unit 2.5 akan segera dibuka setelah pembaruan kurikulum berikutnya.",
      reference: "Kurikulum InformaQuest — Pembaruan Section 2, Unit 2.5 (Coming Soon)."
    }
  ]
};

let activeReadingSection = 1;
let activeReadingUnitIdx = 0;

function renderReadingDeck() {
  const units = readingCurriculum[activeReadingSection];
  const currentUnit = units[activeReadingUnitIdx];

  // Update Section Tabs
  document.querySelectorAll("#reading-section-tabs .d-pill").forEach((btn, idx) => {
    btn.classList.toggle("active", idx + 1 === activeReadingSection);
  });

  // Render Unit Sub-Tabs (1.1 - 1.5 atau 2.1 - 2.5)
  const unitBar = document.getElementById("reading-unit-tabs");
  unitBar.innerHTML = units
    .map(
      (u, idx) => `
      <button class="unit-pill-btn ${idx === activeReadingUnitIdx ? "active" : ""}" onclick="selectReadingUnit(${idx})">
        ${u.available ? "📖" : "🔒"} ${u.unit}
      </button>
    `
    )
    .join("");

  document.getElementById("reading-counter").textContent = `UNIT ${currentUnit.unit}`;
  document.getElementById("reading-kicker").textContent = currentUnit.kicker;
  document.getElementById("reading-title").textContent = currentUnit.title;
  document.getElementById("reading-reference").textContent = currentUnit.reference;

  const contentEl = document.getElementById("reading-content");
  if (currentUnit.available) {
    contentEl.className = "deck-scroll-area";
    contentEl.innerHTML = `
      <p class="rd-intro">${currentUnit.intro}</p>
      ${currentUnit.topics
        .map(
          t => `
          <div class="rd-topic-block">
            <div class="rd-topic-head">${t.heading}</div>
            <ul class="rd-point-list">
              ${t.points.map(pt => `<li>${pt}</li>`).join("")}
            </ul>
          </div>
        `
        )
        .join("")}
    `;
  } else {
    contentEl.className = "deck-coming-soon-box";
    contentEl.innerHTML = `
      <span class="sticker-tag bg-yellow" style="margin-bottom:4px;">🔒 UNIT ${currentUnit.unit}</span>
      <h3 style="font-family:'Outfit',sans-serif; font-size:1.3rem; font-weight:900;">COMING SOON</h3>
      <p style="font-size:0.82rem; max-width:330px; line-height:1.45;">${currentUnit.message}</p>
    `;
  }
}

function selectReadingSection(secNum) {
  SoundEngine.playClick();
  activeReadingSection = secNum;
  activeReadingUnitIdx = 0;
  renderReadingDeck();
}

function switchReadingSection(dir) {
  SoundEngine.playClick();
  activeReadingSection = activeReadingSection === 1 ? 2 : 1;
  activeReadingUnitIdx = 0;
  renderReadingDeck();
}

function selectReadingUnit(unitIdx) {
  SoundEngine.playClick();
  activeReadingUnitIdx = unitIdx;
  renderReadingDeck();
}

// ==========================================
// 6. KURIKULUM SECTION 1, UNIT 1 (SOAL 1 – SOAL 5)
// ==========================================
const levelsData = [
  {
    level: 1,
    mapLabel: "Soal 1",
    title: "Arsitektur Perangkat Keras",
    subtitle: "Komponen inti komputer: CPU, RAM, GPU, Motherboard & PSU",
    gradient: "linear-gradient(135deg, #bef264 0%, #67e8f9 100%)",
    questions: [
      {
        partId: "l1-cpu",
        question: "Komponen utama yang berfungsi sebagai otak pemrosesan instruksi aritmatika dan logika pada komputer disebut...",
        options: ["CPU (Central Processing Unit)", "RAM DDR5", "Power Supply", "Hard Disk"],
        correct: 0,
        explanation: "CPU mengeksekusi perintah program melalui unit ALU dan Control Unit."
      },
      {
        partId: "l1-ram",
        question: "Memori berkecepatan tinggi yang bersifat volatile (data hilang saat daya mati) untuk menampung aplikasi yang sedang berjalan adalah...",
        options: ["SSD NVMe", "RAM (Random Access Memory)", "ROM BIOS", "Cache Disk"],
        correct: 1,
        explanation: "RAM menyimpan data sementara agar dapat diakses sangat cepat oleh CPU."
      },
      {
        partId: "l1-gpu",
        question: "Perangkat keras ekspansi pada slot PCIe x16 yang bertugas merender grafis 3D dan pemrosesan paralel ke monitor adalah...",
        options: ["Sound Card", "GPU (Graphics Processing Unit)", "NIC Ethernet", "VRM Heatsink"],
        correct: 1,
        explanation: "GPU memiliki ribuan core paralel untuk mengolah tampilan visual dan komputasi grafis."
      },
      {
        partId: "l1-mobo",
        question: "Papan sirkuit utama tempat terpasangnya CPU, RAM, chipset, serta jalur komunikasi bus antar komponen adalah...",
        options: ["Motherboard", "Backplate", "Power Inverter", "Breadboard"],
        correct: 0,
        explanation: "Motherboard menghubungkan seluruh komponen perangkat keras dalam satu sistem terpadu."
      },
      {
        partId: "l1-ssd",
        question: "Media penyimpanan non-volatile berbasis chip flash memory tanpa piringan mekanis yang terpasang pada slot M.2 adalah...",
        options: ["Floppy Disk", "SSD (Solid State Drive)", "RAM DDR4", "Register CPU"],
        correct: 1,
        explanation: "SSD menyimpan sistem operasi dan file secara permanen dengan kecepatan baca/tulis tinggi."
      },
      {
        partId: "l1-psu",
        question: "Komponen yang mengubah arus listrik AC dari stopkontak menjadi arus searah (DC) bertegangan stabil untuk PC adalah...",
        options: ["Stabilizer", "Power Supply Unit (PSU)", "UPS", "Kapasitor"],
        correct: 1,
        explanation: "PSU menyuplai daya listrik (+12V, +5V, +3.3V) ke seluruh komponen komputer."
      },
      {
        partId: "l1-fan",
        question: "Apa tujuan utama pemasangan sistem pendingin aktif (kipas & heatsink) pada komponen komputer?",
        options: ["Menambah kapasitas RAM", "Membuang panas berlebih agar tidak terjadi overheating", "Mempercepat koneksi Wi-Fi", "Menyimpan konfigurasi BIOS"],
        correct: 1,
        explanation: "Pendinginan mencegah thermal throttling yang menurunkan kecepatan prosesor."
      },
      {
        partId: "l1-casing",
        question: "Struktur pelindung luar yang menjaga komponen internal dari debu, benturan, dan mengatur jalur airflow disebut...",
        options: ["Casing (Chassis)", "Heatpipe", "Chipset", "Socket LGA"],
        correct: 0,
        explanation: "Casing melindungi perangkat keras dan menyediakan dudukan bagi kipas serta motherboard."
      },
      {
        partId: "l1-cmos",
        question: "Baterai koin kecil pada motherboard yang menjaga pengaturan waktu sistem dan konfigurasi BIOS tetap tersimpan saat PC mati adalah...",
        options: ["Baterai Li-Po", "Baterai CMOS", "Kapasitor Solid", "Induktor VRM"],
        correct: 1,
        explanation: "Baterai CMOS memberi daya kecil pada chip memori konfigurasi BIOS/UEFI."
      },
      {
        partId: "l1-frontio",
        question: "Panel antarmuka di bagian depan/atas casing yang berisi tombol daya, port USB, dan jack audio disebut...",
        options: ["Panel Front I/O", "Rear I/O Shield", "PCIe Lane", "SATA Header"],
        correct: 0,
        explanation: "Panel Front I/O terhubung ke pin header motherboard untuk akses cepat pengguna."
      }
    ]
  },

  {
    level: 2,
    mapLabel: "Soal 2",
    title: "Perangkat Lunak & Sistem Operasi",
    subtitle: "Konsep software: Kernel OS, Compiler, Virtual Memory & File System",
    gradient: "linear-gradient(135deg, #67e8f9 0%, #60a5fa 100%)",
    questions: [
      {
        partId: "l2-kernel",
        question: "Bagian paling inti dari sistem operasi yang menjembatani komunikasi antara aplikasi perangkat lunak dan perangkat keras adalah...",
        options: ["Kernel", "Wallpaper", "Web Browser", "Text Editor"],
        correct: 0,
        explanation: "Kernel mengatur akses CPU, memori, dan perangkat I/O secara aman dan terstruktur."
      },
      {
        partId: "l2-compiler",
        question: "Program sistem yang menerjemahkan seluruh kode sumber (source code) bahasa pemrograman tingkat tinggi menjadi kode mesin biner adalah...",
        options: ["Compiler", "Spreadsheet", "Media Player", "Antivirus"],
        correct: 0,
        explanation: "Compiler mengonversi kode manusia (seperti C++/Java) menjadi instruksi mesin yang dipahami CPU."
      },
      {
        partId: "l2-vmem",
        question: "Teknik manajemen memori oleh sistem operasi yang membagi program menjadi halaman-halaman (pages) agar efisien di RAM disebut...",
        options: ["Defragmentasi", "Paging / Virtual Memory", "Overclocking", "Rendering"],
        correct: 1,
        explanation: "Paging memungkinkan sistem menjalankan aplikasi besar meskipun kapasitas RAM fisik terbatas."
      },
      {
        partId: "l2-fs",
        question: "Sistem pengorganisasian berkas dan folder pada media penyimpanan (seperti NTFS, ext4, atau APFS) disebut...",
        options: ["File System", "Task Manager", "Device Driver", "Firewall"],
        correct: 0,
        explanation: "File system mengatur cara data disimpan, dinamai, dan ditemukan kembali pada SSD/HDD."
      },
      {
        partId: "l2-driver",
        question: "Perangkat lunak khusus yang memungkinkan sistem operasi mengenali dan mengendalikan perangkat keras tertentu (seperti GPU atau printer) adalah...",
        options: ["Device Driver", "Office Suite", "Cloud Storage", "Cache Browser"],
        correct: 0,
        explanation: "Tanpa driver yang tepat, sistem operasi tidak dapat memanfaatkan fitur perangkat keras secara optimal."
      },
      {
        partId: "l2-gui",
        question: "Antarmuka berbasis jendela, ikon, dan menu visual yang memudahkan pengguna berinteraksi dengan komputer disebut...",
        options: ["GUI (Graphical User Interface)", "BIOS ROM", "Assembly Code", "MAC Address"],
        correct: 0,
        explanation: "GUI menggantikan perintah teks murni dengan elemen grafis yang intuitif."
      },
      {
        partId: "l2-cli",
        question: "Antarmuka berbasis teks (seperti Bash atau PowerShell) tempat pengguna mengetikkan perintah langsung ke shell sistem adalah...",
        options: ["CLI (Command Line Interface)", "GPU Shader", "HDMI Output", "BIOS Battery"],
        correct: 0,
        explanation: "CLI sangat efisien untuk otomasi skrip, administrasi server, dan pengembangan perangkat lunak."
      },
      {
        partId: "l2-vm",
        question: "Teknologi perangkat lunak yang memungkinkan satu komputer fisik menjalankan beberapa sistem operasi berbeda secara bersamaan adalah...",
        options: ["Virtual Machine (Virtualisasi)", "Disk Cleanup", "Screen Saver", "Bluetooth Pairing"],
        correct: 0,
        explanation: "Hypervisor membagi sumber daya CPU dan RAM fisik ke beberapa mesin virtual terisolasi."
      },
      {
        partId: "l2-scheduler",
        question: "Komponen sistem operasi yang mengatur giliran eksekusi berbagai proses/aplikasi agar multitasking berjalan lancar adalah...",
        options: ["Process / CPU Scheduler", "Sound Mixer", "Print Spooler", "Font Manager"],
        correct: 0,
        explanation: "Scheduler menentukan proses mana yang mendapat waktu eksekusi CPU berikutnya."
      },
      {
        partId: "l2-uefi",
        question: "Firmware pertama yang berjalan saat komputer dinyalakan untuk menguji perangkat keras (POST) sebelum memuat sistem operasi adalah...",
        options: ["UEFI / BIOS", "Web Server", "Database Engine", "Video Codec"],
        correct: 0,
        explanation: "UEFI melakukan inisialisasi perangkat keras dan menyerahkan kendali ke bootloader OS."
      }
    ]
  },

  {
    level: 3,
    mapLabel: "Soal 3",
    title: "Jaringan Komputer & Internet",
    subtitle: "Infrastruktur konektivitas: Router, Switch, Fiber Optik & Server",
    gradient: "linear-gradient(135deg, #60a5fa 0%, #c084fc 100%)",
    questions: [
      {
        partId: "l3-router",
        question: "Perangkat jaringan yang menentukan rute terbaik pengiriman paket data antar jaringan berbeda (LAN ke Internet) berdasarkan alamat IP adalah...",
        options: ["Router", "Repeater", "Kabel Coaxial", "Hub Pasif"],
        correct: 0,
        explanation: "Router bekerja pada Network Layer (Layer 3) untuk mengarahkan lalu lintas paket IP."
      },
      {
        partId: "l3-switch",
        question: "Perangkat yang menghubungkan banyak komputer dalam satu jaringan lokal (LAN) dan meneruskan frame berdasarkan MAC Address adalah...",
        options: ["Network Switch", "Modem Analog", "VGA Splitter", "Power Bank"],
        correct: 0,
        explanation: "Switch mengirim data secara spesifik ke port tujuan sehingga mengurangi tabrakan data."
      },
      {
        partId: "l3-rj45",
        question: "Konektor standar 8-pin yang dipasang pada ujung kabel tembaga twisted-pair (UTP) untuk jaringan Ethernet adalah...",
        options: ["Konektor RJ45", "Konektor HDMI", "Konektor USB-C", "Konektor DisplayPort"],
        correct: 0,
        explanation: "RJ45 merupakan konektor fisik standar untuk kabel jaringan LAN berbasis tembaga."
      },
      {
        partId: "l3-fiber",
        question: "Media transmisi jaringan berkecepatan sangat tinggi yang mengirimkan data menggunakan pulsa cahaya melalui serat kaca adalah...",
        options: ["Kabel Fiber Optik", "Kabel UTP Cat5", "Kabel Telepon RJ11", "Kabel Power AC"],
        correct: 0,
        explanation: "Fiber optik tahan terhadap interferensi elektromagnetik dan mampu menjangkau jarak jauh."
      },
      {
        partId: "l3-server",
        question: "Komputer berkinerja tinggi yang beroperasi 24 jam untuk menyediakan layanan web, basis data, dan penyimpanan bagi klien di jaringan adalah...",
        options: ["Server", "Client Netbook", "Joystick", "Scanner"],
        correct: 0,
        explanation: "Server melayani permintaan (request) dari berbagai perangkat client melalui protokol jaringan."
      },
      {
        partId: "l3-firewall",
        question: "Sistem keamanan jaringan yang memantau dan menyaring lalu lintas data masuk dan keluar berdasarkan aturan keamanan tertentu adalah...",
        options: ["Firewall", "Defragmenter", "Compiler", "Codec Audio"],
        correct: 0,
        explanation: "Firewall memblokir akses tidak sah yang mencoba masuk ke jaringan internal."
      },
      {
        partId: "l3-ap",
        question: "Perangkat yang memancarkan sinyal nirkabel (Wi-Fi) agar perangkat mobile dapat terhubung ke jaringan kabel lokal adalah...",
        options: ["Wireless Access Point", "UPS Baterai", "Thermal Paste", "DVD Writer"],
        correct: 0,
        explanation: "Access Point memperluas jangkauan jaringan lokal secara nirkabel menggunakan standar IEEE 802.11."
      },
      {
        partId: "l3-packet",
        question: "Potongan kecil data yang dilengkapi informasi alamat pengirim, alamat tujuan, dan nomor urut saat dikirim melalui internet disebut...",
        options: ["Paket Data (Packet)", "Piksel Layar", "Sektor Disk", "Partisi FAT32"],
        correct: 0,
        explanation: "Protokol TCP/IP memecah data besar menjadi paket-paket kecil agar mudah dikirim dan dirakit kembali."
      },
      {
        partId: "l3-dns",
        question: "Sistem yang menerjemahkan nama domain yang mudah diingat manusia (seperti sekolah.sch.id) menjadi alamat IP numerik adalah...",
        options: ["DNS (Domain Name System)", "DHCP", "FTP", "SMTP"],
        correct: 0,
        explanation: "DNS berfungsi seperti buku telepon internet yang memetakan domain ke alamat IP server."
      },
      {
        partId: "l3-modem",
        question: "Perangkat yang memodulasi dan mendemodulasi sinyal dari penyedia layanan internet (ISP) menjadi data digital untuk jaringan rumah/sekolah adalah...",
        options: ["Modem / ONT", "Sound Card", "Card Reader", "KVM Switch"],
        correct: 0,
        explanation: "Modem menghubungkan jaringan lokal dengan infrastruktur jaringan luas milik ISP."
      }
    ]
  },

  {
    level: 4,
    mapLabel: "Soal 4",
    title: "Algoritma & Struktur Data",
    subtitle: "Komputasi: Flowchart, Array, Stack, Queue & Binary Tree",
    gradient: "linear-gradient(135deg, #c084fc 0%, #fb923c 100%)",
    questions: [
      {
        partId: "l4-flowchart",
        question: "Dalam diagram alir (Flowchart), simbol berbentuk belah ketupat (diamond) digunakan untuk merepresentasikan...",
        options: ["Keputusan / Percabangan Kondisi (If-Else)", "Mulai atau Selesai", "Input / Output Data", "Arah Aliran Proses"],
        correct: 0,
        explanation: "Simbol decision mengevaluasi kondisi Benar (True) atau Salah (False) untuk menentukan jalur berikutnya."
      },
      {
        partId: "l4-array",
        question: "Struktur data linear yang menyimpan sekumpulan elemen bertipe sama secara bersebelahan dan diakses menggunakan nomor indeks mulai dari 0 adalah...",
        options: ["Array (Larik)", "Binary Tree", "Undirected Graph", "Pointer Null"],
        correct: 0,
        explanation: "Array memungkinkan akses elemen secara langsung (random access) melalui indeksnya."
      },
      {
        partId: "l4-stack",
        question: "Struktur data yang menerapkan prinsip LIFO (Last In, First Out — elemen terakhir masuk adalah yang pertama keluar) adalah...",
        options: ["Stack (Tumpukan)", "Queue (Antrean)", "Hash Map", "Linked Matrix"],
        correct: 0,
        explanation: "Stack digunakan pada fitur Undo aplikasi dan pemanggilan fungsi (Call Stack)."
      },
      {
        partId: "l4-queue",
        question: "Struktur data yang menerapkan prinsip FIFO (First In, First Out — elemen pertama masuk diproses lebih dulu) adalah...",
        options: ["Queue (Antrean)", "Stack (Tumpukan)", "Heap Tree", "Set"],
        correct: 0,
        explanation: "Queue bekerja seperti antrean loket, digunakan pada antrean cetak printer dan penjadwalan paket."
      },
      {
        partId: "l4-tree",
        question: "Struktur data hierarkis non-linear di mana setiap simpul (node) memiliki maksimal dua anak (left child & right child) disebut...",
        options: ["Binary Tree", "Linear Array", "Circular Queue", "Register"],
        correct: 0,
        explanation: "Binary Tree mempercepat pencarian dan pengorganisasian data hierarkis."
      },
      {
        partId: "l4-graph",
        question: "Struktur data yang terdiri dari kumpulan titik (Vertex/Node) dan garis penghubung (Edge) untuk memodelkan peta rute atau jejaring sosial adalah...",
        options: ["Graph", "Stack", "Boolean", "String"],
        correct: 0,
        explanation: "Graph sangat ideal untuk algoritma pencarian rute terpendek seperti GPS navigasi."
      },
      {
        partId: "l4-loop",
        question: "Konstruksi algoritma yang mengeksekusi blok instruksi secara berulang selama kondisi tertentu masih terpenuhi disebut...",
        options: ["Perulangan (Looping / Iterasi)", "Deklarasi Variabel", "Komentar Kode", "Enkapsulasi"],
        correct: 0,
        explanation: "Looping (for, while) menghindarkan programmer menulis kode berulang secara manual."
      },
      {
        partId: "l4-gate",
        question: "Pada gerbang logika AND, jika input A bernilai 1 (True) dan input B bernilai 0 (False), maka keluaran (output) yang dihasilkan adalah...",
        options: ["0 (False)", "1 (True)", "2", "Error"],
        correct: 0,
        explanation: "Gerbang AND hanya menghasilkan output 1 jika SELURUH inputnya bernilai 1."
      },
      {
        partId: "l4-sort",
        question: "Proses menyusun elemen data dari nilai terkecil ke terbesar (ascending) atau sebaliknya dalam algoritma disebut...",
        options: ["Sorting (Pengurutan)", "Searching (Pencarian)", "Hashing", "Parsing"],
        correct: 0,
        explanation: "Algoritma sorting seperti Bubble Sort dan Merge Sort mempermudah pencarian data."
      },
      {
        partId: "l4-hash",
        question: "Struktur data yang memetakan kunci (key) ke nilai (value) menggunakan fungsi hash agar pencarian berlangsung dalam waktu konstan O(1) adalah...",
        options: ["Hash Table", "Single Linked List", "Bubble Array", "Stack Frame"],
        correct: 0,
        explanation: "Hash Table menghitung indeks penyimpanan langsung dari kunci menggunakan fungsi matematika."
      }
    ]
  },

  {
    level: 5,
    mapLabel: "Soal 5",
    title: "Cyber Security, AI & IoT",
    subtitle: "Teknologi modern: Enkripsi, Neural Network, Mikrokontroler & 2FA",
    gradient: "linear-gradient(135deg, #fb923c 0%, #fde047 100%)",
    questions: [
      {
        partId: "l5-encrypt",
        question: "Proses mengubah data asli (plaintext) menjadi kode acak (ciphertext) agar hanya pihak berwenang yang dapat membacanya disebut...",
        options: ["Enkripsi (Encryption)", "Kompresi ZIP", "Formatting", "Indexing"],
        correct: 0,
        explanation: "Enkripsi melindungi kerahasiaan data saat dikirim melalui internet maupun saat disimpan."
      },
      {
        partId: "l5-mcu",
        question: "Komputer mini dalam satu sirkuit terpadu yang memiliki prosesor, memori, dan pin I/O untuk mengendalikan perangkat IoT adalah...",
        options: ["Mikrokontroler", "Power Supply ATX", "Monitor 4K", "Kabel VGA"],
        correct: 0,
        explanation: "Mikrokontroler membaca data dari sensor dan menggerakkan aktuator secara otomatis."
      },
      {
        partId: "l5-sensor",
        question: "Komponen input pada sistem Internet of Things yang mendeteksi besaran fisik lingkungan (seperti jarak, suhu, atau cahaya) menjadi sinyal listrik adalah...",
        options: ["Sensor", "Aktuator Motor", "Buzzer", "Kabel Jumper"],
        correct: 0,
        explanation: "Sensor bertindak sebagai indra bagi perangkat cerdas untuk mengumpulkan data lingkungan."
      },
      {
        partId: "l5-ai",
        question: "Cabang kecerdasan buatan (AI) yang meniru cara kerja neuron otak manusia dalam mengenali pola gambar, suara, dan teks disebut...",
        options: ["Artificial Neural Network / Deep Learning", "Spreadsheet Macro", "Disk Defragmenter", "BIOS Setup"],
        correct: 0,
        explanation: "Neural Network memproses data melalui lapisan input, hidden layers, dan output untuk belajar dari pola."
      },
      {
        partId: "l5-2fa",
        question: "Lapisan keamanan tambahan yang mewajibkan pengguna memverifikasi identitas dengan dua bukti berbeda (misal password + kode OTP) adalah...",
        options: ["Two-Factor Authentication (2FA)", "Auto-Save", "Incognito Mode", "Screen Mirroring"],
        correct: 0,
        explanation: "2FA mencegah pembobolan akun meskipun kata sandi pengguna berhasil diketahui penyerang."
      },
      {
        partId: "l5-actuator",
        question: "Komponen keluaran pada sistem IoT/robotika yang mengubah sinyal perintah dari mikrokontroler menjadi gerakan fisik disebut...",
        options: ["Aktuator (Actuator)", "Sensor Suhu", "Resistor", "Dioda Zener"],
        correct: 0,
        explanation: "Aktuator (seperti motor servo atau relay) mengeksekusi aksi nyata di dunia fisik."
      },
      {
        partId: "l5-db",
        question: "Kumpulan data terorganisir yang dikelola oleh DBMS (seperti PostgreSQL atau MySQL) agar dapat dicari dan diperbarui secara efisien adalah...",
        options: ["Basis Data (Database)", "Wallpaper Desktop", "File MP3", "Driver Audio"],
        correct: 0,
        explanation: "Database menyimpan informasi pengguna, transaksi, dan catatan sistem secara terstruktur."
      },
      {
        partId: "l5-phishing",
        question: "Upaya penipuan digital dengan menyamar sebagai lembaga resmi melalui email atau situs palsu untuk mencuri kredensial login disebut...",
        options: ["Phishing", "Debugging", "Compiling", "Overclocking"],
        correct: 0,
        explanation: "Selalu periksa keaslian alamat domain (URL) sebelum memasukkan username dan password."
      },
      {
        partId: "l5-biometric",
        question: "Metode autentikasi keamanan yang memanfaatkan karakteristik biologis unik manusia seperti sidik jari atau pola wajah adalah...",
        options: ["Autentikasi Biometrik", "PIN Numerik", "Captcha Teks", "Cookie Browser"],
        correct: 0,
        explanation: "Biometrik sulit dipalsukan karena melekat langsung pada ciri fisik pengguna."
      },
      {
        partId: "l5-hub",
        question: "Perangkat penghubung yang menyatukan berbagai sensor dan peralatan pintar (lampu, kunci, kamera) ke jaringan internet cloud adalah...",
        options: ["IoT Gateway / Smart Hub", "Kabel Paralel", "Floppy Controller", "Card Puncher"],
        correct: 0,
        explanation: "IoT Gateway menerjemahkan protokol komunikasi perangkat pintar menuju server cloud."
      }
    ]
  }
];