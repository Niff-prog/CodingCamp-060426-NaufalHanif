# Implementation Plan: Todo Life Dashboard

## Overview

Implementasi aplikasi web single-page menggunakan HTML, CSS, dan Vanilla JavaScript murni. Arsitektur MVC ringan dengan localStorage sebagai persistence layer. Tiga file utama: `index.html`, `css/style.css`, `js/script.js`.

## Tasks

- [x] 1. Set up project structure and core HTML
  - Buat `index.html` dengan struktur DOM lengkap: header greeting, card timer, card todo list, card quick links
  - Sertakan semua elemen interaktif: input nama, tombol theme toggle, form tambah task, form tambah link
  - Link ke `css/style.css` dan `js/script.js`
  - _Requirements: 11.1_

- [x] 2. Implement CSS styling and theme system
  - [x] 2.1 Buat `css/style.css` dengan CSS custom properties untuk tema ungu
    - Definisikan variabel warna light mode dan dark mode (`[data-theme="dark"]`)
    - Implementasikan layout grid responsif: header full-width, 2-kolom (timer + tasks), quick links full-width
    - Styling card system dengan border-radius dan box-shadow
    - _Requirements: 11.1_
  - [x] 2.2 Implementasikan visual feedback untuk validasi input
    - Style untuk border merah sementara saat input kosong
    - Style untuk task selesai (strikethrough, opacity)
    - Style untuk mode edit task
    - _Requirements: 3.2, 4.1, 6.1_

- [x] 3. Implement ThemeManager dan localStorage utilities
  - [x] 3.1 Buat fungsi `safeGetItem` dan `safeSetItem` untuk localStorage dengan error handling
    - Tangkap JSON parse error, fallback ke nilai default
    - Log warning ke console jika localStorage tidak tersedia
    - _Requirements: 7.1, 7.2_
  - [x] 3.2 Implementasikan `ThemeManager` dengan metode `getTheme`, `setTheme`, `toggle`, `apply`
    - Simpan preferensi ke `tld_theme`, apply via `data-theme` attribute pada `<html>`
    - Muat preferensi saat init
    - _Requirements: 11.2, 11.3, 11.4_
  - [ ]* 3.3 Write property test untuk toggle tema (Property 15)
    - **Property 15: Toggle tema adalah round-trip**
    - **Validates: Requirements 11.2, 11.3, 11.4**

- [x] 4. Implement GreetingWidget
  - [x] 4.1 Implementasikan `formatTime(date)` dan `getGreeting(hour)`
    - `formatTime` menghasilkan string `HH:MM:SS` dengan zero-padding
    - `getGreeting` mengembalikan "Selamat Pagi" (0–11), "Selamat Siang" (12–17), "Selamat Malam" (18–23)
    - _Requirements: 1.1, 1.2, 1.3, 1.4_
  - [ ]* 4.2 Write property test untuk format jam (Property 1)
    - **Property 1: Format jam selalu valid**
    - **Validates: Requirements 1.1**
  - [ ]* 4.3 Write property test untuk greeting (Property 2)
    - **Property 2: Greeting sesuai rentang waktu**
    - **Validates: Requirements 1.2, 1.3, 1.4**
  - [x] 4.4 Implementasikan `getUserName`, `setUserName`, dan `tick()`
    - Baca/tulis nama dari `tld_userName` di localStorage
    - `tick()` dipanggil `setInterval` setiap 1000ms, update DOM jam dan greeting
    - _Requirements: 1.5, 1.6_
  - [ ]* 4.5 Write property test untuk round-trip nama pengguna (Property 3)
    - **Property 3: Round-trip nama pengguna**
    - **Validates: Requirements 1.5, 1.6**

- [x] 5. Implement TimerWidget
  - [x] 5.1 Implementasikan `TimerWidget` dengan state `{ seconds: 1500, running: false }`
    - Metode `start()`, `stop()`, `reset()`, `tick()`, `formatDisplay(seconds)`
    - `start()` idempoten jika sudah running; `stop()` idempoten jika sudah stopped
    - Auto-stop dan notifikasi visual saat mencapai 00:00
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5_
  - [ ]* 5.2 Write property test untuk reset timer (Property 4)
    - **Property 4: Reset timer selalu ke nilai awal**
    - **Validates: Requirements 2.4**

