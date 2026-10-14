import React from 'react';
import {
    CalendarCheck, Clock3, AlertCircle, CheckCircle2,
    XCircle, Edit3, X, UserRound, AlertTriangle, Coffee
} from 'lucide-react';
import { formatIndonesianDate } from '@/Utils/periodData';

export default function AttendanceDetailModal({
    isOpen,
    onClose,
    date,
    attendance = null,
    onFill = null,
    isWeekend = false,
}) {
    if (!isOpen || !date) return null;

    const hasAttendance = !!attendance;
    const isPending = attendance?.status === 'pending';
    const isApproved = attendance?.status === 'approved';
    const isNeedsRevision = attendance?.status === 'needs_revision';
    const isRejected = attendance?.status === 'rejected';

    const getStatusBadge = () => {
        if (!hasAttendance) {
            if (isWeekend) {
                return (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-[#f1f5f9] px-3 py-1 text-xs font-bold text-[#64748b]">
                        <Coffee size={14} /> Akhir Pekan / Hari Libur
                    </span>
                );
            }
            return (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#f1f5f9] px-3 py-1 text-xs font-bold text-[#64748b]">
                    <Clock3 size={14} /> Belum Diisi
                </span>
            );
        }

        if (isApproved) {
            return (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#ecfdf5] border border-[#a7f3d0] px-3 py-1 text-xs font-bold text-[#059669]">
                    <CheckCircle2 size={14} />
                    {attendance.type === 'Izin' ? 'Izin Disetujui Mentor' : 'Hadir Disetujui Mentor'}
                </span>
            );
        }

        if (isNeedsRevision) {
            return (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#fff1f2] border border-[#fecdd3] px-3 py-1 text-xs font-bold text-[#e11d48]">
                    <AlertTriangle size={14} /> Perlu Perbaikan Uraian
                </span>
            );
        }

        if (isRejected) {
            return (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#fef2f2] border border-[#fecaca] px-3 py-1 text-xs font-bold text-[#dc2626]">
                    <XCircle size={14} /> Kehadiran Ditolak
                </span>
            );
        }

        return (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#fff7ed] border border-[#fed7aa] px-3 py-1 text-xs font-bold text-[#c2410c]">
                <Clock3 size={14} /> Menunggu Verifikasi Mentor
            </span>
        );
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4 sm:p-6 backdrop-blur-xs animate-in fade-in duration-150">
            <div className="w-full max-w-lg max-h-[calc(100dvh-2rem)] sm:max-h-[calc(100dvh-4rem)] flex flex-col rounded-3xl border border-[#d5e1ef] bg-white shadow-2xl overflow-hidden">
                {/* Header Modal - Fixed */}
                <div className="shrink-0 flex items-center justify-between border-b border-[#e9f0fa] p-5 sm:p-6 bg-white">
                    <div className="flex items-center gap-3">
                        <span className="grid h-10 w-10 place-items-center rounded-2xl bg-[#edf4ff] text-[#075cdb]">
                            <CalendarCheck size={20} />
                        </span>
                        <div>
                            <h3 className="text-lg font-bold text-[#061737]">
                                Detail Presensi Harian
                            </h3>
                            <p className="text-xs font-semibold text-[#61718d]">
                                {formatIndonesianDate(date)}
                            </p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="grid h-8 w-8 place-items-center rounded-full text-[#61718d] hover:bg-[#f1f5f9] cursor-pointer transition"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Modal Body - Single Scrollbar */}
                <div className="flex-1 min-h-0 overflow-y-auto monev-scrollbar p-5 sm:p-6 space-y-4">
                    {/* Status Badge Banner */}
                    <div className="flex items-center justify-between flex-wrap gap-2 pb-1">
                        <span className="text-xs font-bold text-[#61718d]">Status Kehadiran:</span>
                        {getStatusBadge()}
                    </div>

                    {hasAttendance ? (
                        <>
                            {/* Baris Tipe & Jam Submit */}
                            <div className="grid grid-cols-2 gap-3">
                                <div className="rounded-2xl border border-[#e2ebf6] bg-[#fafcff] p-3.5">
                                    <span className="block text-[11px] font-bold text-[#687b95] uppercase tracking-wider">
                                        Jenis Presensi
                                    </span>
                                    <b className="mt-0.5 block text-sm font-bold text-[#061737]">
                                        {attendance.type || 'Hadir'}
                                    </b>
                                </div>
                                <div className="rounded-2xl border border-[#e2ebf6] bg-[#fafcff] p-3.5">
                                    <span className="block text-[11px] font-bold text-[#687b95] uppercase tracking-wider">
                                        Waktu Pengisian
                                    </span>
                                    <b className="mt-0.5 block text-sm font-bold text-[#061737]">
                                        {attendance.time || '15.52 WIB'}
                                    </b>
                                </div>
                            </div>

                            {/* Uraian Aktivitas */}
                            <div className="rounded-2xl border border-[#e2ebf6] p-4">
                                <span className="block text-xs font-bold text-[#647590] mb-1.5">
                                    Uraian Aktivitas
                                </span>
                                <p className="text-sm font-medium leading-relaxed text-[#1e2e4a] whitespace-pre-line m-0">
                                    {attendance.activity || 'Tidak ada deskripsi aktivitas.'}
                                </p>
                            </div>

                            {/* Pembelajaran yang Diperoleh */}
                            <div className="rounded-2xl border border-[#e2ebf6] p-4">
                                <span className="block text-xs font-bold text-[#647590] mb-1.5">
                                    Pembelajaran yang Diperoleh
                                </span>
                                <p className="text-sm font-medium leading-relaxed text-[#1e2e4a] whitespace-pre-line m-0">
                                    {attendance.learning || 'Tidak ada catatan pembelajaran.'}
                                </p>
                            </div>

                            {/* Kendala yang Dialami */}
                            <div className="rounded-2xl border border-[#e2ebf6] p-4">
                                <span className="block text-xs font-bold text-[#647590] mb-1.5">
                                    Kendala yang Dialami
                                </span>
                                <p className="text-sm font-medium leading-relaxed text-[#1e2e4a] whitespace-pre-line m-0">
                                    {attendance.obstacles || 'Tidak ada kendala yang dialami.'}
                                </p>
                            </div>

                            {/* Catatan Mentor (Jika ada) */}
                            {attendance.mentor_note && (
                                <div className="rounded-2xl border border-[#c7dcf9] bg-[#f0f6ff] p-4">
                                    <div className="flex items-center gap-1.5 text-xs font-bold text-[#075cdb] mb-1.5">
                                        <AlertCircle size={15} />
                                        <span>Catatan / Feedback dari Mentor:</span>
                                    </div>
                                    <p className="text-sm font-medium leading-relaxed text-[#0d2753] whitespace-pre-line m-0">
                                        {attendance.mentor_note}
                                    </p>
                                </div>
                            )}
                        </>
                    ) : (
                        /* Belum Diisi / Hari Libur State */
                        <div className="py-8 text-center">
                            <span className="mx-auto mb-3 grid h-14 w-14 place-items-center rounded-3xl bg-[#f0f4f9] text-[#8697ae]">
                                {isWeekend ? <Coffee size={28} /> : <CalendarCheck size={28} />}
                            </span>
                            <h4 className="text-base font-bold text-[#061737]">
                                {isWeekend ? 'Akhir Pekan / Hari Libur' : 'Belum Ada Catatan Presensi'}
                            </h4>
                            <p className="mt-1 text-xs text-[#718298] max-w-xs mx-auto leading-relaxed">
                                {isWeekend
                                    ? 'Tanggal ini merupakan hari libur atau akhir pekan operasional magang.'
                                    : 'Anda belum mengisi presensi dan jurnal aktivitas harian untuk tanggal ini.'}
                            </p>
                        </div>
                    )}
                </div>

                {/* Footer Modal - Fixed Bottom */}
                <div className="shrink-0 flex items-center justify-end gap-3 border-t border-[#e9f0fa] p-4 sm:px-6 bg-[#fafcff]">
                    <button
                        type="button"
                        onClick={onClose}
                        className="monev-btn monev-btn-secondary !h-10 text-xs"
                    >
                        Tutup
                    </button>

                    {/* Tombol aksi cepat pengisian / revisi */}
                    {hasAttendance && (isNeedsRevision || isPending) && onFill && (
                        <button
                            type="button"
                            onClick={() => {
                                onClose();
                                onFill(date, attendance);
                            }}
                            className="monev-btn monev-btn-primary !h-10 text-xs"
                        >
                            <Edit3 size={15} />
                            <span>
                                {isNeedsRevision ? 'Perbaiki Uraian Sekarang' : 'Ubah Uraian Presensi'}
                            </span>
                        </button>
                    )}

                    {!hasAttendance && onFill && (
                        <button
                            type="button"
                            onClick={() => {
                                onClose();
                                onFill(date, null);
                            }}
                            className="monev-btn monev-btn-primary !h-10 text-xs"
                        >
                            <CalendarCheck size={15} />
                            <span>Isi Presensi Tanggal Ini</span>
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
