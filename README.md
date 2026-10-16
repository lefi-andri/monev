# Monev - Sistem Monitoring & Evaluasi Magang

Sistem platform terintegrasi untuk pengelolaan, monitoring aktivitas harian, verifikasi kehadiran, kurikulum bimbingan, serta evaluasi program magang berbasis **Laravel**, **Inertia.js**, dan **React**.

---

## ⚠️ Pemberitahuan Lisensi & Hak Cipta (PENTING)

> [!CAUTION]
> **HAK CIPTA DILINDUNGI UNDANG-UNDANG.**
> Seluruh kode sumber (*source code*), rancangan arsitektur, dan aset digital pada repositori ini adalah karya cipta milik **LEFI ANDRI LESTARI**.

### Ketentuan Lisensi Bebas Terbatas (*Limited Permitted Use*)
1. Repositori dan *source code* ini berstatus **Bebas Terbatas**:
   - Penggunaan, pengujian, implementasi, modifikasi, penggandaan, maupun pendistribusian kode sumber hanya diperbolehkan **apabila telah mendapatkan izin resmi secara tertulis** dari pemilik hak cipta:
     - **Pembuat / Pemilik Hak Cipta**: **LEFI ANDRI LESTARI**
     - **Email Korespondensi Izin**: [lefi.andri@kokek.com](mailto:lefi.andri@kokek.com)
2. Segala bentuk pemanfaatan tanpa adanya izin tertulis yang sah dari pembuat merupakan **perbuatan ilegal (tindakan melawan hukum)**.
3. Dilarang keras menghapus, mengubah, atau menyamarkan atribusi kepemilikan, *copyright notice*, atau identitas pembuat dari kode program ini.

### Sanksi Hukum Pelanggaran Hak Cipta di Indonesia
Pelanggaran atas hak cipta ini akan ditindaklanjuti melalui jalur hukum sesuai peraturan perundang-undangan yang berlaku di Negara Kesatuan Republik Indonesia:

- **Undang-Undang Republik Indonesia Nomor 28 Tahun 2014 tentang Hak Cipta**:
  - **Pasal 113 ayat (3)**: Setiap orang yang tanpa hak dan/atau tanpa izin Pencipta atau pemegang Hak Cipta melakukan pelanggaran hak ekonomi Pencipta untuk Penggunaan Secara Komersial dipidana dengan **pidana penjara paling lama 4 (empat) tahun dan/atau pidana denda paling banyak Rp 1.000.000.000,00 (satu miliar rupiah)**.
  - **Pasal 113 ayat (4)**: Setiap orang yang memenuhi unsur sebagaimana dimaksud pada ayat (3) yang dilakukan dalam bentuk pembajakan, dipidana dengan **pidana penjara paling lama 10 (sepuluh) tahun dan/atau pidana denda paling banyak Rp 4.000.000.000,00 (empat miliar rupiah)**.
- **Undang-Undang Informasi dan Transaksi Elektronik (UU ITE)** (UU No. 11 Tahun 2008 jo. UU No. 19 Tahun 2016 jo. UU No. 1 Tahun 2024):
  - Terkait tindak pidana pengaksesan sistem secara tanpa hak (*illegal access*), perubahan, perusakan, atau transmisi informasi/dokumen elektronik milik orang lain tanpa izin yang sah.

---

## 👥 Pengguna & Akun Login Default (User Roles)

Setelah menjalankan database seeder (`php artisan migrate --seed`), sistem telah menyediakan akun pengujian untuk masing-masing *role* berikut:

| Role | Nama Akun | Email Login | Password Default | Akses & Wewenang Utama |
| :--- | :--- | :--- | :--- | :--- |
| **Admin** | Admin Monev | `admin@monev.test` | `Password123!` | Kelola seluruh pengguna (*CRUD*), manajemen *batch* / angkatan, penugasan mentor, tinjau *audit trail* (*activity log*), publikasi pengumuman sistem. |
| **Mentor** | Lefi Andri Lestari | `mentor@monev.test` | `Password123!` | Monitoring peserta bimbingan, verifikasi dan berikan catatan presensi harian, penilaian evaluasi berkala, serta kelola fokus kurikulum/modul. |
| **Peserta** | M. Riyan Akbari | `peserta@monev.test` | `Password123!` | Pengisian presensi & aktivitas harian, melihat riwayat kehadiran, progres modul kurikulum, hasil evaluasi dari mentor, dan pengumuman. |

> [!NOTE]
> Nilai default password pada seeder dapat dikonfigurasi melalui variabel lingkungan `.env` dengan menambahkan `MONEV_SEED_PASSWORD=PasswordAnda!`. Untuk lingkungan *production*, sangat dianjurkan untuk segera mengganti password default ini.

### Rincian Fitur Berdasarkan Role

#### 1. Administrator (`admin`)
- **Manajemen Batch / Angkatan**: Menambah, mengubah status (*active*, *upcoming*, *completed*), memilih batch aktif, dan menugaskan peserta ke dalam batch tertentu.
- **Manajemen Pengguna**: Membuat, mengedit, menghapus akun Admin, Mentor, maupun Peserta, serta menghubungkan peserta ke mentor penanggung jawab.
- **Activity Log & Audit Trail**: Memantau jejak audit (*causer*, *event*, deskripsi perubahan data) untuk transparansi keamanan sistem.
- **Pengumuman**: Membuat dan menyiarkan pengumuman ke seluruh role atau role spesifik.

