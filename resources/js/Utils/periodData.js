export const internshipPeriods = [
    {
        id: 1,
        name: 'Periode 1',
        rangeLabel: '21 Sep 2026 - 20 Okt 2026',
        startDate: '2026-09-21',
        endDate: '2026-10-20',
        paymentWindow: '20 Oktober 2026 pukul 16.00 WIB - 22 Oktober 2026 pukul 23.59 WIB',
        mentorFocus: 'Fokus minggu ini adalah menyelesaikan wireframe low-fidelity dan memahami integrasi antarmuka React dengan komponen modular.',
        mentorComment: 'Peserta menunjukkan antusiasme yang tinggi dalam memahami arsitektur komponen React dan dasar-dasar wireframing UI/UX. Pertahankan ketepatan waktu pengisian jurnal harian.',
        evalStatus: 'Dinilai',
        paymentStatus: 'Belum siap',
    },
    {
        id: 2,
        name: 'Periode 2',
        rangeLabel: '21 Okt 2026 - 20 Nov 2026',
        startDate: '2026-10-21',
        endDate: '2026-11-20',
        paymentWindow: '20 November 2026 pukul 16.00 WIB - 22 November 2026 pukul 23.59 WIB',
        mentorFocus: 'Fokus pada penyusunan antarmuka responsif dan penerapan design token ke dalam Tailwind CSS.',
        mentorComment: 'Evaluasi perkembangan untuk Periode 2 akan diisi oleh mentor pada akhir periode.',
        evalStatus: 'Belum Diisi',
        paymentStatus: 'Belum dibuka',
    },
    {
        id: 3,
        name: 'Periode 3',
        rangeLabel: '21 Nov 2026 - 20 Des 2026',
        startDate: '2026-11-21',
        endDate: '2026-12-20',
        paymentWindow: '20 Desember 2026 pukul 16.00 WIB - 22 Desember 2026 pukul 23.59 WIB',
        mentorFocus: 'Pengembangan pustaka komponen reusable dan pengelolaan alur form yang kompleks.',
        mentorComment: 'Evaluasi perkembangan untuk Periode 3 akan diisi oleh mentor pada akhir periode.',
        evalStatus: 'Belum Diisi',
        paymentStatus: 'Belum dibuka',
    },
    {
        id: 4,
        name: 'Periode 4',
        rangeLabel: '21 Des 2026 - 20 Jan 2027',
        startDate: '2026-12-21',
        endDate: '2027-01-20',
        paymentWindow: '20 Januari 2027 pukul 16.00 WIB - 22 Januari 2027 pukul 23.59 WIB',
        mentorFocus: 'Uji keterpakaian antarmuka (usability testing) dan iterasi perbaikan berdasarkan feedback mentor.',
        mentorComment: 'Evaluasi perkembangan untuk Periode 4 akan diisi oleh mentor pada akhir periode.',
        evalStatus: 'Belum Diisi',
        paymentStatus: 'Belum dibuka',
    },
    {
        id: 5,
        name: 'Periode 5',
        rangeLabel: '21 Jan 2027 - 20 Feb 2027',
        startDate: '2027-01-21',
        endDate: '2027-02-20',
        paymentWindow: '20 Februari 2027 pukul 16.00 WIB - 22 Februari 2027 pukul 23.59 WIB',
        mentorFocus: 'Penyusunan prototipe final berkemampuan tinggi (high-fidelity) dan optimasi interaksi mikro.',
        mentorComment: 'Evaluasi perkembangan untuk Periode 5 akan diisi oleh mentor pada akhir periode.',
        evalStatus: 'Belum Diisi',
        paymentStatus: 'Belum dibuka',
    },
    {
        id: 6,
        name: 'Periode 6',
        rangeLabel: '21 Feb 2027 - 20 Mar 2027',
        startDate: '2027-02-21',
        endDate: '2027-03-20',
        paymentWindow: '20 Maret 2027 pukul 16.00 WIB - 22 Maret 2027 pukul 23.59 WIB',
        mentorFocus: 'Finalisasi portofolio magang, laporan akhir program, dan persiapan presentasi evaluasi akhir.',
        mentorComment: 'Evaluasi perkembangan akhir program magang oleh mentor.',
        evalStatus: 'Belum Diisi',
        paymentStatus: 'Belum dibuka',
    },
];

export const availableBidang = [
    'UI/UX Designer',
    'Frontend Developer',
    'Backend Developer',
    'Mobile Developer',
    'Quality Assurance (QA)',
    'Digital Marketing',
];

