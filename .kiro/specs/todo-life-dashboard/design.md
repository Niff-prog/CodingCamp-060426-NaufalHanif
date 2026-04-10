# Design: Todo Life Dashboard

## Overview

Todo Life Dashboard adalah aplikasi web single-page yang berjalan sepenuhnya di browser tanpa backend. Aplikasi ini menggabungkan empat widget utama — Greeting & Jam, Focus Timer, To-Do List, dan Quick Links — dalam satu tampilan dashboard yang bersih dan responsif.

Seluruh state disimpan di `localStorage` browser. Tidak ada server, tidak ada database, tidak ada framework. Hanya tiga file statis: `index.html`, `css/style.css`, dan `js/script.js`.

**Keputusan desain utama:**
- Vanilla JS tanpa framework untuk menjaga kesederhanaan dan portabilitas
- Module pattern (IIFE) untuk menghindari polusi global scope
- localStorage sebagai satu-satunya persistence layer
- CSS custom properties (variables) untuk mendukung Dark/Light Mode tanpa duplikasi style

---

## Architecture

Aplikasi menggunakan arsitektur **MVC ringan** yang sepenuhnya berjalan di sisi klien:

```
┌─────────────────────────────────────────────────────┐
│                    index.html                        │
│  (struktur DOM, widget containers, tombol-tombol)    │
└──────────────────────┬──────────────────────────────┘
                       │ loads
          ┌────────────┴────────────┐
          ▼                         ▼
   css/style.css              js/script.js
   (tema, layout,             (state, logic,
    dark/light mode,           DOM manipulation,
    card system,               event handlers,
    responsif)                 localStorage I/O)
```

**Alur data:**

```
User Action → Event Handler → State Update → localStorage.setItem() → renderUI()
                                                                           │
                                                              DOM diperbarui sesuai state
```

**State management:**

Semua state disimpan dalam satu objek `AppState` di memori, yang di-sync ke localStorage setiap kali ada perubahan:

```
AppState {
  userName: string
  theme: 'light' | 'dark'
  tasks: Task[]
  links: QuickLink[]
  timer: TimerState
}
```

---

## Components and Interfaces

### 1. Greeting Widget

Bertanggung jawab menampilkan jam real-time dan ucapan salam berdasarkan waktu.

```
GreetingWidget
├── formatTime(date: Date) → string          // "HH:MM:SS"
├── getGreeting(hour: number) → string       // "Selamat Pagi/Siang/Malam"
├── getUserName() → string                   // dari localStorage atau default
├── setUserName(name: string) → void         // simpan ke localStorage
└── tick() → void                            // dipanggil setInterval setiap 1000ms
```

### 2. Focus Timer

Countdown timer Pomodoro 25 menit dengan kontrol Start/Stop/Reset.

```
TimerWidget
├── state: { seconds: number, running: boolean }
├── start() → void
├── stop() → void
├── reset() → void
├── tick() → void                            // dipanggil setiap detik jika running
└── formatDisplay(seconds: number) → string // "MM:SS"
```

### 3. Task Manager

CRUD lengkap untuk to-do items dengan persistensi localStorage.

```
TaskManager
├── tasks: Task[]
├── loadTasks() → Task[]                     // dari localStorage
├── saveTasks(tasks: Task[]) → void          // ke localStorage
├── addTask(description: string) → Task | null
├── editTask(id: string, newDesc: string) → boolean
├── deleteTask(id: string) → boolean
├── toggleTask(id: string) → boolean
└── renderTasks() → void
```

### 4. Quick Links Manager

Manajemen tautan cepat dengan persistensi localStorage.

```
LinksManager
├── links: QuickLink[]
├── loadLinks() → QuickLink[]
├── saveLinks(links: QuickLink[]) → void
├── addLink(name: string, url: string) → QuickLink | null
├── deleteLink(id: string) → boolean
└── renderLinks() → void
```

### 5. Theme Manager

Mengelola Dark/Light Mode dengan persistensi preferensi.

```
ThemeManager
├── getTheme() → 'light' | 'dark'
├── setTheme(theme: string) → void
├── toggle() → void
└── apply(theme: string) → void              // set data-theme attribute pada <html>
```

---

## Data Models

### Task

