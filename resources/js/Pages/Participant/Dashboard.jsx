import ServerTime from '@/Components/ServerTime';
import NotificationModal from '@/Components/NotificationModal';
import AnnouncementModal from '@/Components/AnnouncementModal';
import AttendanceDetailModal from '@/Components/AttendanceDetailModal';
import { Head, router, usePage } from '@inertiajs/react';
import {
    AlertCircle, ArrowLeft, Bell, BookOpen, CalendarCheck, CalendarClock, Check, CheckCircle2,
    ChevronLeft, ChevronRight, Circle, Clock3, Edit3, Home, LogOut,
    Mail, Megaphone, Phone, Send, Star, Target, UserRound, UsersRound, X, Layers
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import {
    internshipPeriods,
    availableBidang,
    getCurriculumTemplate,
    getCompletedModuleIndices,
    isModuleCompleted,
    curriculumByBidang,
    curriculumByPeriod,
    getPeriodWeeks,
    formatIndonesianDate,
} from '@/Utils/periodData';

const assessmentAspects = [
    'Kehadiran dan disiplin', 'Sikap dan perilaku', 'Kemampuan komunikasi',
    'Inisiatif dan tanggung jawab', 'Kemampuan adaptasi', 'Pengetahuan teknis',
    'Produktivitas dan ketepatan waktu', 'Kerja sama tim',
];

function DayStatus({ status }) {
    if (status.includes('check')) return <Check size={17} />;
    if (status === 'permit') return <b>−</b>;
    if (status === 'action') return <b>▲</b>;
    if (status === 'revision') return <b>◆</b>;
    if (status === 'rejected') return <b>&times;</b>;
    if (status === 'holiday') return <b className="holiday-dot">■</b>;
    return <Circle size={10} />;
}

function RatingTable({ title, rows, values = {}, purple = false }) {
    return (
        <div className={`rating-table ${purple ? 'purple' : ''}`}>
            <div className="rating-head">
                <b>{title}</b>
                {['SB', 'B', 'C', 'K'].map((x) => (
                    <b key={x}>{x}</b>
                ))}
            </div>
            {rows.map((row, i) => (
                <div className="rating-row" key={row}>
                    <span>{title === 'Aspek Penilaian' ? `${i + 1}.  ${row}` : row}</span>
                    {['SB', 'B', 'C', 'K'].map((mark) => (
                        <label key={mark} className="cursor-default pointer-events-none">
                            <input
                                type="radio"
                                name={`${title}-${i}`}
                                checked={values[`${title}-${i}`] === mark}
                                readOnly
                            />
                            <span />
                        </label>
                    ))}
                </div>
            ))}
        </div>
    );
}

export default function ParticipantDashboard({
    attendances = [],
    todayAttendance = null,
    currentDate = '2026-10-13',
    flash = {},
    announcements = [],
    evaluations = [],
    curriculumFocuses = [],
    batch = null,
}) {
    const user = usePage().props.auth.user;
    const unreadNotificationsCount = usePage().props.unreadNotificationsCount || 0;
    const [page, setPage] = useState('home');
    const [periodIndex, setPeriodIndex] = useState(0);
    const currentPeriod = internshipPeriods[periodIndex];

    const currentPeriodEvaluation = useMemo(() => {
        return evaluations.find((e) => Number(e.period_id) === Number(currentPeriod.id));
    }, [evaluations, currentPeriod]);

    const activeFocus = useMemo(() => {
        return curriculumFocuses.find((f) => Number(f.period_id) === Number(currentPeriod.id));
    }, [curriculumFocuses, currentPeriod]);

    // Modals state
    const [showNotifications, setShowNotifications] = useState(false);
    const [showAnnouncements, setShowAnnouncements] = useState(false);
    const [highlightAnnouncementId, setHighlightAnnouncementId] = useState(null);
    const [showDateDetailModal, setShowDateDetailModal] = useState(false);

    const [selectedCalendarDate, setSelectedCalendarDate] = useState(currentDate);

    // Dynamic calendar weeks for active period
    const calendarWeeks = useMemo(() => {
        return getPeriodWeeks(currentPeriod.startDate, currentPeriod.endDate, currentDate);
    }, [currentPeriod, currentDate]);

    // Sinkronkan selectedCalendarDate saat berpindah periode
    useEffect(() => {
        if (currentDate >= currentPeriod.startDate && currentDate <= currentPeriod.endDate) {
            setSelectedCalendarDate(currentDate);
        } else {
            const periodAtts = attendances.filter(
                (a) => a.date >= currentPeriod.startDate && a.date <= currentPeriod.endDate
            );
            if (periodAtts.length > 0) {
                setSelectedCalendarDate(periodAtts[0].date);
            } else {
                setSelectedCalendarDate(currentPeriod.startDate);
            }
        }
    }, [currentPeriod, currentDate, attendances]);

    // Form Presensi State
    const [showPresenceForm, setShowPresenceForm] = useState(false);
    const [formDate, setFormDate] = useState(currentDate);
    const [formType, setFormType] = useState('Hadir');
    const [activityDesc, setActivityDesc] = useState('');
    const [learningDesc, setLearningDesc] = useState('');
    const [obstaclesDesc, setObstaclesDesc] = useState('Tidak ada kendala yang dialami.');
    const [submitting, setSubmitting] = useState(false);
    const [formErrors, setFormErrors] = useState({});

    const firstName = user.name.split(' ')[0];
    const initials = user.name
        .split(' ')
        .map((p) => p[0])
        .slice(0, 2)
        .join('');

    // Dapatkan data presensi hari ini secara reaktif dari attendances
    const activeToday = useMemo(() => {
        return (
            attendances.find((a) => a.date === currentDate) ||
            attendances.find((a) => a.date === '2026-10-13') ||
            todayAttendance
        );
    }, [attendances, currentDate, todayAttendance]);

    // Cari jika ada presensi yang perlu direvisi
    const revisionNeeded = useMemo(() => {
        return attendances.find((a) => a.status === 'needs_revision');
    }, [attendances]);

    // Buka form untuk presensi hari tertentu (misal revisi atau isi baru)
    const openFormForDate = (targetDate, existing = null) => {
        const resolved = targetDate || currentDate || currentPeriod.startDate;
        setFormDate(resolved);
        setFormErrors({});
        if (existing) {
            setFormType(existing.type || 'Hadir');
            setActivityDesc(existing.activity || '');
            setLearningDesc(existing.learning || '');
            setObstaclesDesc(existing.obstacles || 'Tidak ada kendala yang dialami.');
        } else {
            setFormType('Hadir');
            setActivityDesc('');
            setLearningDesc('');
            setObstaclesDesc('Tidak ada kendala yang dialami.');
        }
        setShowPresenceForm(true);
    };

    const handlePresenceSubmit = (e) => {
        e.preventDefault();
        setSubmitting(true);
        setFormErrors({});
        const targetDate = formDate || currentDate || '2026-10-13';

        router.post(
            route('attendances.store'),
            {
                date: targetDate,
                type: formType,
                activity: activityDesc,
                learning: learningDesc,
                obstacles: obstaclesDesc || 'Tidak ada kendala yang dialami.',
            },
            {
                preserveScroll: true,
                preserveState: true,
                onSuccess: () => {
                    setShowPresenceForm(false);
                    setSelectedCalendarDate(targetDate);
                    setFormErrors({});
                },
                onError: (errs) => {
                    setFormErrors(errs || {});
                },
                onFinish: () => setSubmitting(false),
            }
        );
    };

    const getDayStyle = (dayObj) => {
        if (dayObj.isWeekend) return 'holiday';
        const att = attendances.find((a) => a.date === dayObj.date);
        let base = '';
        if (att) {
            if (att.status === 'approved') {
                base = att.type === 'Izin' ? 'permit' : 'check';
            } else if (att.status === 'pending') {
                base = 'action';
            } else if (att.status === 'needs_revision') {
                base = 'revision';
            } else if (att.status === 'rejected') {
                base = 'rejected';
            }
        } else {
            base = dayObj.isToday ? 'empty today' : 'empty';
        }

        if (dayObj.date === selectedCalendarDate) {
            base += ' selected';
        }
        return base;
    };

    const selectedAttendance = useMemo(() => {
        return attendances.find((a) => a.date === selectedCalendarDate);
    }, [attendances, selectedCalendarDate]);

    return (
        <>
            <Head title="Dashboard Peserta - Monev Magang" />
            <div className="monev-shell">
                <div className="app-canvas">
                    {/* Halaman Beranda Peserta */}
                    {page === 'home' && (
                        <main className="page home-page">
                            <div className="welcome-row">
                                <div>
                                    <h1>
                                        Halo, {firstName} <span>👋</span>
                                    </h1>
                                    <div className="flex flex-wrap items-center gap-2 mt-1">
                                        <p className="!m-0 text-sm text-[#61718d]">Kokek &middot; {user?.bidang || 'UI/UX Designer'}</p>
                                        {batch && (
                                            <span className="inline-flex items-center gap-1 rounded-full bg-[#edf4ff] px-2.5 py-0.5 text-xs font-bold text-[#075cdb]">
                                                <Layers size={12} /> {batch.name}
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <div className="flex items-center gap-2.5">
                                    <button
                                        type="button"
                                        onClick={() => setShowNotifications(true)}
                                        className="relative grid h-10 w-10 place-items-center rounded-2xl border border-[#d5e1ef] bg-white text-[#576983] shadow-xs transition hover:bg-[#f0f6ff] hover:text-[#075cdb] cursor-pointer"
                                        title="Notifikasi"
                                    >
                                        <Bell size={19} />
                                        {unreadNotificationsCount > 0 && (
                                            <span className="absolute -top-1 -right-1 grid min-w-5 h-5 px-1 place-items-center rounded-full bg-[#ef4444] text-[10px] font-extrabold text-white ring-2 ring-white">
                                                {unreadNotificationsCount}
                                            </span>
                                        )}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setShowAnnouncements(true)}
                                        className="grid h-10 w-10 place-items-center rounded-2xl border border-[#d5e1ef] bg-white text-[#576983] shadow-xs transition hover:bg-[#f0f6ff] hover:text-[#075cdb] cursor-pointer"
                                        title="Papan Pengumuman"
                                    >
                                        <Megaphone size={19} />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setPage('account')}
                                        title="Buka Akun Peserta"
                                    >
                                        {user.avatar_url ? (
                                            <img
                                                src={user.avatar_url}
                                                alt={user.name}
                                                className="initial-avatar object-cover ring-2 ring-[#075cdb]/20"
                                            />
                                        ) : (
                                            <div className="initial-avatar">{initials}</div>
                                        )}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => router.post(route('logout'))}
                                        className="inline-flex items-center gap-2 rounded-2xl border border-[#ffc8c8] bg-[#fff4f4] px-4 py-2.5 text-sm font-bold text-[#d02a2a] shadow-xs transition hover:bg-[#ffe6e6]"
                                        title="Keluar dari akun"
                                    >
                                        <LogOut size={18} />
                                        <span>Keluar</span>
                                    </button>
                                </div>
                            </div>

                            {/* Flash Message Banner */}
                            {flash?.success && (
                                <div className="mb-4 flex items-center gap-2 rounded-2xl bg-[#e9f9ef] p-4 font-bold text-[#0b8a46]">
                                    <Check size={20} /> {flash.success}
                                </div>
                            )}

                            {/* Banner Pemberitahuan jika Ada Revisi yang Diminta Mentor */}
                            {revisionNeeded && (
                                <button
                                    onClick={() => {
                                        setPage('attendance');
                                        setSelectedCalendarDate(revisionNeeded.date);
                                        openFormForDate(revisionNeeded.date, revisionNeeded);
                                    }}
                                    className="mb-4 flex w-full items-center gap-3 rounded-2xl border border-[#ffbd6d] bg-[#fff8ec] p-4 text-left transition hover:bg-[#fff3df]"
                                >
                                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#f59e0b] text-white font-black text-lg">
                                        !
                                    </span>
                                    <div className="flex-1">
                                        <b className="block text-[15px] text-[#9d4300]">
                                            Perhatian: Mentor meminta perbaikan uraian!
                                        </b>
                                        <p className="m-0 text-xs text-[#7d481b]">
                                            Presensi tanggal {formatIndonesianDate(revisionNeeded.date)} perlu diperbaiki. Klik untuk perbarui.
                                        </p>
                                    </div>
                                    <ChevronRight className="text-[#9d4300]" />
                                </button>
                            )}

                            <button
                                type="button"
                                onClick={() => setShowAnnouncements(true)}
                                className="announcement cursor-pointer w-full text-left"
                            >
                                <span className="alert-dot">!</span>
                                <b>{announcements.length} Pengumuman Magang</b>
                                <u>Lihat pengumuman &rarr;</u>
                            </button>

                            <h2>Aktivitas & Tindakan Hari Ini</h2>

                            {/* Kartu Status Kehadiran Hari Ini */}
                            <button
                                className="action-card"
                                onClick={() => setPage('attendance')}
                            >
                                <span className={`icon-tile ${activeToday ? 'blue' : 'orange'}`}>
                                    <CalendarClock />
                                </span>
                                <span>
                                    <b>Kehadiran Hari Ini</b>
                                    <small>
                                        {!activeToday
                                            ? 'Belum mengisi presensi hari ini'
                                            : activeToday.status === 'approved'
                                            ? 'Presensi harian telah disetujui mentor (Hadir)'
                                            : activeToday.status === 'needs_revision'
                                            ? 'Mentor meminta perbaikan uraian presensi'
                                            : 'Presensi telah disubmit (Menunggu verifikasi mentor)'}
                                    </small>
                                </span>
                                <span className="count">
                                    {!activeToday
                                        ? '1'
                                        : activeToday.status === 'approved'
                                        ? '✓'
                                        : activeToday.status === 'needs_revision'
                                        ? '!'
                                        : '⏳'}
                                </span>
                                <ChevronRight />
                            </button>

                            {/* Kartu Evaluasi Bulanan */}
                            <button
                                className="action-card"
                                onClick={() => setPage('assessment')}
                            >
                                <span className="icon-tile blue">
                                    <Star />
                                </span>
                                <span>
                                    <b>Evaluasi Bulanan {currentPeriod.name}</b>
                                    <small>
                                        {currentPeriodEvaluation
                                            ? `Telah dinilai oleh Mentor ${currentPeriodEvaluation.mentor_name}`
                                            : 'Belum dinilai oleh mentor'}
                                    </small>
                                </span>
                                <span className="count">
                                    {currentPeriodEvaluation ? '★' : '−'}
                                </span>
                                <ChevronRight />
                            </button>

                            {/* Kartu Kurikulum Magang */}
                            {(() => {
                                const activeBidang = activeFocus?.bidang || user?.bidang || 'UI/UX Designer';
                                const rawHomeModules = activeFocus?.modules && activeFocus.modules.length > 0
                                    ? activeFocus.modules
                                    : getCurriculumTemplate(activeBidang, currentPeriod.id);
                                const homeModules = Array.isArray(rawHomeModules) ? rawHomeModules : [];
                                const completedIndices = getCompletedModuleIndices(activeFocus?.completed_modules, homeModules);
                                const completedCount = completedIndices.length;

                                return (
                                    <button
                                        className="action-card"
                                        onClick={() => setPage('curriculum')}
                                    >
                                        <span className="icon-tile blue">
                                            <BookOpen />
                                        </span>
                                        <span>
                                            <b>Kurikulum Magang ({activeBidang})</b>
                                            <small>
                                                {completedCount > 0
                                                    ? `${completedCount} dari ${homeModules.length} materi selesai dicapai`
                                                    : `${homeModules.length} materi silabus pembelajaran`}
                                            </small>
                                        </span>
                                        <span className="count">
                                            {completedCount}
                                        </span>
                                        <ChevronRight />
                                    </button>
                                );
                            })()}

                            {/* Kartu Batch Peserta */}
                            <section className="batch-card">
                                <header>
                                    <span className="icon-tile blue">
                                        <UsersRound />
                                    </span>
                                    <div>
                                        <b>Batch 2 (Sedang Berjalan)</b>
                                        <small>21 Sep 2026 - 20 Mar 2027</small>
                                    </div>
                                    <span className="status-pill ml-auto">Aktif</span>
                                </header>
                                <div className="batch-info">
                                    <span>
                                        <b>Progres Kehadiran</b>
                                        <small>
                                            {currentPeriod.name}: {attendances.filter((a) => a.date >= currentPeriod.startDate && a.date <= currentPeriod.endDate && a.status === 'approved' && a.type === 'Hadir').length} Hadir &middot; {attendances.filter((a) => a.date >= currentPeriod.startDate && a.date <= currentPeriod.endDate && a.status === 'approved' && a.type === 'Izin').length} Izin
                                        </small>
                                    </span>
                                    <span>
                                        <b>Posisi Magang</b>
                                        <small>{user?.bidang || 'UI/UX Designer'}</small>
                                    </span>
                                </div>
                                <button onClick={() => setPage('attendance')}>
                                    Lihat riwayat kehadiran lengkap
                                </button>
                            </section>
                        </main>
                    )}

                    {/* Halaman Kehadiran Peserta */}
                    {page === 'attendance' && (
                        <main className="page detail-page">
                            <header className="participant-header">
                                <button onClick={() => setPage('home')} aria-label="Kembali">
                                    <ArrowLeft />
                                </button>
                                <div>
                                    <b>Presensi & Kehadiran</b>
                                    <span>{currentPeriod.name} &middot; {currentPeriod.rangeLabel}</span>
                                </div>
                            </header>

                            <div className="period-picker">
                                <button
                                    type="button"
                                    onClick={() => setPeriodIndex((prev) => Math.max(0, prev - 1))}
                                    disabled={periodIndex === 0}
                                    title="Periode Sebelumnya"
                                    className="cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                                >
                                    <ChevronLeft />
                                </button>
                                <div>
                                    <b>{currentPeriod.name}</b>
                                    <span>{currentPeriod.rangeLabel}</span>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setPeriodIndex((prev) => Math.min(internshipPeriods.length - 1, prev + 1))}
                                    disabled={periodIndex === internshipPeriods.length - 1}
                                    title="Periode Selanjutnya"
                                    className="cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                                >
                                    <ChevronRight />
                                </button>
                            </div>

                            {/* Alert Flash Message */}
                            {flash?.success && (
                                <div className="mt-4 flex items-center gap-2 rounded-2xl bg-[#e9f9ef] p-4 font-bold text-[#0b8a46]">
                                    <Check size={20} /> {flash.success}
                                </div>
                            )}

                            {/* Alert jika Ada Permintaan Perbaikan dari Mentor */}
                            {revisionNeeded && (
                                <div className="mt-4 rounded-2xl border border-[#ffbd6d] bg-[#fff8ec] p-4 text-sm text-[#8c3e00]">
                                    <b className="flex items-center gap-2 text-base font-bold text-[#9d4300]">
                                        <AlertCircle size={18} /> Permintaan Perbaikan dari Mentor
                                    </b>
                                    <p className="mt-1.5 leading-relaxed text-[#743c08]">
                                        Mentor Lefi Andri meminta Anda memperbaiki uraian presensi tanggal{' '}
                                        <b>{formatIndonesianDate(revisionNeeded.date)}</b>:
                                    </p>
                                    {revisionNeeded.mentor_note && (
                                        <blockquote className="my-2 rounded-xl bg-white/80 p-3 italic text-[#542d09] border-l-4 border-[#f59e0b]">
                                            &ldquo;{revisionNeeded.mentor_note}&rdquo;
                                        </blockquote>
                                    )}
                                    <button
                                        type="button"
                                        onClick={() => openFormForDate(revisionNeeded.date, revisionNeeded)}
                                        className="mt-2 inline-flex items-center gap-1.5 rounded-xl bg-[#f59e0b] px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-[#d97706] cursor-pointer"
                                    >
                                        <Edit3 size={15} /> Perbaiki Presensi Ini Sekarang
                                    </button>
                                </div>
                            )}

                            {/* Form / Status Pengisian Presensi Hari Ini */}
                            <section className="detail-card p-6 mt-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h2 className="text-xl font-bold text-[#061737]">
                                            Presensi Hari Ini ({formatIndonesianDate(currentDate)})
                                        </h2>
                                        <p className="mt-1 text-sm text-[#61718d]">
                                            {!activeToday
                                                ? 'Silakan isi jurnal harian dan konfirmasi kehadiran Anda.'
                                                : activeToday.status === 'pending'
                                                ? 'Presensi harian telah tersimpan dan menunggu tinjauan mentor.'
                                                : activeToday.status === 'needs_revision'
                                                ? 'Mentor meminta Anda memperbaiki uraian presensi hari ini.'
                                                : 'Presensi harian Anda telah disetujui mentor.'}
                                        </p>
                                    </div>
                                    <span
                                        className={
                                            !activeToday
                                                ? 'warning-pill'
                                                : activeToday.status === 'approved'
                                                ? 'status-pill'
                                                : activeToday.status === 'needs_revision'
                                                ? 'warning-pill !bg-[#fff1df] !text-[#f17a00]'
                                                : 'status-pill !bg-[#edf4ff] !text-[#075cdb]'
                                        }
                                    >
                                        {!activeToday
                                            ? 'Perlu Diisi'
                                            : activeToday.status === 'approved'
                                            ? 'Disetujui'
                                            : activeToday.status === 'needs_revision'
                                            ? 'Perlu Revisi'
                                            : 'Menunggu Review'}
                                    </span>
                                </div>

                                {!showPresenceForm ? (
                                    <div className="mt-5 flex flex-wrap gap-3">
                                        {!activeToday ? (
                                            <button
                                                type="button"
                                                onClick={() => openFormForDate(currentDate)}
                                                className="monev-btn monev-btn-primary cursor-pointer"
                                            >
                                                <CalendarCheck size={18} /> Isi Jurnal & Presensi Hari Ini
                                            </button>
                                        ) : (
                                            <button
                                                type="button"
                                                onClick={() => openFormForDate(activeToday.date, activeToday)}
                                                className="monev-btn monev-btn-secondary cursor-pointer"
                                            >
                                                <Edit3 size={18} /> Ubah Catatan Presensi Hari Ini
                                            </button>
                                        )}
                                    </div>
                                ) : (
                                    /* Form Pengisian Presensi */
                                    <form onSubmit={handlePresenceSubmit} className="space-y-4 pt-5 mt-4 border-t border-[#e2edf8]">
                                        {Object.keys(formErrors).length > 0 && (
                                            <div className="rounded-xl bg-[#fee2e2] p-3 text-sm text-[#b91c1c] font-bold">
                                                Mohon lengkapi seluruh kolom formulir presensi berikut.
                                            </div>
                                        )}

                                        <div className="flex flex-wrap items-center justify-between gap-2">
                                            <span className="text-sm font-bold text-[#075cdb]">
                                                Mengisi Presensi untuk: {formatIndonesianDate(formDate)}
                                            </span>
                                            <div className="flex gap-2">
                                                {['Hadir', 'Izin', 'Sakit'].map((t) => (
                                                    <button
                                                        key={t}
                                                        type="button"
                                                        onClick={() => setFormType(t)}
                                                        className={`rounded-xl px-3 py-1.5 text-xs font-bold transition cursor-pointer ${
                                                            formType === t
                                                                ? 'bg-[#075cdb] text-white shadow-xs'
                                                                : 'bg-[#edf4ff] text-[#405a85] hover:bg-[#dfeaf9]'
                                                        }`}
                                                    >
                                                        {t}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        <div>
                                            <label className="monev-label">Uraian Aktivitas</label>
                                            <textarea
                                                value={activityDesc}
                                                onChange={(e) => setActivityDesc(e.target.value)}
                                                placeholder="Ceritakan aktivitas kerja atau belajar Anda secara spesifik..."
                                                className="w-full rounded-2xl border border-[#c5d4e8] p-4 text-[15px] text-[#071a3b] focus:border-[#075cdb] focus:outline-none focus:ring-2 focus:ring-[#075cdb]/20"
                                                rows={3}
                                                required
                                            />
                                            {formErrors.activity && (
                                                <p className="mt-1 text-sm font-semibold text-[#dc2626]">{formErrors.activity}</p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="monev-label">Pembelajaran yang Diperoleh</label>
                                            <textarea
                                                value={learningDesc}
                                                onChange={(e) => setLearningDesc(e.target.value)}
                                                placeholder="Insight, pemahaman teknis, atau keterampilan baru yang dipelajari..."
                                                className="w-full rounded-2xl border border-[#c5d4e8] p-4 text-[15px] text-[#071a3b] focus:border-[#075cdb] focus:outline-none focus:ring-2 focus:ring-[#075cdb]/20"
                                                rows={2}
                                                required
                                            />
                                            {formErrors.learning && (
                                                <p className="mt-1 text-sm font-semibold text-[#dc2626]">{formErrors.learning}</p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="monev-label">Kendala yang Dialami (Opsional)</label>
                                            <textarea
                                                value={obstaclesDesc}
                                                onChange={(e) => setObstaclesDesc(e.target.value)}
                                                placeholder="Tuliskan kendala teknis atau koordinasi jika ada..."
                                                className="w-full rounded-2xl border border-[#c5d4e8] p-4 text-[15px] text-[#071a3b] focus:border-[#075cdb] focus:outline-none focus:ring-2 focus:ring-[#075cdb]/20"
                                                rows={2}
                                            />
                                        </div>

                                        <div className="flex gap-3 pt-2">
                                            <button
                                                type="submit"
                                                disabled={submitting}
                                                className="monev-btn monev-btn-primary cursor-pointer disabled:opacity-60"
                                            >
                                                <Send size={18} /> {submitting ? 'Mengirim Presensi...' : 'Kirim Presensi'}
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setShowPresenceForm(false)}
                                                className="monev-btn monev-btn-secondary cursor-pointer"
                                            >
                                                Batal
                                            </button>
                                        </div>
                                    </form>
                                )}
                            </section>

                            {/* Kalender Kehadiran Interaktif */}
                            <section className="detail-card calendar-card mt-6">
                                <div className="calendar">
                                    <div className="weekdays">
                                        {['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'].map((x) => (
                                            <b key={x}>{x}</b>
                                        ))}
                                    </div>
                                    {calendarWeeks.map((week, r) => (
                                        <div className="week" key={r}>
                                            {week.map((dayObj, cIdx) => {
                                                if (!dayObj) {
                                                    return (
                                                        <div
                                                            key={`empty-${r}-${cIdx}`}
                                                            className="h-[56px] border-t border-[#dfe5ec] bg-[#f8fafc]/40"
                                                        />
                                                    );
                                                }
                                                const style = getDayStyle(dayObj);
                                                return (
                                                    <button
                                                        key={dayObj.date}
                                                        type="button"
                                                        className={style}
                                                        onClick={() => {
                                                            setSelectedCalendarDate(dayObj.date);
                                                            setShowDateDetailModal(true);
                                                        }}
                                                        title={`Lihat detail presensi tanggal ${dayObj.day}`}
                                                    >
                                                        <span>{dayObj.day}</span>
                                                        <DayStatus status={style} />
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    ))}
                                </div>
                                <div className="legend">
                                    <span className="ok">&check; Hadir disetujui</span>
                                    <span className="permit">&minus; Izin disetujui</span>
                                    <span className="absent">&bull; Tidak Hadir</span>
                                    <span className="rejected">&times; Kehadiran Ditolak</span>
                                    <span className="warning">&#9650; Menunggu Verifikasi Mentor</span>
                                    <span className="pending">&#9670; Perlu Perbaikan Anda</span>
                                    <span className="blank">&#9675; Belum Diisi</span>
                                    <span className="off">&blacksquare; Hari Libur</span>
                                </div>
                            </section>

                            {/* Detail Catatan untuk Tanggal yang Dipilih */}
                            {selectedAttendance ? (
                                <section className="detail-card attendance-detail mt-6 mb-8">
                                    <header className="flex items-center justify-between pb-4">
                                        <div>
                                            <h2 className="text-xl font-bold text-[#061737]">
                                                {formatIndonesianDate(selectedAttendance.date)}
                                            </h2>
                                            <span className="flex items-center gap-1.5 text-sm font-semibold text-[#667794]">
                                                <Clock3 size={17} /> {selectedAttendance.time || '15.52 WIB'}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button
                                                type="button"
                                                onClick={() => setShowDateDetailModal(true)}
                                                className="inline-flex items-center gap-1.5 rounded-xl border border-[#d5e1ef] bg-white px-3 py-1.5 text-xs font-bold text-[#075cdb] hover:bg-[#edf4ff] transition cursor-pointer shadow-xs"
                                                title="Tampilkan dalam jendela popup modal"
                                            >
                                                <span>Buka di Modal</span>
                                            </button>
                                            {selectedAttendance.status === 'pending' && (
                                                <span className="warning-pill !bg-[#fff1df] !text-[#f17a00] font-bold">
                                                    Menunggu Verifikasi Mentor
                                                </span>
                                            )}
                                            {selectedAttendance.status === 'approved' && (
                                                <span className="status-pill">
                                                    {selectedAttendance.type === 'Izin' ? 'Izin disetujui' : 'Hadir disetujui'}
                                                </span>
                                            )}
                                            {selectedAttendance.status === 'needs_revision' && (
                                                <span className="warning-pill !bg-[#fff1df] !text-[#f17a00] font-bold">
                                                    Perlu Perbaikan Uraian
                                                </span>
                                            )}
                                            {selectedAttendance.status === 'rejected' && (
                                                <span className="status-pill !bg-[#ffeef0] !text-[#d02a2a] font-bold">
                                                    Kehadiran Ditolak
                                                </span>
                                            )}
                                        </div>
                                    </header>

                                    <div className="attendance-row">
                                        <b>Kehadiran</b>
                                        <p>{selectedAttendance.type || 'Hadir'}</p>
                                    </div>
                                    <div className="attendance-row">
                                        <b>Uraian Aktivitas</b>
                                        <p>{selectedAttendance.activity}</p>
                                    </div>
                                    <div className="attendance-row">
                                        <b>Pembelajaran yang Diperoleh</b>
                                        <p>{selectedAttendance.learning}</p>
                                    </div>
                                    <div className="attendance-row">
                                        <b>Kendala yang Dialami</b>
                                        <p>{selectedAttendance.obstacles || 'Tidak ada kendala yang dialami.'}</p>
                                    </div>

                                    {/* Catatan Mentor jika ada */}
                                    {selectedAttendance.mentor_note && (
                                        <div className="attendance-row bg-[#f8fbff] rounded-2xl p-4 mt-3 border border-[#dce8f7]">
                                            <b className="text-[#075cdb]">Catatan dari Mentor Lefi Andri:</b>
                                            <p className="mt-1 text-[#1c2e4c] font-medium">{selectedAttendance.mentor_note}</p>
                                        </div>
                                    )}

                                    {/* Tombol Perbaiki jika status needs_revision atau pending */}
                                    {(selectedAttendance.status === 'needs_revision' || selectedAttendance.status === 'pending') && (
                                        <div className="mt-4 pt-3 flex justify-end">
                                            <button
                                                type="button"
                                                onClick={() => openFormForDate(selectedAttendance.date, selectedAttendance)}
                                                className="monev-btn monev-btn-primary cursor-pointer"
                                            >
                                                <Edit3 size={18} /> {selectedAttendance.status === 'needs_revision' ? 'Perbaiki Uraian Sekarang' : 'Ubah Uraian Presensi'}
                                            </button>
                                        </div>
                                    )}
                                </section>
                            ) : (
                                <section className="detail-card attendance-detail mt-6 mb-8 p-6 text-center">
                                    <header className="flex items-center justify-between pb-4">
                                        <div>
                                            <h2 className="text-xl font-bold text-[#061737]">
                                                {formatIndonesianDate(selectedCalendarDate)}
                                            </h2>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button
                                                type="button"
                                                onClick={() => setShowDateDetailModal(true)}
                                                className="inline-flex items-center gap-1.5 rounded-xl border border-[#d5e1ef] bg-white px-3 py-1.5 text-xs font-bold text-[#075cdb] hover:bg-[#edf4ff] transition cursor-pointer shadow-xs"
                                                title="Tampilkan dalam jendela popup modal"
                                            >
                                                <span>Buka di Modal</span>
                                            </button>
                                            <span className="neutral-pill">Belum Diisi</span>
                                        </div>
                                    </header>
                                    <div className="py-8 text-[#677794]">
                                        <Clock3 size={36} className="mx-auto mb-2 text-[#9bb0cb]" />
                                        <p className="text-base font-semibold m-0">
                                            Anda belum mengisi catatan kehadiran untuk tanggal ini.
                                        </p>
                                        <button
                                            type="button"
                                            onClick={() => openFormForDate(selectedCalendarDate)}
                                            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[#075cdb] px-4 py-2.5 text-sm font-bold text-white shadow-xs hover:bg-[#064fbe] cursor-pointer"
                                        >
                                            <CalendarCheck size={18} /> Isi Presensi Tanggal Ini
                                        </button>
                                    </div>
                                </section>
                            )}
                        </main>
                    )}

                    {/* Halaman Kurikulum */}
                    {page === 'curriculum' && (
                        <main className="page detail-page">
                            <header className="participant-header">
                                <button onClick={() => setPage('home')} aria-label="Kembali">
                                    <ArrowLeft />
                                </button>
                                <div>
                                    <b>Kurikulum Magang</b>
                                    <span>{currentPeriod.name} &middot; {currentPeriod.rangeLabel}</span>
                                </div>
                            </header>

                            <div className="period-picker">
                                <button
                                    type="button"
                                    onClick={() => setPeriodIndex((prev) => Math.max(0, prev - 1))}
                                    disabled={periodIndex === 0}
                                    title="Periode Sebelumnya"
                                    className="cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                                >
                                    <ChevronLeft />
                                </button>
                                <div>
                                    <b>{currentPeriod.name}</b>
                                    <span>{currentPeriod.rangeLabel}</span>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setPeriodIndex((prev) => Math.min(internshipPeriods.length - 1, prev + 1))}
                                    disabled={periodIndex === internshipPeriods.length - 1}
                                    title="Periode Selanjutnya"
                                    className="cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                                >
                                    <ChevronRight />
                                </button>
                            </div>

                            {/* Section Kurikulum */}
                            {(() => {
                                const activeBidang = activeFocus?.bidang || user?.bidang || 'UI/UX Designer';
                                const rawModules = activeFocus?.modules && activeFocus.modules.length > 0
                                    ? activeFocus.modules
                                    : getCurriculumTemplate(activeBidang, currentPeriod.id);
                                const periodModules = Array.isArray(rawModules) ? rawModules : [];
                                const completedIndices = getCompletedModuleIndices(activeFocus?.completed_modules, periodModules);
                                const completedCount = completedIndices.length;
                                const progressPercent = periodModules.length > 0 ? Math.round((completedCount / periodModules.length) * 100) : 0;

                                return (
                                    <>
                                        <section className="detail-card curriculum-card mt-6">
                                            <header>
                                                <span className="icon-tile blue">
                                                    <BookOpen />
                                                </span>
                                                <div className="flex-1">
                                                    <h2>Materi Kurikulum ({currentPeriod.name}) - {activeBidang}</h2>
                                                    <span className="text-xs text-[#61718d] block mt-0.5">
                                                        Silabus capaian kompetensi bidang {activeBidang} yang diverifikasi oleh mentor.
                                                    </span>
                                                </div>
                                                <span className="font-semibold text-xs md:text-sm text-[#075cdb] bg-[#eef5ff] border border-[#d2e4ff] px-3 py-1.5 rounded-full shrink-0">
                                                    {completedCount} / {periodModules.length} selesai
                                                </span>
                                            </header>

                                            {/* Progres silabus */}
                                            <div className="mt-4 mb-2">
                                                <div className="flex justify-between items-center text-xs font-bold text-[#647590] mb-1.5">
                                                    <span>Ketercapaian Materi Silabus {activeBidang} ({currentPeriod.name})</span>
                                                    <span className="text-[#075cdb]">{progressPercent}%</span>
                                                </div>
                                                <div className="w-full bg-[#e8eef8] rounded-full h-2 overflow-hidden">
                                                    <div
                                                        className="bg-[#075cdb] h-full rounded-full transition-all duration-300"
                                                        style={{ width: `${progressPercent}%` }}
                                                    />
                                                </div>
                                            </div>

                                            {periodModules.map((item, idx) => {
                                                const isCompleted = completedIndices.includes(idx);
                                                return (
                                                    <article
                                                        key={`${item.title}-${idx}`}
                                                        className={`transition-colors ${isCompleted ? 'border-[#a2e8bc] bg-[#f7fcf8]' : ''}`}
                                                    >
                                                        <BookOpen className={isCompleted ? 'text-[#0b8a46]' : 'text-[#697a94]'} />
                                                        <div className="flex-1">
                                                            <div className="flex items-start justify-between gap-3">
                                                                <b className={isCompleted ? 'text-[#0e5831]' : ''}>{item.title}</b>
                                                                {isCompleted ? (
                                                                    <span className="shrink-0 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#e9f9ef] text-[#0b8a46] border border-[#a2e8bc]">
                                                                        <Check size={13} strokeWidth={3} /> Selesai
                                                                    </span>
                                                                ) : (
                                                                    <span className="shrink-0 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-500">
                                                                        Materi Silabus
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <div className="my-1.5 flex flex-wrap gap-2 text-xs">
                                                                <em className={item.type === 'Teori' ? 'theory' : 'practice'}>
                                                                    {item.type}
                                                                </em>
                                                                <span>Bulan ke-{currentPeriod.id}</span>
                                                                <span>{item.days || '5 hari'}</span>
                                                            </div>
                                                            <p>{item.description}</p>
                                                        </div>
                                                    </article>
                                                );
                                            })}
                                        </section>

                                        <section className="detail-card focus-card mt-6 mb-8">
                                            <header>
                                                <span className="icon-tile purple">
                                                    <Target />
                                                </span>
                                                <div>
                                                    <b>Fokus Pembelajaran dari Mentor ({activeBidang} - {currentPeriod.name})</b>
                                                    <p className="mt-0.5 text-sm text-[#61718d]">
                                                        Arahan pembelajaran khusus dari mentor untuk bidang {activeBidang} pada {currentPeriod.name}.
                                                    </p>
                                                </div>
                                            </header>
                                            <div className="mt-4 rounded-2xl border border-[#d5e1ef] bg-[#f8fbff] p-5 text-base text-[#1e3155]">
                                                <p className="font-semibold leading-relaxed whitespace-pre-line">
                                                    &ldquo;{activeFocus?.focus_text ? activeFocus.focus_text : currentPeriod.mentorFocus}&rdquo;
                                                </p>
                                                <div className="mt-4 pt-3 border-t border-[#e1ebf6] flex items-center justify-between flex-wrap gap-2">
                                                    <span className="text-xs font-bold text-[#647590]">
                                                        &mdash; {activeFocus?.mentor_name || 'Tim Mentor Kokek'}
                                                    </span>
                                                    {activeFocus?.updated_at && (
                                                        <span className="text-xs text-[#7f90a6]">
                                                            Diperbarui: {activeFocus.updated_at}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </section>
                                    </>
                                );
                            })()}
                        </main>
                    )}

                    {/* Halaman Penilaian */}
                    {page === 'assessment' && (
                        <main className="page detail-page">
                            <header className="participant-header">
                                <button onClick={() => setPage('home')} aria-label="Kembali">
                                    <ArrowLeft />
                                </button>
                                <div>
                                    <b>Evaluasi & Penilaian</b>
                                    <span>{currentPeriod.name} &middot; {currentPeriod.rangeLabel}</span>
                                </div>
                            </header>

                            <div className="period-picker">
                                <button
                                    type="button"
                                    onClick={() => setPeriodIndex((prev) => Math.max(0, prev - 1))}
                                    disabled={periodIndex === 0}
                                    title="Periode Sebelumnya"
                                    className="cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                                >
                                    <ChevronLeft />
                                </button>
                                <div>
                                    <b>{currentPeriod.name}</b>
                                    <span>{currentPeriod.rangeLabel}</span>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setPeriodIndex((prev) => Math.min(internshipPeriods.length - 1, prev + 1))}
                                    disabled={periodIndex === internshipPeriods.length - 1}
                                    title="Periode Selanjutnya"
                                    className="cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                                >
                                    <ChevronRight />
                                </button>
                            </div>

                            {currentPeriodEvaluation ? (
                                <section className="detail-card assessment-card mt-6 mb-8">
                                    <header>
                                        <span className="icon-tile blue">
                                            <Star />
                                        </span>
                                        <div>
                                            <b>Hasil Evaluasi {currentPeriod.name}</b>
                                            <small className="block text-sm text-[#61718d]">
                                                {currentPeriod.rangeLabel} &middot; Oleh Mentor {currentPeriodEvaluation.mentor_name} {currentPeriodEvaluation.evaluated_at && `(${currentPeriodEvaluation.evaluated_at})`}
                                            </small>
                                        </div>
                                        <span className="status-pill ml-auto !bg-[#ecfdf5] !text-[#059669] !border-[#a7f3d0]">
                                            ✓ Dinilai
                                        </span>
                                    </header>

                                    <div className="scale-legend">
                                        <span><b>SB</b> = Sangat Baik</span>
                                        <span><b>B</b> = Baik</span>
                                        <span><b>C</b> = Cukup</span>
                                        <span><b>K</b> = Kurang</span>
                                    </div>

                                    <RatingTable
                                        title="Aspek Penilaian"
                                        rows={assessmentAspects}
                                        values={currentPeriodEvaluation.ratings || {}}
                                    />

                                    {(() => {
                                        const activeBidang = activeFocus?.bidang || user?.bidang || 'UI/UX Designer';
                                        const evalModules = activeFocus?.modules && activeFocus.modules.length > 0
                                            ? activeFocus.modules
                                            : getCurriculumTemplate(activeBidang, currentPeriod.id);
                                        return (
                                            <RatingTable
                                                title={`Capaian Kurikulum (${activeBidang})`}
                                                rows={evalModules.map((x) => x.title)}
                                                values={currentPeriodEvaluation.ratings || {}}
                                                purple
                                            />
                                        );
                                    })()}

                                    <div className="comment-box mt-6">
                                        <h3 className="mb-2 text-sm font-bold text-[#a46b00]">
                                            Komentar & Catatan Mentor:
                                        </h3>
                                        <p className="text-sm font-medium leading-relaxed text-[#513b0c]">
                                            {currentPeriodEvaluation.mentor_comment || 'Tidak ada komentar khusus.'}
                                        </p>
                                    </div>
                                </section>
                            ) : (
                                <section className="detail-card assessment-card mt-6 mb-8 p-8 text-center">
                                    <header className="flex items-center justify-between pb-4 border-b border-[#e9f0fa]">
                                        <div className="flex items-center gap-3">
                                            <span className="icon-tile blue">
                                                <Star />
                                            </span>
                                            <div className="text-left">
                                                <b>Hasil Evaluasi {currentPeriod.name}</b>
                                                <small className="block text-sm text-[#61718d]">
                                                    {currentPeriod.rangeLabel}
                                                </small>
                                            </div>
                                        </div>
                                        <span className="status-pill ml-auto !bg-[#f1f5f9] !text-[#64748b]">
                                            Belum Diisi
                                        </span>
                                    </header>
                                    <div className="py-12 text-[#64748b]">
                                        <Clock3 size={44} className="mx-auto mb-3 text-[#94a3b8]" />
                                        <p className="text-base font-semibold text-[#1e293b] m-0">
                                            Evaluasi bulanan untuk {currentPeriod.name} belum dilakukan oleh mentor.
                                        </p>
                                        <p className="mt-1.5 text-sm text-[#64748b]">
                                            Penilaian perkembangan akan diberikan oleh mentor pada akhir periode magang.
                                        </p>
                                    </div>
                                </section>
                            )}
                        </main>
                    )}

                    {/* Halaman Akun Peserta */}
                    {page === 'account' && (
                        <main className="page account-page">
                            <h1>Akun Peserta</h1>
                            <p className="subtitle">Kelola informasi akun dan akses profil Anda.</p>

                            <section className="profile-card">
                                {user.avatar_url ? (
                                    <img
                                        src={user.avatar_url}
                                        alt={user.name}
                                        className="initial-avatar big object-cover"
                                    />
                                ) : (
                                    <div className="initial-avatar big">{initials}</div>
                                )}
                                <div>
                                    <b>{user.name}</b>
                                    <span>Peserta Magang &middot; {user.bidang || 'UI/UX Designer'}</span>
                                    <span>
                                        <Mail /> {user.email}
                                    </span>
                                    <span>
                                        <Phone /> 082155006246
                                    </span>
                                </div>
                            </section>

                            <section className="account-info">
                                <header>
                                    <h2>Informasi Akun</h2>
                                    <span className="status-pill">Peserta Magang</span>
                                </header>
                                <dl>
                                    {[
                                        ['Nama Lengkap', user.name],
                                        ['Role', 'Peserta Magang'],
                                        ['Perusahaan', 'Kokek'],
                                        ['Posisi', user.bidang || 'UI/UX Designer'],
                                        ['Batch', batch?.name || 'Belum Ditugaskan'],
                                        ['Periode Batch', batch ? `${batch.start_date} - ${batch.end_date}` : 'Belum Ditentukan'],
                                        ['Email', user.email],
                                    ].map(([k, v]) => (
                                        <div key={k}>
                                            <dt>{k}</dt>
                                            <dd>{v}</dd>
                                        </div>
                                    ))}
                                </dl>
                            </section>

                            <button
                                className="guide-card"
                                onClick={() => router.visit(route('profile.edit'))}
                            >
                                <span className="icon-tile blue">
                                    <BookOpen />
                                </span>
                                <span>
                                    <b>Kelola Profil</b>
                                    <small>Perbarui foto avatar, kata sandi, dan data akun.</small>
                                </span>
                                <ChevronRight />
                            </button>

                            <button
                                className="logout-button"
                                onClick={() => router.post(route('logout'))}
                            >
                                <LogOut /> Keluar dari akun
                            </button>
                        </main>
                    )}

                    <div className="footer-spacer" />
                    <ServerTime />

                    {/* Modals */}
                    <NotificationModal
                        isOpen={showNotifications}
                        onClose={() => setShowNotifications(false)}
                        onOpenAnnouncement={(announcementId) => {
                            setHighlightAnnouncementId(announcementId);
                            setShowAnnouncements(true);
                        }}
                    />

                    <AnnouncementModal
                        isOpen={showAnnouncements}
                        onClose={() => {
                            setShowAnnouncements(false);
                            setHighlightAnnouncementId(null);
                        }}
                        announcements={announcements}
                        canCreate={false}
                        highlightId={highlightAnnouncementId}
                    />

                    <AttendanceDetailModal
                        isOpen={showDateDetailModal}
                        onClose={() => setShowDateDetailModal(false)}
                        date={selectedCalendarDate}
                        attendance={selectedAttendance}
                        isWeekend={(() => {
                            if (!selectedCalendarDate) return false;
                            const [y, m, d] = selectedCalendarDate.split('-').map(Number);
                            const dow = new Date(Date.UTC(y, m - 1, d)).getUTCDay();
                            return dow === 0 || dow === 6;
                        })()}
                        onFill={(targetDate, existing) => openFormForDate(targetDate, existing)}
                    />

                    {/* Navigasi Bawah Peserta */}
                    <nav className="bottom-nav" aria-label="Navigasi Peserta">
                        {[
                            { id: 'home', label: 'Beranda', icon: Home },
                            { id: 'attendance', label: 'Kehadiran', icon: CalendarCheck },
                            { id: 'curriculum', label: 'Kurikulum', icon: BookOpen },
                            { id: 'account', label: 'Akun', icon: UserRound },
                        ].map(({ id, label, icon: Icon }) => (
                            <button
                                key={id}
                                className={page === id ? 'active' : ''}
                                onClick={() => setPage(id)}
                            >
                                <span className="nav-icon">
                                    <Icon size={25} strokeWidth={2.3} />
                                </span>
                                <span>{label}</span>
                            </button>
                        ))}
                    </nav>
                </div>
            </div>
        </>
    );
}