export const curriculumByBidang = {
    'UI/UX Designer': {
        1: [
            { type: 'Teori', title: 'Orientasi program, budaya kerja digital, K3/perilaku kerja aman, etika profesional, pengenalan produk dan alur kerja tim', description: 'Peserta mampu memahami tujuan magang, aturan perusahaan, hak dan kewajiban, struktur tim, cara komunikasi kerja, keselamatan kerja dasar, etika penggunaan data, serta alur kerja produk digital.', days: '5 hari' },
            { type: 'Praktik', title: 'Dasar UI/UX: design thinking, prinsip UX, riset pengguna, identifikasi masalah, persona, dan user journey', description: 'Peserta mampu mempelajari tahapan empati, definisi masalah, ideasi, prototyping, dan testing. Output berupa rumusan masalah, target pengguna, persona, serta user journey produk digital.', days: '5 hari' },
            { type: 'Praktik', title: 'Arsitektur informasi, user flow, wireframe low-fidelity, prinsip layout, hierarki visual, dan usability', description: 'Peserta mampu menyusun struktur halaman, alur navigasi, sketsa wireframe, dan rancangan low-fidelity. Fokus pada kemudahan penggunaan dan hierarki visual.', days: '5 hari' },
            { type: 'Praktik', title: 'Dasar Frontend: HTML5 semantik, struktur halaman web, pengantar CSS, aksesibilitas dasar, dan penggunaan editor kode', description: 'Peserta mampu membuat halaman web dari struktur HTML semantik, stylesheet dasar, dan prinsip aksesibilitas web.', days: '5 hari' },
        ],
        2: [
            { type: 'Teori', title: 'Prinsip Desain Visual Lanjutan & Tipografi Digital', description: 'Memahami skala tipografi, hierarki kontras visual, konsistensi warna antarmuka, dan penerapan moodboard dalam proyek nyata.', days: '5 hari' },
            { type: 'Praktik', title: 'Desain Komponen Modular di Figma (Auto-layout & Variants)', description: 'Menyusun sistem button, form inputs, card, dan modal dengan memanfaatkan varian cerdas serta tokens visual.', days: '5 hari' },
            { type: 'Praktik', title: 'Penerapan React Dasar: JSX, Props, dan State Sederhana', description: 'Mengimplementasikan slicing antarmuka Figma ke komponen React yang rapi, terstruktur, dan modular.', days: '5 hari' },
            { type: 'Praktik', title: 'Styling Modern: Integrasi CSS Grid & Tailwind Framework', description: 'Membangun layout antarmuka dashboard yang adaptif untuk berbagai ukuran layar mobile dan desktop.', days: '5 hari' },
        ],
        3: [
            { type: 'Teori', title: 'Arsitektur Design System Skala Industri', description: 'Konvensi penamaan token desain, dokumentasi komponen antarmuka, dan manajemen versi aset visual tim.', days: '5 hari' },
            { type: 'Praktik', title: 'Pengembangan Pustaka Komponen UI yang Reusable', description: 'Membuat paket komponen navigasi, modal, tabel data interaktif, dan feedback notifikasi.', days: '5 hari' },
            { type: 'Praktik', title: 'Manajemen Alur Kerja Formulir & Validasi Kompleks', description: 'Menangani form input multi-langkah, penanganan error validasi realtime, dan interaksi yang intuitif bagi pengguna.', days: '5 hari' },
            { type: 'Praktik', title: 'Integrasi Data Dinamis: Mock API & State Asynchronous', description: 'Mengambil data dari endpoint API, menampilkan skeleton loader, dan penanganan status kosong (empty states).', days: '5 hari' },
        ],
        4: [
            { type: 'Teori', title: 'Metodologi Pengujian Keterpakaian (Usability Testing)', description: 'Menyusun skenario pengetesan, metrik SUS (System Usability Scale), dan panduan wawancara pengguna.', days: '5 hari' },
            { type: 'Praktik', title: 'Prototyping Berkemampuan Tinggi & Animasi Mikro', description: 'Membuat prototipe interaktif dengan transisi mulus di Figma dan CSS animations untuk pengalaman pengguna yang menyenangkan.', days: '5 hari' },
            { type: 'Praktik', title: 'Pelaksanaan Usability Testing & Analisis Temuan', description: 'Menguji prototipe kepada calon pengguna, mencatat hambatan, dan memetakan prioritas perbaikan.', days: '5 hari' },
            { type: 'Praktik', title: 'Iterasi Desain Berdasarkan Masukan Pengguna', description: 'Melakukan revisi antarmuka sesuai hasil tes dan memvalidasi kembali kejelasan informasi.', days: '5 hari' },
        ],
        5: [
            { type: 'Teori', title: 'Aksesibilitas Web (WCAG 2.1) & Standar Inklusif', description: 'Memastikan rasio kontras warna memadai, navigasi keyboard berfungsi, dan screen reader didukung.', days: '5 hari' },
            { type: 'Praktik', title: 'Desain Responsif Komprehensif & Edge Cases', description: 'Menangani kondisi tampilan ekstrim, text truncation, penanganan error jaringan, dan status offline.', days: '5 hari' },
            { type: 'Praktik', title: 'Audit Performa Antarmuka & Optimasi Aset Grafis', description: 'Mengompresi aset gambar, menerapkan format modern WebP/SVG, dan meminimalkan pergeseran tata letak (CLS).', days: '5 hari' },
            { type: 'Praktik', title: 'Penyusunan Dokumentasi Handoff untuk Developer', description: 'Membuat panduan spesifikasi piksel, perilaku interaksi, status hover/focus/active, dan aset siap ekspor.', days: '5 hari' },
        ],
        6: [
            { type: 'Teori', title: 'Etika Profesional Desainer & Kolaborasi Lintas Tim', description: 'Review pengalaman magang, komunikasi strategis dengan stakeholder, dan persiapan karier industri digital.', days: '5 hari' },
            { type: 'Praktik', title: 'Penyusunan Portofolio Studi Kasus Magang', description: 'Mendokumentasikan proses dari riset, eksplorasi ide, tantangan, solusi desain, hingga hasil dampak proyek.', days: '5 hari' },
            { type: 'Praktik', title: 'Penyelesaian Laporan Akhir Program Magang', description: 'Menyusun laporan capaian pembelajaran, refleksi diri, dan testimoni pengalaman magang di perusahaan.', days: '5 hari' },
            { type: 'Praktik', title: 'Presentasi Hasil Magang kepada Mentor & Tim Manajemen', description: 'Mempresentasikan hasil karya akhir, mendemonstrasikan prototipe fungsional, dan menerima evaluasi komprehensif.', days: '5 hari' },
        ],
    },
    'Frontend Developer': {
        1: [
            { type: 'Teori', title: 'Orientasi Rekayasa Perangkat Lunak, Git & Version Control, serta Standar Kode Bersih', description: 'Memahami prinsip Git branching (feature, staging, main), pull requests, serta konvensi penulisan kode terstruktur.', days: '5 hari' },
            { type: 'Praktik', title: 'HTML5 Semantik, Aksesibilitas Web (WCAG), dan Modern CSS (Flexbox & CSS Grid)', description: 'Membangun struktur dokumen halaman web yang ramah SEO, screen reader, dan responsif lintas ukuran viewport.', days: '5 hari' },
            { type: 'Praktik', title: 'JavaScript Modern (ES6+): Asynchronous, Promises, Fetch API, dan DOM Manipulation', description: 'Menerapkan async/await, modularisasi kode, penanganan error HTTP, dan manipulasi antarmuka dinamis.', days: '5 hari' },
            { type: 'Praktik', title: 'Tooling Frontend Modern: Penggunaan Node.js, Vite Bundler, dan Konfigurasi Linting', description: 'Mengatur alur build frontend modern, Hot Module Replacement (HMR), dan konfigurasi ESLint/Prettier.', days: '5 hari' },
        ],
        2: [
            { type: 'Teori', title: 'Fundamental Arsitektur Komponen & Paradigma Reaktif', description: 'Memahami virtual DOM, unidirectional data flow, siklus hidup komponen, dan immutability state.', days: '5 hari' },
            { type: 'Praktik', title: 'Pengembangan Komponen React: JSX, Props, State Hooks (useState, useEffect)', description: 'Mengembangkan komponen antarmuka yang independen, reusable, dan memiliki state lokal terkelola.', days: '5 hari' },
            { type: 'Praktik', title: 'Penerapan Tailwind CSS & Desain Sistem Modular', description: 'Membangun UI yang konsisten menggunakan utilitas Tailwind, konfigurasi tema kustom, dan class merging.', days: '5 hari' },
            { type: 'Praktik', title: 'Slicing Halaman Dashboard Interaktif dari Desain Figma', description: 'Mengonversi layout Figma ke antarmuka React dengan tingkat presisi tinggi (pixel-perfect) dan adaptif.', days: '5 hari' },
        ],
        3: [
            { type: 'Teori', title: 'Manajemen State Kompleks & Komunikasi Data Antar Komponen', description: 'Memahami context API, prop drilling prevention, dan strategi pengelompokan state global vs lokal.', days: '5 hari' },
            { type: 'Praktik', title: 'Integrasi RESTful API menggunakan Axios & Penanganan Loading/Error States', description: 'Mengambil, mengirim, memperbarui data dari backend serta menyajikan skeleton loader yang nyaman.', days: '5 hari' },
            { type: 'Praktik', title: 'Manajemen Formulir Kompleks & Validasi Skema Interaktif', description: 'Menangani form input dinamis, validasi error seketika, dan pencegahan submit ganda dengan status loading.', days: '5 hari' },
            { type: 'Praktik', title: 'Integrasi Pustaka Antarmuka: Modal, Toast Notifikasi, & Dropdown Pintar', description: 'Menerapkan komponen interaktif tingkat lanjut seperti dialog modal, portal, dan toast feedback.', days: '5 hari' },
        ],
        4: [
            { type: 'Teori', title: 'Optimasi Performa Web Frontend & Core Web Vitals', description: 'Mempelajari teknik code-splitting, lazy loading komponen, optimasi render, dan analisis bundle size.', days: '5 hari' },
            { type: 'Praktik', title: 'State Management Global (Zustand / Redux Toolkit) & Caching Data', description: 'Mengatur central store aplikasi yang skalabel, sinkronisasi state antar tab, dan persistensi sesi.', days: '5 hari' },
            { type: 'Praktik', title: 'Implementasi Fitur Filter Realtime, Pencarian, & Pagination Data', description: 'Membangun navigasi dataset tabel dinamis dengan debounce search, multiselect, dan sorting.', days: '5 hari' },
            { type: 'Praktik', title: 'Pengujian Unit Komponen menggunakan Vitest & Testing Library', description: 'Menulis skenario pengetesan unit untuk komponen penting dan memastikan keandalan interaksi user.', days: '5 hari' },
        ],
        5: [
            { type: 'Teori', title: 'Arsitektur Single Page Application (SPA) Modern & Keamanan Frontend', description: 'Memahami mitigasi celah XSS, sanitasi input, token JWT / cookie security, dan routing SPA.', days: '5 hari' },
            { type: 'Praktik', title: 'Integrasi Inertia.js / Next.js dengan Backend Framework', description: 'Menghubungkan frontend React secara mulus dengan controller backend tanpa overhead duplikasi API.', days: '5 hari' },
            { type: 'Praktik', title: 'Visualisasi Data Menggunakan Diagram & Chart Interaktif', description: 'Menampilkan data analitik dan statistik menggunakan pustaka chart modern yang responsif.', days: '5 hari' },
            { type: 'Praktik', title: 'Penanganan Kondisi Ekstrim (Offline Mode, Timeout, & Fallback UI)', description: 'Menampilkan halaman penanganan koneksi terputus dan boundary error komprehensif.', days: '5 hari' },
        ],
        6: [
            { type: 'Teori', title: 'Workflow Kolaborasi Agile/Scrum & Kesiapan Karir Rekayasa Frontend', description: 'Pemahaman sprint planning, code review etiquette, semantic commit messages, dan komunikasi tim.', days: '5 hari' },
            { type: 'Praktik', title: 'Audit Kualitas Kode, Optimasi Bundling Produksi, & Deployment Cloud', description: 'Melakukan build produksi teroptimasi, pengecekan Lighthouse score di atas 90, dan deployment.', days: '5 hari' },
            { type: 'Praktik', title: 'Penyusunan Dokumentasi Teknis Kode & Portofolio Proyek Magang', description: 'Menyusun dokumentasi arsitektur frontend, panduan instalasi repo, dan demo langsung karya magang.', days: '5 hari' },
            { type: 'Praktik', title: 'Presentasi Hasil Proyek kepada Mentor & Manajemen Perusahaan', description: 'Mempresentasikan fungsionalitas aplikasi web secara langsung dan menanggapi evaluasi teknis mentor.', days: '5 hari' },
        ],
    },
    'Backend Developer': {
        1: [
            { type: 'Teori', title: 'Arsitektur Client-Server, Protokol HTTP, dan Alur Kerja Framework Backend', description: 'Memahami konsep request-response cycle, HTTP methods, headers, status codes, dan struktur MVC.', days: '5 hari' },
            { type: 'Praktik', title: 'Setup Lingkungan Pengembangan Lokal (Herd/Docker) & Ekosistem PHP/Laravel', description: 'Konfigurasi PHP modern, Composer dependency manager, environment file (.env), dan instalasi proyek.', days: '5 hari' },
            { type: 'Praktik', title: 'Routing, Middleware Kustom, dan Controller Dasar', description: 'Mendefinisikan endpoint web & API, middleware proteksi request, dan pemisahan logika controller.', days: '5 hari' },
            { type: 'Praktik', title: 'Version Control Git: Branching, Merge Conflict Resolution, & Standar PSR', description: 'Menerapkan alur Git kolaboratif dan standar penulisan kode PHP Standards Recommendations (PSR-12).', days: '5 hari' },
        ],
        2: [
            { type: 'Teori', title: 'Desain Basis Data Relasional, Normalisasi (1NF-3NF), dan Integritas Data', description: 'Prinsip relasi foreign key, indeks kolom, constraint unik, dan pencegahan redundansi data.', days: '5 hari' },
            { type: 'Praktik', title: 'Migrasi Database, Seeder, dan Factory pada Framework Laravel', description: 'Menyusun skema database terversi secara otomatis dan membuat data dummy skala besar untuk pengujian.', days: '5 hari' },
            { type: 'Praktik', title: 'Penguasaan ORM Eloquent: Relasi Satu-ke-Satu, Satu-ke-Banyak, dan Banyak-ke-Banyak', description: 'Mengimplementasikan relasi database yang rapi, eager loading untuk mengatasi N+1 query problem.', days: '5 hari' },
            { type: 'Praktik', title: 'Pembuatan CRUD Kompleks dengan Form Request Validation', description: 'Memproses input formulir transaksional dengan aturan validasi ketat dan pesan error informatif.', days: '5 hari' },
        ],
        3: [
            { type: 'Teori', title: 'Standar Arsitektur RESTful API & Keamanan Endpoint', description: 'Konvensi payload JSON, standardisasi respon API (success, error), dan status code yang tepat.', days: '5 hari' },
            { type: 'Praktik', title: 'Membangun Layanan RESTful API Lengkap dengan API Resource Transformer', description: 'Membuat endpoint terstruktur untuk konsumsi aplikasi web dan mobile dengan response transformer.', days: '5 hari' },
            { type: 'Praktik', title: 'Sistem Autentikasi Token & Manajemen Hak Akses Role (RBAC)', description: 'Menerapkan otentikasi aman (Sanctum/Session) dan pembatasan hak akses berbasis peran (Admin, Mentor, Peserta).', days: '5 hari' },
            { type: 'Praktik', title: 'Pengujian Endpoint API dengan Postman & Dokumentasi Swagger/OpenAPI', description: 'Menyusun koleksi pengetesan otomatis di Postman dan dokumentasi endpoint interaktif.', days: '5 hari' },
        ],
        4: [
            { type: 'Teori', title: 'Transaksi Basis Data ACID & Pengelolaan Antrian Asinkron', description: 'Menjaga konsistensi data finansial/presensi menggunakan DB transaction dan pemrosesan antrian latar belakang.', days: '5 hari' },
            { type: 'Praktik', title: 'Optimasi Kinerja Query, Indexing Database, dan Caching (Redis/Memcached)', description: 'Menganalisis query lambat, menambahkan indeks yang tepat, dan mempercepat pembacaan data via cache.', days: '5 hari' },
            { type: 'Praktik', title: 'Implementasi Background Jobs, Queue Workers, dan Scheduled Task Cron', description: 'Menjalankan tugas berat seperti export data, pengiriman notifikasi massal, dan cron penjadwalan.', days: '5 hari' },
            { type: 'Praktik', title: 'Manajemen Penyimpanan Berkas & Optimasi Upload Media', description: 'Menyimpan berkas foto/dokumen peserta, validasi MIME type, kompresi berkas, dan public asset link.', days: '5 hari' },
        ],
        5: [
            { type: 'Teori', title: 'Standar Keamanan Backend (OWASP Top 10) & Audit Trail', description: 'Mitigasi SQL Injection, CSRF, Mass Assignment, Rate Limiting, serta pencatatan audit log aktivitas.', days: '5 hari' },
            { type: 'Praktik', title: 'Automated Testing Backend: Unit Testing & Feature Testing dengan PHPUnit', description: 'Menulis tes otomatis untuk alur bisnis penting seperti perhitungan presensi dan penilaian evaluasi.', days: '5 hari' },
            { type: 'Praktik', title: 'Sistem Logging Terstruktur & Notifikasi Kejadian Sistem Realtime', description: 'Mencatat log error secara terpusat, pengiriman alert error, dan push notification ke user.', days: '5 hari' },
            { type: 'Praktik', title: 'Integrasi Webhook & Layanan Pihak Ketiga', description: 'Menghubungkan backend dengan penyedia layanan eksternal (email SMTP, storage cloud, dsb.).', days: '5 hari' },
        ],
        6: [
            { type: 'Teori', title: 'Clean Architecture, SOLID Principles, dan Repository/Service Pattern', description: 'Memisahkan bisnis logic dari controller untuk kode yang mudah dirawat dalam jangka panjang.', days: '5 hari' },
            { type: 'Praktik', title: 'Persiapan Deployment Server Produksi & Konfigurasi CI/CD Pipeline', description: 'Menyiapkan environment produksi, migrasi aman tanpa downtime, dan optimasi konfigurasi Laravel.', days: '5 hari' },
            { type: 'Praktik', title: 'Penyusunan Dokumentasi Arsitektur Backend & Portofolio Hasil Kerja', description: 'Mendokumentasikan skema ERD basis data, diagram alur sistem, dan laporan pencapaian proyek.', days: '5 hari' },
            { type: 'Praktik', title: 'Presentasi dan Uji Kelaikan Sistem Backend kepada Mentor', description: 'Mendemonstrasikan keandalan API, keamanan, performa backend, dan menerima evaluasi komprehensif.', days: '5 hari' },
        ],
    },
    'Mobile Developer': {
        1: [
            { type: 'Teori', title: 'Pengenalan Ekosistem Mobile, SDK, dan Panduan Desain OS (Material & HIG)', description: 'Memahami arsitektur aplikasi mobile, perbedaan platform Android vs iOS, dan alur siklus hidup aplikasi.', days: '5 hari' },
            { type: 'Praktik', title: 'Setup Environment Flutter / React Native & Emulator Pengujian', description: 'Konfigurasi SDK, emulator Android, simulator iOS, dan pembuatan aplikasi starter pertama.', days: '5 hari' },
            { type: 'Praktik', title: 'Dasar Pemrograman Bahasa (Dart / Modern JavaScript)', description: 'Penguasaan tipe data, null safety, asynchronous programming, dan manipulasi data koleksi.', days: '5 hari' },
            { type: 'Praktik', title: 'Version Control Git untuk Proyek Mobile & Struktur Folder Bersih', description: 'Mengatur struktur direktori arsitektur fitur (screens, widgets/components, models, services).', days: '5 hari' },
        ],
        2: [
            { type: 'Teori', title: 'Prinsip Tata Letak Antarmuka Mobile & Hierarki Layar', description: 'Memahami safe area, adaptasi orientasi, responsivitas ukuran layar hp dan tablet.', days: '5 hari' },
            { type: 'Praktik', title: 'Pembuatan Komponen UI Mobile Kustom (Card, Form, Button, Appbar)', description: 'Membangun antarmuka yang menarik dengan styling konsisten dan interaksi sentuhan yang mulus.', days: '5 hari' },
            { type: 'Praktik', title: 'Navigasi Multi-Halaman & Alur Otentikasi Pengguna', description: 'Menerapkan stack navigation, bottom navigation bar, dan penanganan status login/logout.', days: '5 hari' },
            { type: 'Praktik', title: 'Slicing Desain Figma Mobile ke Aplikasi Nyata', description: 'Mengonversi rancangan antarmuka Figma dengan fidelity tinggi ke komponen mobile interaktif.', days: '5 hari' },
        ],
        3: [
            { type: 'Teori', title: 'Manajemen State Aplikasi Mobile & Arsitektur Aliran Data', description: 'Memahami pola Provider, Riverpod, Bloc, atau Redux pada ekosistem mobile.', days: '5 hari' },
            { type: 'Praktik', title: 'Integrasi Layanan RESTful API dengan Protokol HTTP/Dio', description: 'Mengambil data dari backend, mapping JSON ke Model objek strongly-typed, dan penanganan timeout.', days: '5 hari' },
            { type: 'Praktik', title: 'Penanganan Status Loading, Error Screen, dan Pull-to-Refresh', description: 'Meningkatkan UX saat memuat data dengan animasi shimmer/skeleton dan opsi refresh interaktif.', days: '5 hari' },
            { type: 'Praktik', title: 'Manajemen Validasi Formulir Mobile & Keyboard Handling', description: 'Mencegah keyboard menutupi input teks, format input masker, dan validasi seketika.', days: '5 hari' },
        ],
        4: [
            { type: 'Teori', title: 'Penyimpanan Data Lokal & Strategi Offline-First', description: 'Memahami SQLite, SharedPreferences/AsyncStorage, dan sinkronisasi data lokal ke server.', days: '5 hari' },
            { type: 'Praktik', title: 'Implementasi Database Lokal untuk Akses Tanpa Koneksi Internet', description: 'Menyimpan riwayat presensi dan materi kurikulum secara offline agar tetap dapat dibuka saat minim sinyal.', days: '5 hari' },
            { type: 'Praktik', title: 'Akses Fitur Perangkat (Kamera, Lokasi GPS, & Galeri Foto)', description: 'Mengambil foto bukti presensi atau avatar langsung dari kamera perangkat dengan izin resmi.', days: '5 hari' },
            { type: 'Praktik', title: 'Penerapan Notifikasi Lokal (Local Push Notifications)', description: 'Mengirimkan pengingat jam presensi dan pengumuman baru melalui sistem notifikasi OS.', days: '5 hari' },
        ],
        5: [
            { type: 'Teori', title: 'Optimasi Kinerja Aplikasi Mobile & Profiling Memori', description: 'Mencegah memory leak, optimasi rendering list panjang (lazy builder), dan reduksi ukuran APK/AAB.', days: '5 hari' },
            { type: 'Praktik', title: 'Integrasi Cloud Push Notifications (Firebase Cloud Messaging)', description: 'Menghubungkan aplikasi mobile dengan push notification server untuk notifikasi pengumuman instan.', days: '5 hari' },
            { type: 'Praktik', title: 'Pengujian Aplikasi: Unit Test & Widget/Component Testing', description: 'Menulis tes otomatis untuk logika bisnis dan interaksi tombol penting pada aplikasi mobile.', days: '5 hari' },
            { type: 'Praktik', title: 'Penanganan Deep Linking & Keamanan Penyimpanan Kredensial', description: 'Menyimpan token autentikasi di Secure Storage perangkat dan mendukung navigasi link langsung.', days: '5 hari' },
        ],
        6: [
            { type: 'Teori', title: 'Panduan Publikasi Google Play Store & Apple App Store', description: 'Memahami syarat kebijakan privasi, pembuatan screenshot toko, dan review guidelines.', days: '5 hari' },
            { type: 'Praktik', title: 'Pembuatan Build Rilis Produksi (Keystore Signing, Obfuscation, & ProGuard)', description: 'Menghasilkan berkas APK/AAB yang ditandatangani secara aman dan siap dipublikasikan.', days: '5 hari' },
            { type: 'Praktik', title: 'Penyusunan Dokumentasi Teknis Aplikasi & Portofolio Mobile', description: 'Menyusun dokumentasi arsitektur, panduan konfigurasi API, dan rekap fitur dalam portofolio.', days: '5 hari' },
            { type: 'Praktik', title: 'Presentasi dan Uji Fungsional Aplikasi Mobile di Hadapan Mentor', description: 'Mendemonstrasikan aplikasi secara live di perangkat fisik dan evaluasi capaian akhir program.', days: '5 hari' },
        ],
    },
    'Quality Assurance (QA)': {
        1: [
            { type: 'Teori', title: 'Fundamental Software Quality Assurance, SDLC, dan STLC', description: 'Memahami peran QA dalam siklus pengembangan, perbedaan verifikasi vs validasi, dan piramida testing.', days: '5 hari' },
            { type: 'Praktik', title: 'Analisis Dokumen Kebutuhan (PRD) & Identifikasi Kriteria Penerimaan', description: 'Menganalisis spesifikasi kebutuhan sistem untuk menemukan potensi ambiguitas dan celah logika.', days: '5 hari' },
            { type: 'Praktik', title: 'Penyusunan Rencana Pengujian (Test Plan) & Matriks Cakupan Pengujian', description: 'Merancang cakupan pengujian modul presensi, kurikulum, dan evaluasi magang.', days: '5 hari' },
            { type: 'Praktik', title: 'Version Control Git & Manajemen Tiket Issue (Jira/Trello/GitHub)', description: 'Menggunakan papan manajemen isu untuk pelacakan alur kerja defect dari status open hingga verified.', days: '5 hari' },
        ],
        2: [
            { type: 'Teori', title: 'Metodologi Black Box Testing: Equivalence Partitioning & Boundary Value Analysis', description: 'Memahami teknik penentuan nilai uji batas ekstrim untuk menemukan kegagalan sistem tersembunyi.', days: '5 hari' },
            { type: 'Praktik', title: 'Perancangan Test Cases Komprehensif (Positif & Negatif)', description: 'Menulis langkah pengujian terperinci dengan hasil yang diharapkan untuk fitur otentikasi dan form.', days: '5 hari' },
            { type: 'Praktik', title: 'Penyusunan Laporan Defect/Bug Standar Industri', description: 'Menulis bug report yang jelas dengan severity, priority, langkah reproduksi, dan tangkapan layar bukti.', days: '5 hari' },
            { type: 'Praktik', title: 'Pelaksanaan Pengujian Manual Antarmuka Dashboard Peserta & Mentor', description: 'Melakukan pengujian eksploratori terhadap fitur kehadiran, filter data, dan kelayakan UI.', days: '5 hari' },
        ],
        3: [
            { type: 'Teori', title: 'Pengujian Layanan Web API: Arsitektur REST & Standar Protokol', description: 'Memahami struktur request, header authorization, payload JSON, dan kode status respons HTTP.', days: '5 hari' },
            { type: 'Praktik', title: 'Automated API Testing menggunakan Postman Collections & Newman CLI', description: 'Membuat kumpulan skenario uji API CRUD dengan assert skrip otomatis untuk verifikasi skema respon.', days: '5 hari' },
            { type: 'Praktik', title: 'Pengujian Validasi Form & Penanganan Error Backend', description: 'Menguji ketahanan sistem saat menerima data input kosong, format tidak valid, atau karakter khusus.', days: '5 hari' },
            { type: 'Praktik', title: 'Pengujian Keamanan Hak Akses (Role-Based Access Testing)', description: 'Memastikan peserta tidak dapat mengakses endpoint verifikasi mentor atau tindakan admin.', days: '5 hari' },
        ],
        4: [
            { type: 'Teori', title: 'Pengantar Otomasi Pengujian Antarmuka Web (UI Automation Testing)', description: 'Memahami kapan otomasi diperlukan, selector strategi (XPath/CSS), dan pemeliharaan skrip uji.', days: '5 hari' },
            { type: 'Praktik', title: 'Setup Framework Otomasi Pengujian (Playwright / Cypress)', description: 'Menginstal dan mengonfigurasi framework otomasi pengujian browser modern berbasis JavaScript/Node.js.', days: '5 hari' },
            { type: 'Praktik', title: 'Penulisan Skrip Otomasi Pengujian Alur Login & Submit Presensi', description: 'Membuat skrip uji otomatis yang membuka browser, mengisi form, dan memvalidasi teks sukses.', days: '5 hari' },
            { type: 'Praktik', title: 'Penerapan Page Object Model (POM) untuk Skrip Uji yang Reusable', description: 'Mendesain arsitektur kode otomasi yang rapi dan mudah dirawat saat terjadi perubahan antarmuka.', days: '5 hari' },
        ],
        5: [
            { type: 'Teori', title: 'Pengujian Regresi, Pengujian Lintas Browser, & Kompatibilitas Mobile', description: 'Memastikan fitur yang sudah ada tidak rusak akibat penambahan kode baru pada update versi.', days: '5 hari' },
            { type: 'Praktik', title: 'Pelaksanaan Pengujian Lintas Peramban (Chrome, Firefox, Safari/WebKit)', description: 'Menjalankan skrip uji pada berbagai mesin browser dan resolusi layar mobile/desktop.', days: '5 hari' },
            { type: 'Praktik', title: 'Pengujian Performa Dasar Menggunakan Lighthouse & K6/JMeter', description: 'Mengukur waktu respon halaman, First Contentful Paint, dan ketahanan terhadap beban akses bersamaan.', days: '5 hari' },
            { type: 'Praktik', title: 'Penyusunan Log Aktivitas Uji & Integrasi Laporan HTML Otomatis', description: 'Menghasilkan laporan visual hasil eksekusi tes otomatis dengan rekaman video dan jejak error.', days: '5 hari' },
        ],
        6: [
            { type: 'Teori', title: 'Integrasi QA dalam Pipeline CI/CD & Budaya Kualitas Tim Rekayasa', description: 'Menjalankan otomasi pengujian otomatis setiap ada pull request di GitHub Actions.', days: '5 hari' },
            { type: 'Praktik', title: 'Audit Kualitas Menyeluruh Sistem Monev Magang', description: 'Melakukan pengetesan akhir secara menyeluruh dari alur admin, mentor, hingga peserta.', days: '5 hari' },
            { type: 'Praktik', title: 'Penyusunan Laporan Ringkasan Kualitas Akhir (Test Summary Report)', description: 'Menyusun rekapitulasi jumlah test cases, metrik bug yang terselesaikan, dan rekomendasi rilis.', days: '5 hari' },
            { type: 'Praktik', title: 'Presentasi Hasil Penjaminan Mutu Perangkat Lunak kepada Mentor', description: 'Mendemonstrasikan eksekusi otomasi uji dan memaparkan laporan kualitas sistem kepada mentor.', days: '5 hari' },
        ],
    },
    'Digital Marketing': {
        1: [
            { type: 'Teori', title: 'Fondasi Pemasaran Digital, Riset Pasar, dan Buyer Persona', description: 'Memahami lanskap industri digital, saluran akuisisi, segmentasi audiens, dan analisis kompetitor.', days: '5 hari' },
            { type: 'Praktik', title: 'Penyusunan Profil Persona Pelanggan Ideal & Pemetaan Customer Journey', description: 'Menyusun profil target konsumen digital lengkap dengan pain points, motivasi, dan perilaku konsumsi.', days: '5 hari' },
            { type: 'Praktik', title: 'Audit Saluran Digital & Analisis Keberadaan Merek di Internet', description: 'Mengevaluasi performa media sosial, website, dan jejak digital perusahaan saat ini.', days: '5 hari' },
            { type: 'Praktik', title: 'Penetapan Metrik Kunci (KPI): Reach, Engagement, CTR, CAC, dan ROI', description: 'Menentukan indikator keberhasilan kampanye kuantitatif yang terukur untuk proyek magang.', days: '5 hari' },
        ],
        2: [
            { type: 'Teori', title: 'Strategi Pemasaran Konten (Content Marketing) & Prinsip Copywriting Persuasif', description: 'Memahami formula copywriting (AIDA, PAS), tone of voice merek, dan kalender editorial.', days: '5 hari' },
            { type: 'Praktik', title: 'Penyusunan Rencana Kalender Konten Media Sosial Bulanan', description: 'Membuat jadwal posting konten tematik untuk Instagram, LinkedIn, dan platform digital lainnya.', days: '5 hari' },
            { type: 'Praktik', title: 'Pembuatan Aset Konten Visual & Penulisan Salinan Iklan yang Menarik', description: 'Membuat visual konten menggunakan alat bantu desain dan menulis caption yang mendorong interaksi.', days: '5 hari' },
            { type: 'Praktik', title: 'Dasar Search Engine Optimization (SEO On-Page & Riset Kata Kunci)', description: 'Melakukan riset kata kunci potensial, optimasi meta tags, dan struktur artikel blog informatif.', days: '5 hari' },
        ],
        3: [
            { type: 'Teori', title: 'Ekosistem Periklanan Berbayar (Meta Ads & Google Ads)', description: 'Memahami struktur kampanye iklan, strategi penawaran (bidding), dan penargetan demografi/minat.', days: '5 hari' },
            { type: 'Praktik', title: 'Konfigurasi Akun Pengelola Bisnis (Meta Business Suite / Google Ads Manager)', description: 'Menyiapkan pixel pelacakan, audiens khusus (custom audience), dan katalog produk/layanan.', days: '5 hari' },
            { type: 'Praktik', title: 'Perancangan dan Peluncuran Kampanye Iklan Berbayar dengan Anggaran Nyata/Simulasi', description: 'Membuat kampanye iklan dengan variasi visual dan teks untuk menguji respons audiens.', days: '5 hari' },
            { type: 'Praktik', title: 'A/B Testing Salinan Iklan, Gambar, dan Halaman Arahan (Landing Page)', description: 'Menguji elemen kampanye berbeda untuk menemukan kombinasi dengan rasio konversi tertinggi.', days: '5 hari' },
        ],
        4: [
            { type: 'Teori', title: 'Optimasi Corong Konversi (Funnel Marketing) & Strategi Retargeting', description: 'Memahami tahapan Awareness, Consideration, Conversion, hingga Retention pelanggan.', days: '5 hari' },
            { type: 'Praktik', title: 'Penyusunan Alur Email Marketing Otomatis & Buletin Edukatif', description: 'Menyusun urutan email selamat datang, penawaran produk, dan re-engagement menggunakan tools email.', days: '5 hari' },
            { type: 'Praktik', title: 'Audit Kualitas Halaman Arahan (Landing Page) & Peningkatan Rasio Konversi (CRO)', description: 'Menganalisis kemudahan navigasi, kejelasan call-to-action (CTA), dan kecepatan muat halaman promosi.', days: '5 hari' },
            { type: 'Praktik', title: 'Pemasaran Kolaborasi (KOL / Influencer Outreach) & Kemitraan Strategis', description: 'Menyusun kriteria pemilihan influencer yang relevan dan menyusun surat penawaran kerja sama.', days: '5 hari' },
        ],
        5: [
            { type: 'Teori', title: 'Analitika Data Pemasaran Digital & Atribusi Saluran', description: 'Memahami Google Analytics 4 (GA4), pelacakan event, atribusi konversi, dan parameter UTM.', days: '5 hari' },
            { type: 'Praktik', title: 'Konfigurasi Pelacakan Tautan Menggunakan Google Tag Manager & UTM Generator', description: 'Menyiapkan tautan kampanye khusus untuk mengukur performa masing-masing saluran pemasaran.', days: '5 hari' },
            { type: 'Praktik', title: 'Pembangunan Dasbor Laporan Interaktif di Google Looker Studio', description: 'Membuat visualisasi data metrik iklan, pertumbuhan follower, dan konversi dalam satu laporan otomatis.', days: '5 hari' },
            { type: 'Praktik', title: 'Analisis Return on Ad Spend (ROAS) dan Rekomendasi Efisiensi Anggaran', description: 'Mengevaluasi pengeluaran iklan dan memberikan masukan perbaikan penargetan kampanye.', days: '5 hari' },
        ],
        6: [
            { type: 'Teori', title: 'Manajemen Kampanye Pemasaran Terpadu & Tren Digital Terkini', description: 'Mempelajari tren pemasaran berbasis AI, personalisasi konten, dan strategi retensi jangka panjang.', days: '5 hari' },
            { type: 'Praktik', title: 'Penyusunan Rencana Pemasaran Digital Terintegrasi Skala Komprehensif', description: 'Menyusun strategi pemasaran menyeluruh dari riset, alokasi anggaran, hingga proyeksi hasil.', days: '5 hari' },
            { type: 'Praktik', title: 'Penyusunan Laporan Capaian Kampanye & Portofolio Karya Magang', description: 'Mendokumentasikan hasil kampanye, metrik pertumbuhan, dan studi kasus proyek yang berhasil.', days: '5 hari' },
            { type: 'Praktik', title: 'Presentasi Strategi & Evaluasi Capaian Magang kepada Mentor', description: 'Mempresentasikan pencapaian kinerja pemasaran dan menanggapi pertanyaan evaluasi dari mentor.', days: '5 hari' },
        ],
    },
};

