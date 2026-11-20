# InformaQuest // 3D Interactive Learning Platform

Aplikasi pembelajaran interaktif berbasis web 3D untuk materi **Fondasi Informatika**. Pengguna dapat mempelajari rangkuman materi terstruktur, menginspeksi model objek 3D secara 360°, mengerjakan kuis berbatas waktu dengan protokol layar penuh, mengumpulkan koin untuk membeli *power-up*, serta bersaing pada papan peringkat global.

## Live Demo
👉 **[https://username-github-kamu.github.io/informaquest/](https://username-github-kamu.github.io/informaquest/)**

## Fitur Utama
1. **Modul Bacaan Bertingkat:** Navigasi Section 1 (`1.1` – `1.5`) & Section 2 (`2.1` – `2.5`) lengkap dengan referensi pustaka.
2. **Visualisasi Objek 3D (Three.js):** 50 model 3D interaktif (komponen hardware, jaringan, struktur data, AI & IoT) yang dapat diputar 360° dan di-zoom.
3. **Peta Lintasan Progresif:** Sistem *stage* bertahap (Soal 1 – Soal 5) dengan penyimpanan otomatis ke database cloud **Supabase**.
4. **Protokol Ujian Layar Penuh:** Penguncian mode *fullscreen* serta deteksi perpindahan tab atau minimize selama kuis berlangsung.
5. **InformaQuest Shop & Power-Ups:** Sistem perolehan koin (`◈`) untuk membeli *Time Freeze*, *50:50 Eliminator*, *2x EXP Booster*, dan *Auto-Solve*.
6. **Profil Mahasiswa & Podium Juara:** Sistem lencana pencapaian (*achievements*) dan *leaderboard* global *real-time*.

## Teknologi yang Digunakan
* **Frontend:** HTML5, CSS3, Vanilla JavaScript (ES6+)
* **3D Rendering:** Three.js (r128) + OrbitControls
* **Audio Synthesis:** Web Audio API
* **Backend & Database:** Supabase (PostgreSQL REST API)