```javascript
{
  id: string,          // crypto.randomUUID() atau Date.now().toString()
  description: string, // teks task, tidak boleh kosong/whitespace
  completed: boolean,  // false = belum selesai, true = selesai
  createdAt: number    // timestamp Unix
}
```

### QuickLink

```javascript
{
  id: string,          // crypto.randomUUID() atau Date.now().toString()
  name: string,        // label tampilan, boleh kosong (fallback ke URL)
  url: string,         // URL lengkap, wajib diisi
  createdAt: number    // timestamp Unix
}
```

### localStorage Keys

| Key | Value | Keterangan |
|-----|-------|------------|
| `tld_userName` | `string` | Nama pengguna untuk greeting |
| `tld_theme` | `'light' \| 'dark'` | Preferensi tema |
| `tld_tasks` | `JSON string of Task[]` | Semua task |
| `tld_links` | `JSON string of QuickLink[]` | Semua quick links |

Prefix `tld_` (todo-life-dashboard) digunakan untuk menghindari konflik dengan aplikasi lain di domain yang sama.

---

## UI Structure

### Layout Grid

```
┌─────────────────────────────────────────────────────┐
│  Header: Greeting + Jam + Nama Input + Theme Toggle  │
├──────────────────────┬──────────────────────────────┤
│   Focus Timer Card   │      To-Do List Card          │
│   [25:00]            │   [ Input tambah task ]       │
│   [Start][Stop][Reset]│   ☐ Task 1                  │
│                      │   ☑ Task 2 (selesai)          │
├──────────────────────┴──────────────────────────────┤
│              Quick Links Card                        │
│   [ Nama ] [ URL ] [+]                               │
│   🔗 Google   🔗 GitHub   🔗 ...                    │
└─────────────────────────────────────────────────────┘
```

### CSS Custom Properties (Tema)

```css
:root {
  --color-primary: #7c3aed;       /* ungu utama */
  --color-primary-light: #a78bfa;
  --color-bg: #f5f3ff;
  --color-surface: #ffffff;       /* card background */
  --color-text: #1e1b4b;
  --color-text-muted: #6b7280;
  --shadow-card: 0 2px 12px rgba(124, 58, 237, 0.08);
  --radius-card: 16px;
}

[data-theme="dark"] {
  --color-bg: #1e1b4b;
  --color-surface: #2d2a5e;
  --color-text: #f5f3ff;
  --color-text-muted: #a78bfa;
  --shadow-card: 0 2px 12px rgba(0, 0, 0, 0.3);
}
```

### Struktur File

```
project-root/
├── index.html
├── css/
│   └── style.css
└── js/
    └── script.js
```

---

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system — essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Format jam selalu valid

*For any* nilai `Date` yang valid, fungsi `formatTime()` SHALL menghasilkan string yang cocok dengan pola `HH:MM:SS` (dua digit jam, dua digit menit, dua digit detik, dipisahkan titik dua).

**Validates: Requirements 1.1**

---

### Property 2: Greeting sesuai rentang waktu

*For any* nilai jam (0–23), fungsi `getGreeting()` SHALL mengembalikan tepat satu dari tiga ucapan salam — "Selamat Pagi" untuk jam 0–11, "Selamat Siang" untuk jam 12–17, dan "Selamat Malam" untuk jam 18–23 — dan tidak pernah mengembalikan nilai di luar ketiga pilihan tersebut.

**Validates: Requirements 1.2, 1.3, 1.4**

---

### Property 3: Round-trip nama pengguna

*For any* string nama yang valid (non-kosong), menyimpan nama tersebut ke localStorage dan kemudian membacanya kembali SHALL menghasilkan string yang identik dengan yang disimpan, dan nama tersebut SHALL muncul dalam teks ucapan salam yang dirender.

**Validates: Requirements 1.5, 1.6**

---

### Property 4: Reset timer selalu ke nilai awal

*For any* state timer (nilai detik antara 0–1500, kondisi running atau stopped), memanggil `reset()` SHALL mengembalikan nilai timer ke tepat 1500 detik (25:00) dan menghentikan hitungan mundur.

**Validates: Requirements 2.4**

---

### Property 5: Penambahan task memperbesar daftar