export function getCurriculumTemplate(bidang = 'UI/UX Designer', periodId = 1) {
    const normalized = (bidang || 'UI/UX Designer').trim().toLowerCase();
    const key = Object.keys(curriculumByBidang).find(
        (k) => k.toLowerCase() === normalized
    ) || 'UI/UX Designer';

    const p = Number(periodId) || 1;
    return (curriculumByBidang[key] && curriculumByBidang[key][p])
        || curriculumByBidang['UI/UX Designer'][p]
        || curriculumByBidang['UI/UX Designer'][1];
}

export const curriculumByPeriod = curriculumByBidang['UI/UX Designer'];

/**
 * Normalizes completed_modules from any format (array of indices, array of titles, or key-value object)
 * into a standard array of module indices for a given module list.
 */
export function getCompletedModuleIndices(completedModules, modules = []) {
    if (!completedModules) return [];
    const list = Array.isArray(modules) ? modules : [];
    const completedSet = new Set();

    if (Array.isArray(completedModules)) {
        completedModules.forEach((val) => {
            if (typeof val === 'number') {
                completedSet.add(val);
            } else if (!isNaN(Number(val)) && typeof val === 'string' && val.trim() !== '') {
                completedSet.add(Number(val));
            } else if (typeof val === 'string') {
                const foundIdx = list.findIndex((m) => m && m.title === val);
                if (foundIdx !== -1) completedSet.add(foundIdx);
            }
        });
    } else if (typeof completedModules === 'object') {
        Object.keys(completedModules).forEach((key) => {
            if (completedModules[key]) {
                if (!isNaN(Number(key)) && key.trim() !== '') {
                    completedSet.add(Number(key));
                } else {
                    const foundIdx = list.findIndex((m) => m && m.title === key);
                    if (foundIdx !== -1) completedSet.add(foundIdx);
                }
            }
        });
    }

    return Array.from(completedSet);
}