- [x] 6. Implement TaskManager
  - [x] 6.1 Implementasikan `loadTasks`, `saveTasks`, `addTask`, `deleteTask`, `toggleTask`
    - `addTask` tolak deskripsi kosong/whitespace, kembalikan `null`
    - `toggleTask` ubah status `completed` dan simpan ke localStorage
    - _Requirements: 3.1, 3.2, 3.3, 5.1, 6.1, 6.2, 6.3, 7.1, 7.2_
  - [ ]* 6.2 Write property test untuk penambahan task (Property 5)
    - **Property 5: Penambahan task memperbesar daftar**
    - **Validates: Requirements 3.1, 3.3**
  - [ ]* 6.3 Write property test untuk task kosong ditolak (Property 6)
    - **Property 6: Task dengan deskripsi kosong/whitespace ditolak**
    - **Validates: Requirements 3.2**
  - [x] 6.4 Implementasikan `editTask` dengan mode edit inline di DOM
    - Klik edit → tampilkan input inline; simpan → update deskripsi; batal → kembalikan teks asli
    - _Requirements: 4.1, 4.2, 4.3_
  - [ ]* 6.5 Write property test untuk edit task (Property 7)
    - **Property 7: Edit task tersimpan dengan benar**
    - **Validates: Requirements 4.2**
  - [ ]* 6.6 Write property test untuk cancel edit (Property 8)
    - **Property 8: Cancel edit tidak mengubah task**
    - **Validates: Requirements 4.3**
  - [ ]* 6.7 Write property test untuk hapus task (Property 9)
    - **Property 9: Hapus task menghilangkan dari daftar dan storage**
    - **Validates: Requirements 5.1**
  - [ ]* 6.8 Write property test untuk toggle status (Property 10)
    - **Property 10: Toggle status task adalah idempoten ganda**
    - **Validates: Requirements 6.1, 6.2, 6.3**
  - [ ]* 6.9 Write property test untuk round-trip serialisasi (Property 11)
    - **Property 11: Load tasks adalah kebalikan dari save tasks**
    - **Validates: Requirements 7.1, 7.2**
  - [x] 6.10 Implementasikan `renderTasks()` untuk merender daftar task ke DOM
    - Render checkbox, teks deskripsi, tombol edit, tombol hapus
    - Terapkan class `completed` untuk task selesai (strikethrough)
    - _Requirements: 6.1, 7.1_

- [x] 7. Checkpoint - Pastikan semua logika inti berfungsi
  - Ensure all tests pass, ask the user if questions arise.

- [x] 8. Implement LinksManager
  - [x] 8.1 Implementasikan `loadLinks`, `saveLinks`, `addLink`, `deleteLink`
    - `addLink` tolak URL kosong/whitespace, kembalikan `null`
    - Auto-prepend `https://` jika URL tidak memiliki protokol
    - _Requirements: 8.1, 8.2, 8.3, 9.1_
  - [ ]* 8.2 Write property test untuk penambahan quick link (Property 12)
    - **Property 12: Penambahan quick link memperbesar daftar**
    - **Validates: Requirements 8.1, 8.3**
  - [ ]* 8.3 Write property test untuk URL kosong ditolak (Property 13)
    - **Property 13: Quick link dengan URL kosong/whitespace ditolak**
    - **Validates: Requirements 8.2**
  - [ ]* 8.4 Write property test untuk hapus quick link (Property 14)
    - **Property 14: Hapus quick link menghilangkan dari daftar dan storage**
    - **Validates: Requirements 9.1**
  - [x] 8.5 Implementasikan `renderLinks()` dan event handler buka link di tab baru
    - Klik link → `window.open(url, '_blank')`
    - _Requirements: 10.1_

- [x] 9. Wire semua komponen dan inisialisasi aplikasi
  - [x] 9.1 Buat fungsi `init()` yang menginisialisasi semua komponen saat DOM ready
    - Panggil `ThemeManager.apply()`, `GreetingWidget.tick()`, `TaskManager.renderTasks()`, `LinksManager.renderLinks()`
    - Pasang semua event listener: form submit, tombol, checkbox, input nama
    - _Requirements: 1.1, 2.1, 7.1, 8.1, 11.1, 11.4_
  - [ ]* 9.2 Write unit tests untuk inisialisasi DOM
    - Test keberadaan elemen DOM utama saat halaman dimuat
    - _Requirements: 11.1_

- [x] 10. Final checkpoint - Pastikan semua fitur terintegrasi
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks bertanda `*` bersifat opsional dan dapat dilewati untuk MVP lebih cepat
- Setiap task mereferensikan requirements spesifik untuk traceability
- Property tests menggunakan **fast-check** dengan minimum 100 iterasi
- Unit tests menggunakan **Vitest** atau **Jest**
- Fungsi logika murni (formatTime, getGreeting, addTask, dll.) harus dapat diakses untuk pengujian