*For any* daftar task yang ada dan deskripsi task yang valid (non-kosong, non-whitespace), memanggil `addTask()` SHALL menghasilkan daftar yang panjangnya bertambah tepat satu, dan task baru tersebut SHALL ada dalam daftar dengan deskripsi yang identik.

**Validates: Requirements 3.1, 3.3**

---

### Property 6: Task dengan deskripsi kosong/whitespace ditolak

*For any* string yang hanya terdiri dari karakter whitespace (spasi, tab, newline), memanggil `addTask()` SHALL mengembalikan `null` dan daftar task SHALL tetap tidak berubah.

**Validates: Requirements 3.2**

---

### Property 7: Edit task tersimpan dengan benar

*For any* task yang ada dan deskripsi baru yang valid, memanggil `editTask()` lalu membaca task dari localStorage SHALL menghasilkan task dengan deskripsi yang identik dengan deskripsi baru yang diberikan.

**Validates: Requirements 4.2**

---

### Property 8: Cancel edit tidak mengubah task

*For any* task yang ada, memulai mode edit dengan deskripsi baru lalu membatalkan edit SHALL menghasilkan task dengan deskripsi yang identik dengan deskripsi aslinya.

**Validates: Requirements 4.3**

---

### Property 9: Hapus task menghilangkan dari daftar dan storage

*For any* daftar task yang berisi setidaknya satu task, menghapus task tertentu SHALL menghasilkan daftar yang tidak lagi mengandung task tersebut, dan localStorage SHALL tidak lagi mengandung task dengan ID yang sama.

**Validates: Requirements 5.1**

---

### Property 10: Toggle status task adalah idempoten ganda (round-trip)

*For any* task dengan status apapun (selesai atau belum), memanggil `toggleTask()` dua kali berturut-turut SHALL menghasilkan task dengan status yang identik dengan status awalnya.

**Validates: Requirements 6.1, 6.2, 6.3**

---

### Property 11: Load tasks adalah kebalikan dari save tasks

*For any* array task yang valid, menyimpan array tersebut ke localStorage dengan `saveTasks()` lalu memuatnya kembali dengan `loadTasks()` SHALL menghasilkan array yang secara struktural identik dengan array yang disimpan.

**Validates: Requirements 7.1, 7.2**

---

### Property 12: Penambahan quick link memperbesar daftar

*For any* daftar quick links yang ada dan URL yang valid (non-kosong), memanggil `addLink()` SHALL menghasilkan daftar yang panjangnya bertambah tepat satu, dan link baru tersebut SHALL ada dalam daftar dengan URL yang identik.

**Validates: Requirements 8.1, 8.3**

---

### Property 13: Quick link dengan URL kosong/whitespace ditolak

*For any* string URL yang hanya terdiri dari karakter whitespace, memanggil `addLink()` SHALL mengembalikan `null` dan daftar quick links SHALL tetap tidak berubah.

**Validates: Requirements 8.2**

---

### Property 14: Hapus quick link menghilangkan dari daftar dan storage

*For any* daftar quick links yang berisi setidaknya satu link, menghapus link tertentu SHALL menghasilkan daftar yang tidak lagi mengandung link tersebut, dan localStorage SHALL tidak lagi mengandung link dengan ID yang sama.

**Validates: Requirements 9.1**

---

### Property 15: Toggle tema adalah round-trip

*For any* tema yang aktif ('light' atau 'dark'), memanggil `toggle()` dua kali berturut-turut SHALL menghasilkan tema yang identik dengan tema awal, dan preferensi tersebut SHALL tersimpan dengan benar di localStorage setelah setiap toggle.

**Validates: Requirements 11.2, 11.3, 11.4**

---

## Error Handling

### Input Validation

| Kondisi | Penanganan |
|---------|------------|
| Task description kosong/whitespace | Tolak, tampilkan visual feedback (border merah sementara), jangan ubah state |
| URL quick link kosong/whitespace | Tolak, tampilkan visual feedback, jangan ubah state |
| URL quick link tanpa protokol | Auto-prepend `https://` sebelum menyimpan |
| localStorage tidak tersedia | Graceful degradation — aplikasi tetap berjalan tanpa persistensi, tampilkan pesan info |
| JSON parse error dari localStorage | Tangkap exception, reset ke array kosong, log ke console |