/**
 * Checks whether a module at index `idx` is marked as completed.
 */
export function isModuleCompleted(completedModules, item, idx) {
    if (!completedModules) return false;

    if (Array.isArray(completedModules)) {
        if (completedModules.includes(idx) || completedModules.includes(Number(idx)) || completedModules.includes(String(idx))) {
            return true;
        }
        if (item && item.title && completedModules.includes(item.title)) {
            return true;
        }
        return false;
    }

    if (typeof completedModules === 'object') {
        if (completedModules[idx] || completedModules[String(idx)]) {
            return true;
        }
        if (item && item.title && completedModules[item.title]) {
            return true;
        }
    }

    return false;
}

export function formatIndonesianDate(dateStr) {
    if (!dateStr) return '';
    const months = [
        'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
        'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];
    const parts = dateStr.split('-');
    if (parts.length !== 3) return dateStr;
    const year = parts[0];
    const month = months[parseInt(parts[1], 10) - 1] || parts[1];
    const day = parts[2].padStart(2, '0');
    return `${day} ${month} ${year}`;
}

export function getPeriodWeeks(startStr, endStr, currentDate = '2026-10-13') {
    const [sy, sm, sd] = startStr.split('-').map(Number);
    const [ey, em, ed] = endStr.split('-').map(Number);
    let cur = new Date(Date.UTC(sy, sm - 1, sd));
    const end = new Date(Date.UTC(ey, em - 1, ed));

    const days = [];
    while (cur <= end) {
        const y = cur.getUTCFullYear();
        const m = String(cur.getUTCMonth() + 1).padStart(2, '0');
        const d = String(cur.getUTCDate()).padStart(2, '0');
        const dateStr = `${y}-${m}-${d}`;
        // 0=Sunday in getUTCDay(), so Monday=0, Sunday=6
        const dayOfWeek = (cur.getUTCDay() + 6) % 7;
        days.push({
            day: String(cur.getUTCDate()),
            date: dateStr,
            isWeekend: dayOfWeek === 5 || dayOfWeek === 6,
            isToday: dateStr === currentDate,
            dayOfWeek,
        });
        cur.setUTCDate(cur.getUTCDate() + 1);
    }

    const weeks = [];
    let currentWeek = [];
    // Pad first week with null if start day is not Monday
    const firstDow = days[0].dayOfWeek;
    for (let i = 0; i < firstDow; i++) {
        currentWeek.push(null);
    }

    for (const day of days) {
        currentWeek.push(day);
        if (currentWeek.length === 7) {
            weeks.push(currentWeek);
            currentWeek = [];
        }
    }
    if (currentWeek.length > 0) {
        while (currentWeek.length < 7) {
            currentWeek.push(null);
        }
        weeks.push(currentWeek);
    }
    return weeks;
}
