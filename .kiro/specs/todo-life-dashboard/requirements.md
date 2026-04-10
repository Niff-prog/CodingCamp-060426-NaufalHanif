# Requirements: Todo Life Dashboard

## Requirement 1: Greeting Widget

**User Story:** Sebagai pengguna, saya ingin melihat jam digital real-time dan ucapan salam otomatis, sehingga saya tahu waktu saat ini dan merasa disambut.

### Acceptance Criteria

1. WHEN halaman dimuat THEN sistem SHALL menampilkan jam digital dalam format HH:MM:SS yang diperbarui setiap detik
2. WHEN waktu berada di antara 00:00–11:59 THEN sistem SHALL menampilkan ucapan "Selamat Pagi"
3. WHEN waktu berada di antara 12:00–17:59 THEN sistem SHALL menampilkan ucapan "Selamat Siang"
4. WHEN waktu berada di antara 18:00–23:59 THEN sistem SHALL menampilkan ucapan "Selamat Malam"
5. WHEN pengguna memasukkan nama kustom THEN sistem SHALL menyimpan nama tersebut ke Local Storage dan menampilkannya dalam ucapan salam
6. WHEN halaman dimuat ulang THEN sistem SHALL memuat nama kustom dari Local Storage jika tersedia

---

## Requirement 2: Focus Timer

**User Story:** Sebagai pengguna, saya ingin menggunakan timer Pomodoro 25 menit, sehingga saya dapat fokus bekerja dalam sesi terstruktur.

### Acceptance Criteria

1. WHEN halaman dimuat THEN sistem SHALL menampilkan timer dengan nilai awal 25:00
2. WHEN pengguna menekan tombol Start THEN sistem SHALL mulai menghitung mundur setiap detik
3. WHEN pengguna menekan tombol Stop THEN sistem SHALL menghentikan hitungan mundur tanpa mereset nilai
4. WHEN pengguna menekan tombol Reset THEN sistem SHALL mengembalikan timer ke 25:00 dan menghentikan hitungan
5. WHEN timer mencapai 00:00 THEN sistem SHALL berhenti otomatis

---

## Requirement 3: Tambah Task

**User Story:** Sebagai pengguna, saya ingin menambahkan task baru ke daftar, sehingga saya dapat mencatat hal-hal yang perlu dilakukan.

### Acceptance Criteria

1. WHEN pengguna mengetik deskripsi task dan menekan Enter atau tombol tambah THEN sistem SHALL membuat task baru dan menambahkannya ke daftar
2. WHEN pengguna mencoba menambahkan task kosong THEN sistem SHALL mencegah penambahan dan mempertahankan state saat ini
3. WHEN task baru ditambahkan THEN sistem SHALL menyimpan task ke Local Storage segera

---

## Requirement 4: Edit Task

**User Story:** Sebagai pengguna, saya ingin mengedit task yang sudah ada, sehingga saya dapat memperbarui deskripsinya.

### Acceptance Criteria

1. WHEN pengguna mengklik tombol edit pada task THEN sistem SHALL mengaktifkan mode edit untuk task tersebut
2. WHEN pengguna menyimpan perubahan THEN sistem SHALL memperbarui deskripsi task dan menyimpan ke Local Storage
3. WHEN pengguna membatalkan edit THEN sistem SHALL mengembalikan task ke deskripsi semula

---

## Requirement 5: Hapus Task

**User Story:** Sebagai pengguna, saya ingin menghapus task dari daftar, sehingga saya dapat membersihkan item yang tidak relevan.

### Acceptance Criteria

1. WHEN pengguna mengklik tombol hapus pada task THEN sistem SHALL menghapus task dari daftar dan Local Storage

---

## Requirement 6: Tandai Task Selesai

**User Story:** Sebagai pengguna, saya ingin menandai task sebagai selesai, sehingga saya dapat melacak progres saya.

### Acceptance Criteria

1. WHEN pengguna mengklik checkbox pada task THEN sistem SHALL mengubah status task menjadi selesai dan menerapkan visual strikethrough
2. WHEN pengguna mengklik checkbox pada task yang sudah selesai THEN sistem SHALL mengembalikan status task menjadi belum selesai
3. WHEN status task berubah THEN sistem SHALL menyimpan perubahan ke Local Storage segera

---

## Requirement 7: Persistensi Task

**User Story:** Sebagai pengguna, saya ingin task saya tersimpan secara permanen, sehingga data tidak hilang saat halaman di-refresh.

### Acceptance Criteria

1. WHEN halaman dimuat THEN sistem SHALL memuat semua task dari Local Storage
2. WHEN task ditambah, diedit, dihapus, atau statusnya berubah THEN sistem SHALL memperbarui Local Storage segera

---

## Requirement 8: Tambah Quick Link

**User Story:** Sebagai pengguna, saya ingin menambahkan tautan cepat ke situs favorit saya, sehingga saya dapat mengaksesnya dengan mudah.

### Acceptance Criteria

1. WHEN pengguna memasukkan nama dan URL lalu menekan tombol tambah THEN sistem SHALL menambahkan link baru ke daftar Quick Links
2. WHEN pengguna mencoba menambahkan link dengan URL kosong THEN sistem SHALL mencegah penambahan
3. WHEN link baru ditambahkan THEN sistem SHALL menyimpan ke Local Storage segera

---

## Requirement 9: Hapus Quick Link

**User Story:** Sebagai pengguna, saya ingin menghapus quick link yang tidak diperlukan.

### Acceptance Criteria

1. WHEN pengguna mengklik tombol hapus pada quick link THEN sistem SHALL menghapus link dari daftar dan Local Storage

---

## Requirement 10: Buka Quick Link

**User Story:** Sebagai pengguna, saya ingin membuka quick link di tab baru.

### Acceptance Criteria

1. WHEN pengguna mengklik quick link THEN sistem SHALL membuka URL tersebut di tab baru

---

## Requirement 11: Tampilan & Tema

**User Story:** Sebagai pengguna, saya ingin tampilan yang bersih dan minimalis dengan dukungan Dark/Light Mode.

### Acceptance Criteria

1. WHEN halaman dimuat THEN sistem SHALL menampilkan layout responsif dengan tema warna ungu dan sistem card
2. WHEN pengguna mengklik tombol toggle Dark/Light Mode THEN sistem SHALL mengubah tema tampilan
3. WHEN tema berubah THEN sistem SHALL menyimpan preferensi tema ke Local Storage
4. WHEN halaman dimuat ulang THEN sistem SHALL memuat preferensi tema dari Local Storage