### Timer Edge Cases

| Kondisi | Penanganan |
|---------|------------|
| Timer mencapai 0 | Hentikan interval, tampilkan notifikasi visual (misalnya card berkedip sekali) |
| Start dipanggil saat sudah running | Abaikan (idempoten) |
| Stop dipanggil saat sudah stopped | Abaikan (idempoten) |

### localStorage Error Handling

```javascript
function safeGetItem(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (e) {
    console.warn(`[TLD] Failed to read ${key} from localStorage`, e);
    return fallback;
  }
}

function safeSetItem(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.warn(`[TLD] Failed to write ${key} to localStorage`, e);
  }
}
```

---

## Testing Strategy

### Pendekatan Dual Testing

Fitur ini menggunakan dua lapisan pengujian yang saling melengkapi:

1. **Unit tests (example-based)** — untuk perilaku spesifik, edge cases, dan integrasi antar komponen
2. **Property-based tests** — untuk memverifikasi properti universal di atas berbagai input yang di-generate secara acak

### Library yang Digunakan

- **fast-check** (JavaScript) — library property-based testing yang matang untuk ekosistem JS/TS
- **Vitest** atau **Jest** — test runner untuk unit tests

### Konfigurasi Property Tests

Setiap property test dikonfigurasi dengan minimum **100 iterasi** untuk memastikan coverage yang memadai:

```javascript
fc.assert(fc.property(...), { numRuns: 100 });
```

Setiap test diberi tag komentar yang mereferensikan property di dokumen desain ini:

```javascript
// Feature: todo-life-dashboard, Property 1: Format jam selalu valid
test('formatTime menghasilkan format HH:MM:SS untuk semua Date yang valid', () => {
  fc.assert(
    fc.property(fc.date(), (date) => {
      const result = formatTime(date);
      expect(result).toMatch(/^\d{2}:\d{2}:\d{2}$/);
    }),
    { numRuns: 100 }
  );
});
```

### Cakupan Unit Tests

Unit tests fokus pada:
- Nilai awal timer (25:00) — Requirement 2.1
- Perilaku Start/Stop timer — Requirement 2.2, 2.3
- Auto-stop timer di 00:00 — Requirement 2.5
- Pembukaan quick link di tab baru (mock `window.open`) — Requirement 10.1
- Keberadaan elemen DOM utama saat halaman dimuat — Requirement 11.1

### Cakupan Property Tests

| Property | Requirement | Pola |
|----------|-------------|------|
| 1. Format jam valid | 1.1 | Invariant output format |
| 2. Greeting sesuai rentang | 1.2–1.4 | Partisi input space |
| 3. Round-trip nama | 1.5–1.6 | Round-trip |
| 4. Reset timer ke awal | 2.4 | Invariant setelah operasi |
| 5. Tambah task memperbesar daftar | 3.1, 3.3 | Metamorphic + round-trip |
| 6. Task kosong ditolak | 3.2 | Error condition |
| 7. Edit task tersimpan | 4.2 | Round-trip |
| 8. Cancel edit tidak mengubah | 4.3 | Idempotence |
| 9. Hapus task menghilangkan | 5.1 | Invariant setelah hapus |
| 10. Toggle status round-trip | 6.1–6.3 | Round-trip (idempoten ganda) |
| 11. Load = kebalikan save | 7.1–7.2 | Round-trip serialisasi |
| 12. Tambah link memperbesar daftar | 8.1, 8.3 | Metamorphic + round-trip |
| 13. Link URL kosong ditolak | 8.2 | Error condition |
| 14. Hapus link menghilangkan | 9.1 | Invariant setelah hapus |
| 15. Toggle tema round-trip | 11.2–11.4 | Round-trip |

### Catatan Implementasi

Karena aplikasi ini adalah pure client-side vanilla JS, fungsi-fungsi logika (formatTime, getGreeting, addTask, dll.) harus diekspor atau dapat diakses untuk pengujian. Pendekatan yang disarankan:

- Gunakan module pattern dengan ekspor eksplisit untuk fungsi yang perlu diuji
- Mock `localStorage` menggunakan implementasi in-memory sederhana untuk isolasi test
- Mock `Date` untuk menguji greeting berdasarkan waktu tertentu