#### 2. Mentor (`mentor`)
- **Dashboard Peserta**: Memilih dan melihat detail profil peserta magang di bawah bimbingannya.
- **Verifikasi Kehadiran**: Memeriksa laporan aktivitas presensi harian, menyetujui (*approve*), memberikan masukan/evaluasi (*mentor note*), atau menolak presensi.
- **Fokus Kurikulum & Modul**: Menentukan topik pembelajaran dan menandai status penyelesaian modul peserta magang.
- **Penilaian & Evaluasi**: Memberikan skor penilaian berkala (aspek teknis, kedisiplinan, inisiatif, dll.) beserta catatan evaluasi komprehensif.

#### 3. Peserta Magang (`peserta`)
- **Presensi Harian**: Mengisi form kehadiran harian meliputi tipe (Hadir, Izin, Sakit), jam presensi, deskripsi aktivitas pekerjaan, materi pembelajaran yang didapat, serta kendala yang dihadapi.
- **Riwayat & Verifikasi**: Memantau status persetujuan kehadiran oleh mentor pembimbing secara langsung.
- **Pantauan Belajar & Hasil Evaluasi**: Meninjau silabus fokus bimbingan dan skor evaluasi yang diterbitkan oleh mentor.

---

## 🚀 Panduan Instalasi & Cara Menggunakan

Ikuti langkah-langkah di bawah ini untuk memasang dan menjalankan aplikasi di komputer lokal:

### 1. Prasyarat Sistem
Pastikan lingkungan pengembangan Anda telah terpasang:
- **PHP** versi 8.2 atau lebih tinggi (disarankan PHP 8.3+)
- **Composer** (v2.x)
- **Node.js** (v18.x atau v20.x+) & **npm**
- **Database Server** (MySQL 8+, MariaDB 10.4+, atau SQLite)
- **Laravel Herd** (opsional untuk lingkungan Windows/macOS yang mempermudah manajemen PHP dan Nginx)

---

### 2. Langkah-Langkah Instalasi

#### Langkah 1: Kloning Repositori
```bash
git clone <URL_REPOSITORY_ANDA> monev
cd monev
```

#### Langkah 2: Pasang Dependensi Backend (PHP)
```bash
composer install
```

#### Langkah 3: Pasang Dependensi Frontend (Node.js)
```bash
npm install
```

#### Langkah 4: Konfigurasi File Environment
Salin file `.env.example` menjadi `.env`:
```bash
# Windows PowerShell
copy .env.example .env

# Atau bash/terminal
cp .env.example .env
```

Buka file `.env` dan sesuaikan pengaturan database Anda:
```env
DB_CONNECTION=mariadb
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=nama_database_anda
DB_USERNAME=root
DB_PASSWORD=
```

#### Langkah 5: Generate Application Key
```bash
php artisan key:generate
```

#### Langkah 6: Migrasi & Seeding Database
Jalankan migrasi tabel beserta akun default, role, permissions, dan data demonstrasi awal:
```bash
php artisan migrate --seed
```

#### Langkah 7: Buat Symlink Storage
Untuk memastikan berkas media seperti foto profil (*avatar*) dapat diakses secara publik:
```bash
php artisan storage:link
```

---

### 3. Menjalankan Aplikasi

#### Cara 1: Menggunakan Perintah Otomatis (*Concurrently*)
Proyek ini telah dikonfigurasi dengan skrip `composer run dev` yang secara simultan menjalankan Web Server, Antrean (*Queue*), Log Viewer, dan Vite:
```bash
composer run dev
```

#### Cara 2: Menjalankan Secara Terpisah
Buka 2 terminal terpisah:

- **Terminal 1 (Backend Server)**:
  ```bash
  php artisan serve
  ```
- **Terminal 2 (Frontend Assets / Vite)**:
  ```bash
  npm run dev
  ```

#### Cara 3: Menggunakan Laravel Herd
Jika Anda menggunakan **Laravel Herd**, cukup jalankan:
```bash
npm run dev
```
Dan buka domain lokal Anda (misalnya `http://monev.test`).

---

### 4. Mengakses Aplikasi

Buka browser dan arahkan ke alamat:
```
http://127.0.0.1:8000
```
atau alamat domain lokal Herd Anda. Silakan login menggunakan salah satu akun pada tabel **User Roles** di atas.

---

## 🛠️ Teknologi yang Digunakan

- **Backend Framework**: [Laravel 13](https://laravel.com) (PHP 8.5/8.2+)
- **Frontend Layer**: [React 19](https://react.dev) dengan [Inertia.js v2](https://inertiajs.com)
- **Styling & UI**: [Tailwind CSS v4](https://tailwindcss.com), [Radix UI](https://www.radix-ui.com), [Lucide React](https://lucide.dev)
- **Role & Permission Management**: [Spatie Laravel Permission](https://spatie.be/docs/laravel-permission)
- **Media & File Handling**: [Spatie Laravel Medialibrary](https://spatie.be/docs/laravel-medialibrary)
- **Audit Trails**: [Spatie Laravel Activitylog](https://spatie.be/docs/laravel-activitylog)

---

## 📬 Kontak & Perizinan

Untuk pengajuan permohonan lisensi, kerja sama, atau pertanyaan lebih lanjut terkait penggunaan sistem ini, silakan menghubungi:

- **Nama**: **LEFI ANDRI LESTARI**
- **Email**: [lefi.andri@kokek.com](mailto:lefi.andri@kokek.com)
- **Perusahaan / Organisasi**: PT KOKEK
