<?php

namespace Database\Seeders;

use App\Models\Attendance;
use App\Models\User;
use Illuminate\Database\Seeder;

class AttendanceSeeder extends Seeder
{
    public function run(): void
    {
        $peserta = User::where('email', 'peserta@monev.test')->first();
        $mentor = User::where('email', 'mentor@monev.test')->first();

        if (! $peserta) {
            return;
        }

        $records = [
            [
                'date' => '2026-09-21',
                'time' => '16.00 WIB',
                'status' => 'approved',
                'type' => 'Hadir',
                'activity' => 'Orientasi program magang, pengenalan tim dan pengenalan alur kerja produk digital.',
                'learning' => 'Memahami visi produk dan aturan kerja magang.',
                'obstacles' => 'Tidak ada kendala yang dialami.',
                'mentor_id' => $mentor?->id,
                'mentor_note' => 'Awal yang baik, tetap semangat!',
                'verified_at' => '2026-09-21 17:00:00',
            ],
            [
                'date' => '2026-09-22',
                'time' => '16.05 WIB',
                'status' => 'approved',
                'type' => 'Hadir',
                'activity' => 'Setup environment dan tools desain serta workspace tim.',
                'learning' => 'Mempersiapkan tools kolaborasi Figma dan Jira.',
                'obstacles' => 'Tidak ada kendala.',
                'mentor_id' => $mentor?->id,
                'verified_at' => '2026-09-22 17:10:00',
            ],
            [
                'date' => '2026-09-23',
                'time' => '16.12 WIB',
                'status' => 'approved',
                'type' => 'Hadir',
                'activity' => 'Riset pengguna awal dan telaah materi UI/UX dasar.',
                'learning' => 'Prinsip user-centered design dan empati terhadap user.',
                'obstacles' => 'Tidak ada kendala.',
                'mentor_id' => $mentor?->id,
                'verified_at' => '2026-09-23 16:30:00',
            ],
            [
                'date' => '2026-09-24',
                'time' => '15.55 WIB',
                'status' => 'approved',
                'type' => 'Hadir',
                'activity' => 'Penyusunan problem statement dan persona pengguna.',
                'learning' => 'Metode identifikasi masalah utama calon user.',
                'obstacles' => 'Tidak ada kendala.',
                'mentor_id' => $mentor?->id,
                'verified_at' => '2026-09-24 16:20:00',
            ],
            [
                'date' => '2026-09-25',
                'time' => '16.02 WIB',
                'status' => 'approved',
                'type' => 'Hadir',
                'activity' => 'Penyusunan user journey map dan user flow skenario.',
                'learning' => 'Memetakan langkah-langkah user dalam menyelesaikan tugas aplikasi.',
                'obstacles' => 'Tidak ada kendala.',
                'mentor_id' => $mentor?->id,
                'verified_at' => '2026-09-25 17:00:00',
            ],
            [
                'date' => '2026-09-28',
                'time' => '15.58 WIB',
                'status' => 'approved',
                'type' => 'Hadir',
                'activity' => 'Arsitektur informasi, penyusunan sitemap dan navigasi sistem.',
                'learning' => 'Mengatur hierarki informasi secara logis dan mudah dipahami.',
                'obstacles' => 'Tidak ada kendala.',
                'mentor_id' => $mentor?->id,
                'verified_at' => '2026-09-28 16:45:00',
            ],
            [
                'date' => '2026-09-29',
                'time' => '16.10 WIB',
                'status' => 'approved',
                'type' => 'Hadir',
                'activity' => 'Wireframing low-fidelity halaman beranda dan dashboard.',
                'learning' => 'Fokus pada alur dan tata letak sebelum visualisasi warna.',
                'obstacles' => 'Tidak ada kendala.',
                'mentor_id' => $mentor?->id,
                'verified_at' => '2026-09-29 16:30:00',
            ],
            [
                'date' => '2026-09-30',
                'time' => '08.15 WIB',
                'status' => 'approved',
                'type' => 'Izin',
                'activity' => 'Izin mengurus administrasi akademik dan bimbingan kampus.',
                'learning' => 'Komunikasi kerja profesional dan etika perizinan.',
                'obstacles' => 'Ada jadwal sidang pembimbing di kampus.',
                'mentor_id' => $mentor?->id,
                'mentor_note' => 'Izin disetujui. Selesaikan urusan kampus dengan baik.',
                'verified_at' => '2026-09-30 09:00:00',
            ],
            [
                'date' => '2026-10-01',
                'time' => '15.50 WIB',
                'status' => 'approved',
                'type' => 'Hadir',
                'activity' => 'Wireframing low-fidelity form otentikasi login dan registrasi.',
                'learning' => 'Prinsip usability form dan pesan validasi.',
                'obstacles' => 'Tidak ada kendala.',
                'mentor_id' => $mentor?->id,
                'verified_at' => '2026-10-01 16:15:00',
            ],
            [
                'date' => '2026-10-02',
                'time' => '16.00 WIB',
                'status' => 'approved',
                'type' => 'Hadir',
                'activity' => 'Review bersama mentor dan perbaikan struktur wireframe.',
                'learning' => 'Menyerap feedback perbaikan layout.',
                'obstacles' => 'Tidak ada kendala.',
                'mentor_id' => $mentor?->id,
                'verified_at' => '2026-10-02 17:00:00',
            ],
            [
                'date' => '2026-10-05',
                'time' => '15.54 WIB',
                'status' => 'approved',
                'type' => 'Hadir',
                'activity' => 'Dasar Frontend: HTML5 semantik dan struktur layout halaman.',
                'learning' => 'Pemanfaatan header, main, nav, section, dan aksesibilitas dasar.',
                'obstacles' => 'Tidak ada kendala.',
                'mentor_id' => $mentor?->id,
                'verified_at' => '2026-10-05 16:30:00',
            ],
            [
                'date' => '2026-10-06',
                'time' => '15.48 WIB',
                'status' => 'approved',
                'type' => 'Hadir',
                'activity' => 'Penerapan CSS modern: Flexbox, CSS Grid, dan responsivitas layout.',
                'learning' => 'Menyusun grid adaptif untuk mobile dan desktop.',
                'obstacles' => 'Tidak ada kendala.',
                'mentor_id' => $mentor?->id,
                'verified_at' => '2026-10-06 16:15:00',
            ],
            [
                'date' => '2026-10-07',
                'time' => '16.05 WIB',
                'status' => 'approved',
                'type' => 'Hadir',
                'activity' => 'Interaktivitas antarmuka dengan JavaScript modern dan DOM.',
                'learning' => 'Pengelolaan event dan modul JavaScript.',
                'obstacles' => 'Tidak ada kendala.',
                'mentor_id' => $mentor?->id,
                'verified_at' => '2026-10-07 16:30:00',
            ],
            [
                'date' => '2026-10-08',
                'time' => '15.55 WIB',
                'status' => 'approved',
                'type' => 'Hadir',
                'activity' => 'Pengenalan React komponen, JSX, props, dan arsitektur aplikasi.',
                'learning' => 'Konsep component reusability.',
                'obstacles' => 'Tidak ada kendala.',
                'mentor_id' => $mentor?->id,
                'verified_at' => '2026-10-08 16:20:00',
            ],
            [
                'date' => '2026-10-09',
                'time' => '15.01 WIB',
                'status' => 'approved',
                'type' => 'Hadir',
                'activity' => 'Melanjutkan pembelajaran struktur React serta melanjutkan proses slicing wireframe produk digital yang telah dibuat.',
                'learning' => 'Memahami lebih lanjut struktur React dan cara penyusunan komponen dalam pengembangan halaman web, serta mempelajari penerapannya dalam proses slicing wireframe.',
                'obstacles' => 'Tidak ada kendala yang dialami. Sudah mulai memahami struktur React dan penerapannya dalam proses slicing.',
                'mentor_id' => $mentor?->id,
                'mentor_note' => 'Pekerjaan terstruktur rapi. Pertahankan konsistensi.',
                'verified_at' => '2026-10-09 16:00:00',
            ],
            [
                'date' => '2026-10-12',
                'time' => '15.52 WIB',
                'status' => 'pending', // Kehadiran Baru Perlu Ditinjau!
                'type' => 'Hadir',
                'activity' => 'Melanjutkan proses slicing wireframe produk digital yang telah dibuat menggunakan React dengan menerapkan struktur komponen, props, dan state dalam pengembangan halaman web.',
                'learning' => 'Memahami penerapan component, props, dan state pada React dalam menyusun halaman web secara terstruktur dan reusable pada proses slicing wireframe.',
                'obstacles' => 'Tidak ada kendala yang dialami. Sudah mulai memahami struktur React dan penerapannya dalam proses slicing.',
                'mentor_id' => null,
                'mentor_note' => null,
                'verified_at' => null,
            ],
        ];

        foreach ($records as $record) {
            Attendance::updateOrCreate(
                [
                    'user_id' => $peserta->id,
                    'date' => $record['date'],
                ],
                $record,
            );
        }
    }
}
