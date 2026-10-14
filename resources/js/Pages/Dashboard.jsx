import ServerTime from '@/Components/ServerTime';
import MonevSelect from '@/Components/MonevSelect';
import NotificationModal from '@/Components/NotificationModal';
import AnnouncementModal from '@/Components/AnnouncementModal';
import { Head, router, usePage } from '@inertiajs/react';
import {
    ArrowLeft, Bell, BookOpen, CalendarClock, Check, CheckCircle2, ChevronDown,
    ChevronLeft, ChevronRight, Circle, Clock3, ClipboardCheck, Edit3, Home, Layers,
    LogOut, Mail, Megaphone, Phone, Plus, RotateCcw, Search, Star, Target, Trash2,
    UserRound, UserRoundX, UsersRound, X,
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

const tabs = ['Ringkasan', 'Kehadiran', 'Kurikulum', 'Penilaian', 'Pembayaran'];
const assessmentAspects = [
    'Kehadiran dan disiplin', 'Sikap dan perilaku', 'Kemampuan komunikasi',
    'Inisiatif dan tanggung jawab', 'Kemampuan adaptasi', 'Pengetahuan teknis',
    'Produktivitas dan ketepatan waktu', 'Kerja sama tim'
];

function Avatar({ name = '', size = 76, className = '' }) {
    const initials = name
        ? name
              .trim()
              .split(/\s+/)
              .filter(Boolean)
              .map((p) => p[0])
              .slice(0, 2)
              .join('')
              .toUpperCase()
        : 'P';

    return (
        <div
            className={`initial-avatar grid place-items-center font-extrabold text-white shrink-0 shadow-xs ring-2 ring-[#075cdb]/20 ${className}`}
            style={{
                width: `${size}px`,
                height: `${size}px`,
                fontSize: `${Math.round(size * 0.36)}px`,
            }}
            aria-label={`Inisial ${name}`}
        >
            {initials}
        </div>
    );
}

function BottomNav({ page, setPage }) {
    const items = [
        { id: 'home', label: 'Beranda', icon: Home },
        { id: 'participants', label: 'Peserta', icon: UsersRound },
        { id: 'account', label: 'Akun', icon: UserRound },
    ];
    const active = page === 'detail' ? 'participants' : page;
    return (
        <nav className="bottom-nav" aria-label="Navigasi utama">
            {items.map(({ id, label, icon: Icon }) => (
                <button
                    key={id}
                    className={active === id ? 'active' : ''}
                    onClick={() => setPage(id)}
                >
                    <span className="nav-icon">
                        <Icon size={27} strokeWidth={2.3} />
                    </span>
                    <span>{label}</span>
                </button>
            ))}
        </nav>
    );
}

function HomePage({
    setPage,
    openDetail,
    user,
    pendingCount,
    announcements = [],
    onOpenNotifications,
    onOpenAnnouncements,
}) {
    const unreadNotificationsCount = usePage().props.unreadNotificationsCount || 0;
    const firstName = user.name.split(' ')[0];
    return (
        <main className="page home-page">
            <div className="welcome-row">
                <div>
                    <h1>Halo, Mentor {firstName} <span>👋</span></h1>
                    <p>Kokek</p>
                </div>
                <div className="flex items-center gap-2.5">
                    <button
                        type="button"
                        onClick={onOpenNotifications}
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
                        onClick={onOpenAnnouncements}
                        className="grid h-10 w-10 place-items-center rounded-2xl border border-[#d5e1ef] bg-white text-[#576983] shadow-xs transition hover:bg-[#f0f6ff] hover:text-[#075cdb] cursor-pointer"
                        title="Papan Pengumuman"
                    >
                        <Megaphone size={19} />
                    </button>
                    <button
                        type="button"
                        onClick={() => setPage('account')}
                        title="Akun Mentor"
                    >
                        {user.avatar_url ? (
                            <img
                                src={user.avatar_url}
                                alt={user.name}
                                className="initial-avatar object-cover ring-2 ring-[#075cdb]/20"
                            />
                        ) : (
                            <div className="initial-avatar">
                                {user.name.split(' ').map((p) => p[0]).slice(0, 2).join('')}
                            </div>
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

            <button
                type="button"
                onClick={onOpenAnnouncements}
                className="announcement cursor-pointer w-full text-left"
            >
                <span className="alert-dot">!</span>
                <b>{announcements.length} Pengumuman Aktif</b>
                <u>Kelola & Lihat pengumuman &rarr;</u>
            </button>

            <h2>Perlu Tindakan</h2>
            <button
                className="action-card"
                onClick={() => openDetail('Kehadiran')}
            >
                <span className="icon-tile orange">
                    <CalendarClock />
                </span>
                <span>
                    <b>Kehadiran Baru</b>
                    <small>{pendingCount > 0 ? `${pendingCount} perlu ditinjau` : 'Seluruh kehadiran telah ditinjau'}</small>
                </span>
                <span className="count">{pendingCount}</span>
                <ChevronRight />
            </button>
            <button
                className="action-card"
                onClick={() => openDetail('Penilaian')}
            >
                <span className="icon-tile blue">
                    <Star />
                </span>
                <span>
                    <b>Evaluasi Bulanan</b>
                    <small>Sudah dapat diisi</small>
                </span>
                <span className="count">1</span>
                <ChevronRight />
            </button>

            <section className="batch-card">
                <header>
                    <span className="icon-tile blue">
                        <UsersRound />
                    </span>
                    <span>
                        <b>Batch yang Sedang Berjalan</b>
                        <small>1 batch dengan peserta aktif</small>
                    </span>
                </header>
                <div className="batch-info">
                    <span>
                        <b>Batch 2</b>
                        <small>21 Sep 2026 - 20 Mar 2027</small>
                    </span>
                    <span>
                        <b>1 peserta aktif</b>
                        <small>{pendingCount > 0 ? `${pendingCount + 1} perlu tindakan` : '1 perlu tindakan'}</small>
                    </span>
                </div>
                <button onClick={() => setPage('participants')}>Lihat semua peserta</button>
            </section>
        </main>
    );
}

function ParticipantsPage({ openDetail, pendingCount, participants = [], batches = [] }) {
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [actionFilter, setActionFilter] = useState('all');
    const [batchFilter, setBatchFilter] = useState('all');

    const list = participants.length > 0 ? participants : [
        {
            id: 3,
            name: 'M. Riyan Akbari',
            role: 'UI/UX Designer',
            batch: 'Batch 1 - Tahun 2026',
            period: '21 Sep 2026 - 20 Mar 2027',
        }
    ];

    const filtered = useMemo(() => {
        return list.filter((p) => {
            const matchesSearch =
                p.name.toLowerCase().includes(search.toLowerCase()) ||
                (p.email && p.email.toLowerCase().includes(search.toLowerCase()));

            const matchesStatus =
                statusFilter === 'all' ||
                (statusFilter === 'active' && (!p.status || p.status === 'Aktif')) ||
                (statusFilter === 'inactive' && p.status === 'Tidak Aktif');

            const matchesAction =
                actionFilter === 'all' ||
                (actionFilter === 'pending' && pendingCount > 0) ||
                (actionFilter === 'none' && pendingCount === 0);

            const matchesBatch =
                batchFilter === 'all' ||
                (p.batch && p.batch.toLowerCase().includes(batchFilter.toLowerCase()));

            return matchesSearch && matchesStatus && matchesAction && matchesBatch;
        });
    }, [list, search, statusFilter, actionFilter, batchFilter, pendingCount]);

    return (
        <main className="page participants-page">
            <h1>Peserta Magang</h1>
            <p className="subtitle">Cari dan tinjau progres peserta bimbingan Anda.</p>
            <label className="search-box">
                <Search />
                <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Pencarian nama atau email..."
                />
            </label>
            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
                <div>
                    <label className="mb-1 block text-xs font-bold text-[#61718d]">
                        Status Peserta
                    </label>
                    <MonevSelect
                        value={statusFilter}
                        onChangeValue={setStatusFilter}
                        options={[
                            { value: 'all', label: 'Semua Status Peserta' },
                            { value: 'active', label: 'Aktif' },
                            { value: 'inactive', label: 'Tidak Aktif' },
                        ]}
                        size="sm"
                    />
                </div>
                <div>
                    <label className="mb-1 block text-xs font-bold text-[#61718d]">
                        Tindakan yang Diperlukan
                    </label>
                    <MonevSelect
                        value={actionFilter}
                        onChangeValue={setActionFilter}
                        options={[
                            { value: 'all', label: 'Semua Tindakan' },
                            { value: 'pending', label: 'Perlu Verifikasi' },
                            { value: 'none', label: 'Tidak Ada Tindakan' },
                        ]}
                        size="sm"
                    />
                </div>
                <div>
                    <label className="mb-1 block text-xs font-bold text-[#61718d]">
                        Batch Peserta
                    </label>
                    <MonevSelect
                        value={batchFilter}
                        onChangeValue={setBatchFilter}
                        options={[
                            { value: 'all', label: 'Semua Batch' },
                            ...batches.map((b) => ({
                                value: b.name.toLowerCase(),
                                label: b.name,
                            })),
                        ]}
                        size="sm"
                    />
                </div>
            </div>
            <b className="result-count">{filtered.length} peserta bimbingan</b>
            {filtered.length === 0 ? (
                <div className="mt-4 rounded-2xl border border-dashed border-[#c5d4e8] p-8 text-center text-sm text-[#61718d]">
                    Belum ada peserta bimbingan yang sesuai pencarian atau ditugaskan kepada Anda.
                </div>
            ) : (
                filtered.map((item) => (
                    <button
                        key={item.id}
                        className="participant-card cursor-pointer"
                        onClick={() => openDetail('Ringkasan', item)}
                    >
                        {item.avatar_url ? (
                            <img
                                src={item.avatar_url}
                                alt={item.name}
                                className="h-[76px] w-[76px] rounded-full object-cover ring-2 ring-[#075cdb]/20 shrink-0"
                            />
                        ) : (
                            <Avatar name={item.name} size={76} />
                        )}
                        <span className="participant-copy">
                            <b>{item.name}</b>
                            <span>{item.role || 'UI/UX Designer'}</span>
                            <span>{item.batch || 'Batch 2'} &middot; {item.period || '21 Sep 2026 - 20 Mar 2027'}</span>
                            <em>
                                {pendingCount > 0
                                    ? `Perlu tindakan: ${pendingCount} presensi menunggu verifikasi`
                                    : 'Peserta aktif magang'}
                            </em>
                        </span>
                        <span className="status-pill">Aktif</span>
                        <ChevronRight className="participant-arrow" />
                    </button>
                ))
            )}
        </main>
    );
}

function ParticipantHeader({ goBack, tab, setTab, periodIndex, setPeriodIndex, currentPeriod, participant }) {
    return (
        <>
            <header className="participant-header">
                <button onClick={goBack} aria-label="Kembali">
                    <ArrowLeft />
                </button>
                {participant?.avatar_url ? (
                    <img
                        src={participant.avatar_url}
                        alt={participant.name}
                        className="h-[70px] w-[70px] rounded-full object-cover ring-2 ring-[#075cdb]/20 shrink-0"
                    />
                ) : (
                    <Avatar name={participant?.name || ''} size={70} />
                )}
                <div>
                    <b>{participant?.name || 'M. Riyan Akbari'}</b>
                    <span>{participant?.role || 'UI/UX Designer'}</span>
                    <span>{participant?.batch || 'Batch 2'} &middot; Aktif</span>
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
            <div className="tab-bar">
                {tabs.map((item) => (
                    <button
                        key={item}
                        className={tab === item ? 'active' : ''}
                        onClick={() => setTab(item)}
                    >
                        {item}
                    </button>
                ))}
            </div>
        </>
    );
}

function SummaryTab({ setTab, pendingCount, currentPeriod, periodIndex, attendances = [], participant, evaluations = [], curriculumFocuses = [] }) {
    const periodAttendances = attendances.filter(
        (a) => a.date >= currentPeriod.startDate && a.date <= currentPeriod.endDate
    );
    const periodPending = periodAttendances.filter((a) => a.status === 'pending').length;

    const currentPeriodEval = evaluations.find(
        (e) => Number(e.period_id) === Number(currentPeriod.id)
    );

    const currentPeriodFocus = curriculumFocuses.find(
        (f) => Number(f.period_id) === Number(currentPeriod.id)
    );
    const activeBidang = currentPeriodFocus?.bidang || participant?.bidang || 'UI/UX Designer';
    const periodModules = currentPeriodFocus?.modules && currentPeriodFocus.modules.length > 0
        ? currentPeriodFocus.modules
        : getCurriculumTemplate(activeBidang, currentPeriod?.id);
    const completedModulesCount = currentPeriodFocus?.completed_modules?.length || 0;

    const progress = [
        {
            color: periodPending > 0 ? 'orange' : (periodAttendances.length > 0 ? 'blue-solid' : 'gray'),
            title: 'Kehadiran',
            text: periodPending > 0
                ? `${periodPending} menunggu persetujuan`
                : periodAttendances.length > 0
                ? 'Seluruh kehadiran telah disetujui'
                : 'Belum ada presensi pada periode ini',
            target: 'Kehadiran',
        },
        {
            color: completedModulesCount > 0 ? 'blue-solid' : 'gray',
            title: `Kurikulum & Silabus (${activeBidang})`,
            text: completedModulesCount > 0
                ? `${completedModulesCount} dari ${periodModules.length} materi telah selesai dicapai`
                : `${periodModules.length} materi silabus ${currentPeriod.name}`,
            target: 'Kurikulum',
        },
        {
            color: currentPeriodEval ? 'blue-solid' : (periodIndex === 0 ? 'orange' : 'gray'),
            title: 'Evaluasi Bulanan',
            text: currentPeriodEval
                ? `${currentPeriod.name} · Selesai dinilai (${currentPeriodEval.evaluated_at})`
                : `${currentPeriod.name} · ${currentPeriod.rangeLabel} ${periodIndex === 0 ? 'perlu dilakukan' : 'belum dibuka'}`,
            target: 'Penilaian',
        },
        {
            color: 'gray',
            title: 'Pengajuan Pembayaran Uang Saku',
            text: periodIndex === 0 ? 'Tersedia 20 Okt 2026' : 'Belum dapat dibuat',
            target: 'Pembayaran',
        },
    ];

    const data = [
        ['Nomor Telepon Peserta', participant?.phone || '082155006246'],
        ['Email Peserta', participant?.email || 'rynakbri@gmail.com'],
        ['Lokasi Penempatan', participant?.location || 'KOTA SURABAYA'],
        ['Perusahaan', participant?.company || 'Kokek'],
        ['Posisi', participant?.role || 'UI/UX Designer'],
        ['Batch', participant?.batch || 'Batch 2'],
        ['Periode Magang', participant?.period || '21 Sep 2026 - 20 Mar 2027'],
    ];

    return (
        <>
            <section className="detail-card progress-card">
                <h2>Progres Periode Ini</h2>
                {progress.map((item, i) => (
                    <button key={item.title} onClick={() => setTab(item.target)}>
                        <span className={`step ${item.color}`}>{i + 1}</span>
                        <span>
                            <b>{item.title}</b>
                            <small>{item.text}</small>
                        </span>
                        <ChevronRight />
                    </button>
                ))}
            </section>
            <section className="detail-card info-card">
                <div className="active-notice">
                    <CheckCircle2 />
                    <span>
                        <b>Aktif</b>
                        <small>Magang berlangsung sesuai rencana.</small>
                    </span>
                </div>
                <h2>Informasi Peserta</h2>
                <dl>
                    {data.map(([key, value]) => (
                        <div key={key}>
                            <dt>{key}</dt>
                            <dd>{value}</dd>
                        </div>
                    ))}
                </dl>
            </section>
            <section className="detail-card termination-card">
                <header>
                    <span className="icon-tile red">
                        <UserRoundX />
                    </span>
                    <span>
                        <b>Usulan Pemberhentian</b>
                        <small>Ajukan usulan pemberhentian peserta untuk ditinjau operator perusahaan melalui MagangHub.</small>
                    </span>
                </header>
                <button>
                    <span className="icon-tile red">
                        <UserRoundX />
                    </span>
                    <span>
                        <b>Ajukan Usulan Pemberhentian</b>
                        <small>Isi alasan dan tanggal efektif untuk ditinjau operator perusahaan.</small>
                    </span>
                    <ChevronRight />
                </button>
            </section>
        </>
    );
}

function DayStatus({ status }) {
    if (status.includes('check')) return <Check size={17} />;
    if (status === 'permit') return <b>−</b>;
    if (status === 'action') return <b>▲</b>;
    if (status === 'revision') return <b>◆</b>;
    if (status === 'rejected') return <b>&times;</b>;
    if (status === 'holiday') return <b className="holiday-dot">■</b>;
    return <Circle size={10} />;
}

function AttendanceTab({ attendances = [], currentPeriod }) {
    const calendarWeeks = useMemo(() => {
        return getPeriodWeeks(currentPeriod.startDate, currentPeriod.endDate, '2026-10-13');
    }, [currentPeriod]);

    // Cari tanggal yang pending di periode ini terlebih dahulu, atau hari ini, atau tanggal awal periode
    const [selectedDate, setSelectedDate] = useState(() => {
        const periodAttendances = attendances.filter(
            (a) => a.date >= currentPeriod.startDate && a.date <= currentPeriod.endDate
        );
        const pending = periodAttendances.find((a) => a.status === 'pending');
        if (pending) return pending.date;
        if ('2026-10-13' >= currentPeriod.startDate && '2026-10-13' <= currentPeriod.endDate) {
            return '2026-10-13';
        }
        if (periodAttendances.length > 0) return periodAttendances[0].date;
        return currentPeriod.startDate;
    });

    useEffect(() => {
        const periodAttendances = attendances.filter(
            (a) => a.date >= currentPeriod.startDate && a.date <= currentPeriod.endDate
        );
        const pending = periodAttendances.find((a) => a.status === 'pending');
        if (pending) {
            setSelectedDate(pending.date);
        } else if ('2026-10-13' >= currentPeriod.startDate && '2026-10-13' <= currentPeriod.endDate) {
            setSelectedDate('2026-10-13');
        } else if (periodAttendances.length > 0) {
            setSelectedDate(periodAttendances[0].date);
        } else {
            setSelectedDate(currentPeriod.startDate);
        }
    }, [currentPeriod, attendances]);

    const [mentorNote, setMentorNote] = useState('');
    const [processing, setProcessing] = useState(false);
    const [showReverify, setShowReverify] = useState(false);

    const selectedAttendance = useMemo(() => {
        return attendances.find((a) => a.date === selectedDate);
    }, [attendances, selectedDate]);

    useEffect(() => {
        if (selectedAttendance?.mentor_note) {
            setMentorNote(selectedAttendance.mentor_note);
        } else {
            setMentorNote('');
        }
        setShowReverify(false);
    }, [selectedAttendance]);

    const handleVerify = (action) => {
        if (!selectedAttendance) return;
        setProcessing(true);
        router.post(
            route('attendances.verify', selectedAttendance.id),
            {
                action,
                mentor_note: mentorNote,
            },
            {
                preserveScroll: true,
                onFinish: () => {
                    setProcessing(false);
                    setShowReverify(false);
                },
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

        if (dayObj.date === selectedDate) {
            base += ' selected';
        }
        return base;
    };

    return (
        <>
            {/* Kalender Kehadiran */}
            <section className="detail-card calendar-card">
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
                                        onClick={() => setSelectedDate(dayObj.date)}
                                        title={`Pilih tanggal ${dayObj.day}`}
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
                    <span className="warning">&#9650; Perlu Tindakan Anda</span>
                    <span className="pending">&#9670; Menunggu Tindakan Pemagang</span>
                    <span className="blank">&#9675; Belum Diisi</span>
                    <span className="off">&blacksquare; Hari Libur</span>
                </div>
            </section>

            {/* Kartu Detail / Verifikasi Sesuai Mockup 2.2.1 Verifikasi Kehadiran.png */}
            {selectedAttendance ? (
                <section className="detail-card attendance-detail mt-6">
                    <header className="flex items-center justify-between pb-4">
                        <div>
                            <h2 className="text-xl font-bold text-[#061737]">
                                {formatIndonesianDate(selectedAttendance.date)}
                            </h2>
                            <span className="flex items-center gap-1.5 text-sm font-semibold text-[#667794]">
                                <Clock3 size={17} /> {selectedAttendance.time || '15.52 WIB'}
                            </span>
                        </div>

                        {selectedAttendance.status === 'pending' && (
                            <span className="warning-pill !bg-[#fff1df] !text-[#f17a00] font-bold">
                                Kehadiran Baru Perlu Ditinjau
                            </span>
                        )}
                        {selectedAttendance.status === 'approved' && (
                            <span className="status-pill">
                                {selectedAttendance.type === 'Izin' ? 'Izin disetujui' : 'Hadir disetujui'}
                            </span>
                        )}
                        {selectedAttendance.status === 'needs_revision' && (
                            <span className="status-pill !bg-[#edf4ff] !text-[#075cdb] font-bold">
                                Menunggu Tindakan Pemagang
                            </span>
                        )}
                        {selectedAttendance.status === 'rejected' && (
                            <span className="status-pill !bg-[#ffeef0] !text-[#d02a2a] font-bold">
                                Kehadiran Ditolak
                            </span>
                        )}
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

                    {/* Jika status pending ATAU mentor ingin mengubah verifikasi */}
                    {(selectedAttendance.status === 'pending' || showReverify) ? (
                        <div className="mt-5 border-t border-[#e5ebf2] pt-5">
                            <label className="block mb-2 text-sm font-bold text-[#455773]">
                                Catatan Mentor
                            </label>
                            <textarea
                                value={mentorNote}
                                onChange={(e) => setMentorNote(e.target.value)}
                                placeholder="Catatan Mentor"
                                rows={3}
                                className="w-full rounded-2xl border border-[#c5d4e8] p-4 text-[15px] text-[#071a3b] placeholder-[#8a9bb2] focus:border-[#075cdb] focus:outline-none focus:ring-2 focus:ring-[#075cdb]/20"
                            />

                            {/* Tiga Tombol Aksi Persis UI-Design/2.2.1 Verifikasi Kehadiran.png */}
                            <div className="mt-4 space-y-3 pb-6">
                                <button
                                    type="button"
                                    disabled={processing}
                                    onClick={() => handleVerify('approve_revision')}
                                    className="w-full rounded-2xl bg-[#ff9800] hover:bg-[#f57c00] active:scale-[0.99] disabled:opacity-60 text-white font-extrabold py-3.5 px-4 text-[15px] shadow-sm transition flex items-center justify-center gap-2 cursor-pointer"
                                >
                                    {processing ? 'Memproses...' : 'Setujui Kehadiran, tapi Minta Perbaikan Uraian'}
                                </button>
                                <div className="flex gap-3">
                                    <button
                                        type="button"
                                        disabled={processing}
                                        onClick={() => handleVerify('approve')}
                                        className="flex-1 rounded-2xl bg-[#10b981] hover:bg-[#059669] active:scale-[0.99] disabled:opacity-60 text-white font-extrabold py-3.5 px-4 text-[15px] shadow-sm transition flex items-center justify-center gap-2 cursor-pointer"
                                    >
                                        {processing ? 'Memproses...' : 'Setujui Kehadiran'}
                                    </button>
                                    <button
                                        type="button"
                                        disabled={processing}
                                        onClick={() => handleVerify('reject')}
                                        className="flex-1 rounded-2xl bg-[#dc2626] hover:bg-[#b91c1c] active:scale-[0.99] disabled:opacity-60 text-white font-extrabold py-3.5 px-4 text-[15px] shadow-sm transition flex items-center justify-center gap-2 cursor-pointer"
                                    >
                                        {processing ? 'Memproses...' : 'Tolak Kehadiran'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        /* Tampilan Catatan Mentor yang telah tersimpan */
                        <div className="mt-4 border-t border-[#e5ebf2] pt-4 pb-6">
                            {selectedAttendance.mentor_note && (
                                <div className="rounded-2xl bg-[#f7faff] border border-[#d9e7f7] p-4 text-[15px]">
                                    <b className="block text-[#075cdb] font-bold mb-1">Catatan Mentor:</b>
                                    <p className="text-[#1a2d4f] m-0">{selectedAttendance.mentor_note}</p>
                                </div>
                            )}
                            <div className="mt-4 flex justify-end">
                                <button
                                    type="button"
                                    onClick={() => setShowReverify(true)}
                                    className="inline-flex items-center gap-2 text-sm font-bold text-[#075cdb] hover:underline"
                                >
                                    <Edit3 size={16} /> Ubah Hasil Verifikasi
                                </button>
                            </div>
                        </div>
                    )}
                </section>
            ) : (
                /* Hari yang dipilih belum diisi */
                <section className="detail-card attendance-detail mt-6 p-6 text-center">
                    <header className="flex items-center justify-between pb-4">
                        <div>
                            <h2 className="text-xl font-bold text-[#061737]">
                                {formatIndonesianDate(selectedDate)}
                            </h2>
                        </div>
                        <span className="neutral-pill">Belum Diisi</span>
                    </header>
                    <div className="py-8 text-[#677794]">
                        <Clock3 size={36} className="mx-auto mb-2 text-[#9bb0cb]" />
                        <p className="text-base font-semibold m-0">
                            Peserta belum mengisi catatan kehadiran untuk tanggal ini.
                        </p>
                    </div>
                </section>
            )}
        </>
    );
}

function CurriculumTab({ currentPeriod, participant, curriculumFocuses = [] }) {
    const existingFocus = useMemo(() => {
        return curriculumFocuses.find((f) => Number(f.period_id) === Number(currentPeriod?.id));
    }, [curriculumFocuses, currentPeriod]);

    const initialBidang = existingFocus?.bidang || participant?.bidang || 'UI/UX Designer';
    const [bidang, setBidang] = useState(initialBidang);
    const [focus, setFocus] = useState(existingFocus?.focus_text || '');
    const [completedModules, setCompletedModules] = useState(existingFocus?.completed_modules || []);
    const [modules, setModules] = useState(() => {
        if (existingFocus?.modules && existingFocus.modules.length > 0) {
            return existingFocus.modules;
        }
        return getCurriculumTemplate(initialBidang, currentPeriod?.id);
    });
    const [saved, setSaved] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    // Modal state for Add / Edit Module
    const [modalOpen, setModalOpen] = useState(false);
    const [editingIndex, setEditingIndex] = useState(null);
    const [moduleForm, setModuleForm] = useState({
        title: '',
        type: 'Praktik',
        days: '5 hari',
        description: '',
    });

    useEffect(() => {
        const found = curriculumFocuses.find((f) => Number(f.period_id) === Number(currentPeriod?.id));
        const activeBdg = found?.bidang || participant?.bidang || 'UI/UX Designer';
        setBidang(activeBdg);
        setFocus(found?.focus_text || '');
        const initialModules = (found?.modules && found.modules.length > 0)
            ? found.modules
            : getCurriculumTemplate(activeBdg, currentPeriod?.id);
        setModules(initialModules);
        setCompletedModules(getCompletedModuleIndices(found?.completed_modules, initialModules));
        setSaved(false);
    }, [currentPeriod, curriculumFocuses, participant]);

    const completedCount = completedModules.length;
    const progressPercent = modules.length > 0 ? Math.round((completedCount / modules.length) * 100) : 0;

    const handleSelectBidang = (newBidang) => {
        if (!newBidang) return;
        setBidang(newBidang);
        const template = getCurriculumTemplate(newBidang, currentPeriod?.id);
        setModules(template);
        setCompletedModules([]);
        setSaved(false);
    };

    const handleApplyTemplate = () => {
        const template = getCurriculumTemplate(bidang, currentPeriod?.id);
        setModules(template);
        setCompletedModules([]);
        setSaved(false);
    };

    const toggleModule = (index) => {
        setCompletedModules((prev) => {
            const next = prev.includes(index)
                ? prev.filter((i) => i !== index)
                : [...prev, index];
            return next;
        });
        setSaved(false);
    };

    const openAddModule = () => {
        setEditingIndex(null);
        setModuleForm({
            title: '',
            type: 'Praktik',
            days: '5 hari',
            description: '',
        });
        setModalOpen(true);
    };

    const openEditModule = (index) => {
        setEditingIndex(index);
        const item = modules[index];
        setModuleForm({
            title: item.title || '',
            type: item.type || 'Praktik',
            days: item.days || '5 hari',
            description: item.description || '',
        });
        setModalOpen(true);
    };

    const handleSaveModuleModal = (e) => {
        e.preventDefault();
        if (!moduleForm.title.trim()) return;

        if (editingIndex !== null) {
            setModules((prev) => {
                const next = [...prev];
                next[editingIndex] = { ...moduleForm };
                return next;
            });
        } else {
            setModules((prev) => [...prev, { ...moduleForm }]);
        }
        setModalOpen(false);
        setSaved(false);
    };

    const handleDeleteModule = (index) => {
        if (confirm('Apakah Anda yakin ingin menghapus materi ini dari kurikulum?')) {
            setModules((prev) => prev.filter((_, i) => i !== index));
            setCompletedModules((prev) => {
                return prev
                    .filter((i) => i !== index)
                    .map((i) => (i > index ? i - 1 : i));
            });
            setSaved(false);
        }
    };

    const handleSave = () => {
        if (!participant) return;
        setSubmitting(true);
        router.post(
            route('curriculum.focus'),
            {
                participant_id: participant.id,
                period_id: currentPeriod?.id || 1,
                bidang: bidang,
                modules: modules,
                focus_text: focus,
                completed_modules: completedModules,
            },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setSaved(true);
                },
                onFinish: () => setSubmitting(false),
            }
        );
    };

    return (
        <>
            {/* Banner Pengaturan Bidang Peserta */}
            <div className="mb-5 p-4 rounded-2xl bg-gradient-to-r from-[#eef6ff] to-[#f4f8ff] border border-[#d2e4ff] flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <span className="icon-tile blue shrink-0">
                        <Layers />
                    </span>
                    <div>
                        <div className="flex items-center gap-2 flex-wrap">
                            <b className="text-base text-[#1c2d4a]">Bidang Magang: {bidang}</b>
                            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#075cdb] text-white">
                                {participant?.name || 'Peserta'}
                            </span>
                        </div>
                        <p className="text-xs text-[#5f718d] m-0 mt-0.5">
                            Sesuaikan kurikulum materi dengan bidang profesi peserta.
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                    <div className="w-56">
                        <MonevSelect
                            size="sm"
                            options={availableBidang.map((b) => ({ value: b, label: b }))}
                            value={bidang}
                            onChangeValue={(val) => handleSelectBidang(val)}
                            placeholder="Pilih Bidang..."
                        />
                    </div>
                    <button
                        type="button"
                        onClick={handleApplyTemplate}
                        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-white text-[#075cdb] border border-[#bcd7fb] hover:bg-[#e1edfe] transition cursor-pointer shrink-0"
                        title="Muat ulang kurikulum standar untuk bidang ini"
                    >
                        <RotateCcw size={14} />
                        <span>Reset Template</span>
                    </button>
                </div>
            </div>

            <section className="detail-card curriculum-card">
                <header className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-3 flex-1 min-w-[240px]">
                        <span className="icon-tile blue">
                            <BookOpen />
                        </span>
                        <div>
                            <h2>Kurikulum Magang - {bidang} ({currentPeriod?.name || 'Periode 1'})</h2>
                            <span className="text-xs text-[#61718d] block mt-0.5">
                                Pantau ketercapaian, tambah modul kustom, & atur silabus untuk {participant?.name || 'peserta'}.
                            </span>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="font-semibold text-xs md:text-sm text-[#075cdb] bg-[#eef5ff] border border-[#d2e4ff] px-3 py-1.5 rounded-full shrink-0">
                            {completedCount} / {modules.length} selesai
                        </span>
                        <button
                            type="button"
                            onClick={openAddModule}
                            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#075cdb] text-white text-xs font-bold hover:bg-[#064eb9] transition cursor-pointer shadow-xs"
                        >
                            <Plus size={15} strokeWidth={2.5} />
                            <span>Tambah Materi</span>
                        </button>
                    </div>
                </header>

                {/* Progress bar */}
                <div className="mt-4 mb-2">
                    <div className="flex justify-between items-center text-xs font-bold text-[#647590] mb-1.5">
                        <span>Progres Silabus {bidang} ({currentPeriod?.name})</span>
                        <span className="text-[#075cdb]">{progressPercent}%</span>
                    </div>
                    <div className="w-full bg-[#e8eef8] rounded-full h-2 overflow-hidden">
                        <div
                            className="bg-[#075cdb] h-full rounded-full transition-all duration-300"
                            style={{ width: `${progressPercent}%` }}
                        />
                    </div>
                </div>

                {modules.length === 0 ? (
                    <div className="py-8 text-center text-[#677794]">
                        <BookOpen size={36} className="mx-auto mb-2 text-[#9bb0cb]" />
                        <p className="text-base font-semibold m-0">
                            Belum ada materi kurikulum untuk periode ini.
                        </p>
                        <button
                            type="button"
                            onClick={openAddModule}
                            className="mt-3 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#075cdb] text-white text-xs font-bold"
                        >
                            <Plus size={15} /> Tambah Materi Pertama
                        </button>
                    </div>
                ) : (
                    modules.map((item, idx) => {
                        const isCompleted = completedModules.includes(idx);
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
                                                Belum Selesai
                                            </span>
                                        )}
                                    </div>
                                    <div className="my-1.5 flex flex-wrap gap-2 text-xs">
                                        <em className={item.type === 'Teori' ? 'theory' : 'practice'}>
                                            {item.type}
                                        </em>
                                        <span>Bulan ke-{currentPeriod?.id || 1}</span>
                                        <span>{item.days || '5 hari'}</span>
                                    </div>
                                    <p>{item.description}</p>
                                    <div className="mt-3 pt-2.5 border-t border-slate-200/60 flex items-center justify-between flex-wrap gap-2">
                                        <button
                                            type="button"
                                            onClick={() => toggleModule(idx)}
                                            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                                                isCompleted
                                                    ? 'bg-white border border-[#a2e8bc] text-[#0b8a46] hover:bg-[#ffebeb] hover:text-[#d02a2a] hover:border-[#ffc8c8]'
                                                    : 'bg-white border border-[#cad7e6] text-[#3b516f] hover:bg-[#eef5ff] hover:text-[#075cdb] hover:border-[#b8d4fe]'
                                            }`}
                                        >
                                            {isCompleted ? (
                                                <>
                                                    <CheckCircle2 size={15} />
                                                    <span>Tandai Belum Selesai</span>
                                                </>
                                            ) : (
                                                <>
                                                    <Circle size={15} />
                                                    <span>Tandai Selesai</span>
                                                </>
                                            )}
                                        </button>
                                        <div className="flex items-center gap-1.5">
                                            <button
                                                type="button"
                                                onClick={() => openEditModule(idx)}
                                                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-[#475569] hover:bg-slate-100 transition cursor-pointer"
                                                title="Edit materi kurikulum"
                                            >
                                                <Edit3 size={13} /> Edit
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => handleDeleteModule(idx)}
                                                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-[#dc2626] hover:bg-[#fee2e2] transition cursor-pointer"
                                                title="Hapus materi dari kurikulum"
                                            >
                                                <Trash2 size={13} /> Hapus
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </article>
                        );
                    })
                )}
            </section>

            <section className="detail-card focus-card mt-6">
                <header>
                    <span className="icon-tile purple">
                        <Target />
                    </span>
                    <div>
                        <b>Fokus Pembelajaran <small>Opsional</small></b>
                        <span>Arahan pembelajaran khusus bidang {bidang} untuk {participant?.name || 'peserta'} pada {currentPeriod?.name || 'periode ini'}.</span>
                    </div>
                </header>
                <textarea
                    value={focus}
                    onChange={(e) => {
                        setFocus(e.target.value);
                        setSaved(false);
                    }}
                    placeholder={`Tuliskan fokus arahan pembelajaran ${currentPeriod?.name} bidang ${bidang} untuk ${participant?.name || 'peserta'}...`}
                />
                <footer>
                    <span className="text-xs text-[#647590]">
                        {saved
                            ? `Kurikulum ${bidang} & arahan fokus ${currentPeriod?.name} berhasil disimpan.`
                            : existingFocus?.updated_at
                            ? `Terakhir diperbarui: ${existingFocus.updated_at}`
                            : 'Klik simpan untuk menerapkan kurikulum bidang & fokus ke akun peserta.'}
                    </span>
                    <button
                        type="button"
                        onClick={handleSave}
                        disabled={submitting || !participant}
                        className="cursor-pointer disabled:opacity-60"
                    >
                        {submitting ? 'Menyimpan...' : 'Simpan Kurikulum & Progres'}
                    </button>
                </footer>
            </section>

            {/* Modal Tambah / Edit Materi */}
            {modalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4 sm:p-6 backdrop-blur-xs">
                    <div className="w-full max-w-lg max-h-[calc(100dvh-2rem)] sm:max-h-[calc(100dvh-4rem)] flex flex-col rounded-3xl bg-white shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in duration-150">
                        {/* Modal Header - Fixed */}
                        <div className="shrink-0 flex items-center justify-between p-5 sm:p-6 border-b border-slate-100 bg-white">
                            <div className="flex items-center gap-2.5">
                                <span className="icon-tile blue !w-9 !h-9">
                                    <BookOpen size={18} />
                                </span>
                                <b className="text-lg text-[#1e293b]">
                                    {editingIndex !== null ? 'Edit Materi Kurikulum' : 'Tambah Materi Kurikulum'}
                                </b>
                            </div>
                            <button
                                type="button"
                                onClick={() => setModalOpen(false)}
                                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition cursor-pointer"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Modal Form */}
                        <form onSubmit={handleSaveModuleModal} className="flex-1 min-h-0 flex flex-col overflow-hidden">
                            <div className="flex-1 min-h-0 overflow-y-auto monev-scrollbar p-5 sm:p-6 space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1">
                                        Judul Materi <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={moduleForm.title}
                                        onChange={(e) => setModuleForm({ ...moduleForm, title: e.target.value })}
                                        placeholder="Contoh: Arsitektur RESTful API & Keamanan Endpoint"
                                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-[#075cdb]"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 mb-1">
                                            Tipe Materi
                                        </label>
                                        <select
                                            value={moduleForm.type}
                                            onChange={(e) => setModuleForm({ ...moduleForm, type: e.target.value })}
                                            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-[#075cdb]"
                                        >
                                            <option value="Praktik">Praktik</option>
                                            <option value="Teori">Teori</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 mb-1">
                                            Durasi
                                        </label>
                                        <input
                                            type="text"
                                            value={moduleForm.days}
                                            onChange={(e) => setModuleForm({ ...moduleForm, days: e.target.value })}
                                            placeholder="5 hari"
                                            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-[#075cdb]"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1">
                                        Deskripsi & Capaian Pembelajaran
                                    </label>
                                    <textarea
                                        rows={3}
                                        value={moduleForm.description}
                                        onChange={(e) => setModuleForm({ ...moduleForm, description: e.target.value })}
                                        placeholder="Uraikan target kompetensi yang harus dicapai peserta..."
                                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-[#075cdb]"
                                    />
                                </div>
                            </div>

                            {/* Modal Footer - Fixed */}
                            <div className="shrink-0 flex items-center justify-end gap-2.5 p-4 sm:px-6 border-t border-slate-100 bg-[#fafcff]">
                                <button
                                    type="button"
                                    onClick={() => setModalOpen(false)}
                                    className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition cursor-pointer"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    className="px-5 py-2 rounded-xl text-xs font-bold bg-[#075cdb] text-white hover:bg-[#064eb9] transition cursor-pointer"
                                >
                                    {editingIndex !== null ? 'Perbarui Materi' : 'Tambahkan'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}

function RatingTable({ title, rows, values, setValues, purple = false }) {
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
                        <label key={mark}>
                            <input
                                type="radio"
                                name={`${title}-${i}`}
                                value={mark}
                                checked={values[`${title}-${i}`] === mark}
                                onChange={() =>
                                    setValues({ ...values, [`${title}-${i}`]: mark })
                                }
                            />
                            <span />
                        </label>
                    ))}
                </div>
            ))}
        </div>
    );
}

function AssessmentTab({ currentPeriod, participant, evaluations = [], curriculumFocuses = [] }) {
    const existingEval = useMemo(() => {
        return evaluations.find((e) => Number(e.period_id) === Number(currentPeriod?.id));
    }, [evaluations, currentPeriod]);

    const [values, setValues] = useState({});
    const [comment, setComment] = useState('');
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (existingEval) {
            setValues(existingEval.ratings || {});
            setComment(existingEval.mentor_comment || '');
        } else {
            setValues({});
            setComment('');
        }
    }, [existingEval, currentPeriod]);

    const currentFocus = curriculumFocuses.find((f) => Number(f.period_id) === Number(currentPeriod?.id));
    const activeBidang = currentFocus?.bidang || participant?.bidang || 'UI/UX Designer';
    const modules = currentFocus?.modules && currentFocus.modules.length > 0
        ? currentFocus.modules
        : getCurriculumTemplate(activeBidang, currentPeriod?.id);
    const totalAspects = assessmentAspects.length + modules.length;
    const assessedCount = Object.keys(values).filter((k) => values[k]).length;

    const handleSaveEvaluation = (e) => {
        e.preventDefault();
        if (!participant) return;
        setSubmitting(true);
        router.post(
            route('evaluations.store'),
            {
                participant_id: participant.id,
                period_id: currentPeriod.id,
                ratings: values,
                mentor_comment: comment,
            },
            {
                preserveScroll: true,
                onFinish: () => setSubmitting(false),
            }
        );
    };

    return (
        <section className="detail-card assessment-card">
            <header>
                <span className="icon-tile blue">
                    <ClipboardCheck />
                </span>
                <div>
                    <b>Evaluasi Bulanan ({currentPeriod?.name || 'Periode 1'})</b>
                    <small>Penilaian perkembangan untuk periode yang dipilih.</small>
                </div>
                <span className={`status-pill ml-auto ${existingEval ? '!bg-[#ecfdf5] !text-[#059669] !border-[#a7f3d0]' : '!bg-[#f1f5f9] !text-[#64748b]'}`}>
                    {existingEval ? 'Tersimpan' : 'Belum Diisi'}
                </span>
            </header>
            <div className="scale-legend">
                <span><b>SB</b> = Sangat Baik</span>
                <span><b>B</b> = Baik</span>
                <span><b>C</b> = Cukup</span>
                <span><b>K</b> = Kurang</span>
            </div>
            <b className="assessed-count">{assessedCount} dari {totalAspects} aspek telah dinilai.</b>
            <RatingTable
                title="Aspek Penilaian"
                rows={assessmentAspects}
                values={values}
                setValues={setValues}
            />
            <RatingTable
                title="Capaian Kurikulum"
                rows={modules.map((x) => x.title)}
                values={values}
                setValues={setValues}
                purple
            />
            <div className="comment-box">
                <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Komentar Mentor"
                />
            </div>
            <button
                className="primary-button cursor-pointer disabled:opacity-60"
                type="button"
                disabled={submitting || !participant}
                onClick={handleSaveEvaluation}
            >
                {submitting ? 'Menyimpan...' : 'Simpan Penilaian'}
            </button>
        </section>
    );
}

function PaymentsTab({ setTab, currentPeriod }) {
    return (
        <>
            <section className="payment-alert">
                <span className="icon-tile orange">
                    <CalendarClock />
                </span>
                <span>
                    <b>Pengajuan pembayaran uang saku {currentPeriod?.name} belum dibuka</b>
                    <p>
                        Pengajuan tersedia pada{' '}
                        <strong>{currentPeriod?.paymentWindow}.</strong>
                    </p>
                </span>
            </section>
            <section className="detail-card payment-card">
                <header>
                    <h2>Kesiapan pengajuan pembayaran uang saku ({currentPeriod?.name})</h2>
                    <span className="warning-pill">{currentPeriod?.paymentStatus || 'Belum siap'}</span>
                </header>
                <div>
                    <span className="cross">
                        <X /> Mentor perlu meninjau seluruh kehadiran
                    </span>
                    <button onClick={() => setTab('Kehadiran')}>Tinjau kehadiran</button>
                    <span className="cross">
                        <X /> Mentor perlu menyelesaikan evaluasi bulanan
                    </span>
                    <button onClick={() => setTab('Penilaian')}>Buka penilaian</button>
                    <span className="checked">
                        <Check /> Peserta telah melengkapi data rekening di MagangHub
                    </span>
                    <i />
                    <span className="checked">
                        <Check /> Peserta telah menyelesaikan surat perjanjian magang di MagangHub
                    </span>
                    <i />
                </div>
                <button className="disabled-button" disabled>
                    Ajukan Pembayaran Uang Saku
                </button>
            </section>
        </>
    );
}

function DetailPage({ goBack, initialTab, attendances, pendingCount, flash, participant, evaluations = [], curriculumFocuses = [] }) {
    const [tab, setTab] = useState(initialTab || 'Ringkasan');
    const [periodIndex, setPeriodIndex] = useState(0);
    const currentPeriod = internshipPeriods[periodIndex];

    return (
        <main className="page detail-page">
            <ParticipantHeader
                goBack={goBack}
                tab={tab}
                setTab={setTab}
                periodIndex={periodIndex}
                setPeriodIndex={setPeriodIndex}
                currentPeriod={currentPeriod}
                participant={participant}
            />

            {flash?.success && (
                <div className="mt-4 flex items-center gap-2 rounded-2xl bg-[#e9f9ef] p-4 font-bold text-[#0b8a46]">
                    <Check size={20} /> {flash.success}
                </div>
            )}

            <div className="tab-content">
                {tab === 'Ringkasan' && (
                    <SummaryTab
                        setTab={setTab}
                        pendingCount={pendingCount}
                        currentPeriod={currentPeriod}
                        periodIndex={periodIndex}
                        attendances={attendances}
                        participant={participant}
                        evaluations={evaluations}
                        curriculumFocuses={curriculumFocuses}
                    />
                )}
                {tab === 'Kehadiran' && (
                    <AttendanceTab attendances={attendances} currentPeriod={currentPeriod} />
                )}
                {tab === 'Kurikulum' && (
                    <CurriculumTab
                        currentPeriod={currentPeriod}
                        participant={participant}
                        curriculumFocuses={curriculumFocuses}
                    />
                )}
                {tab === 'Penilaian' && (
                    <AssessmentTab
                        currentPeriod={currentPeriod}
                        participant={participant}
                        evaluations={evaluations}
                        curriculumFocuses={curriculumFocuses}
                    />
                )}
                {tab === 'Pembayaran' && <PaymentsTab setTab={setTab} currentPeriod={currentPeriod} />}
            </div>
        </main>
    );
}

function AccountPage({ user }) {
    const initials = user.name
        .split(' ')
        .map((part) => part[0])
        .slice(0, 2)
        .join('');

    return (
        <main className="page account-page">
            <h1>Akun Mentor</h1>
            <p className="subtitle">Kelola informasi akun dan akses aplikasi Anda.</p>
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
                    <span>Mentor</span>
                    <span>
                        <Mail /> {user.email}
                    </span>
                    <span>
                        <Phone /> 085732748883
                    </span>
                </div>
            </section>
            <section className="account-info">
                <header>
                    <h2>Informasi Akun</h2>
                    <span className="status-pill">Mentor</span>
                </header>
                <dl>
                    {[
                        ['Nama Lengkap', user.name],
                        ['Role', 'Mentor'],
                        ['Asal Perusahaan', 'Kokek'],
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
                    <small>Perbarui profil, avatar, dan kata sandi Anda.</small>
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
    );
}

export default function Dashboard({
    attendances = [],
    pendingAttendancesCount = 0,
    flash = {},
    participant = null,
    participants = [],
    announcements = [],
    evaluations = [],
    curriculumFocuses = [],
    batches = [],
}) {
    const user = usePage().props.auth.user;
    const [page, setPage] = useState('home');
    const [initialTab, setInitialTab] = useState('Ringkasan');

    // Modals state
    const [showNotifications, setShowNotifications] = useState(false);
    const [showAnnouncements, setShowAnnouncements] = useState(false);
    const [highlightAnnouncementId, setHighlightAnnouncementId] = useState(null);

    const openDetail = (tab = 'Ringkasan', selectedParticipant = null) => {
        setInitialTab(tab);
        if (selectedParticipant && participant && selectedParticipant.id !== participant.id) {
            router.visit(route('dashboard', { participant_id: selectedParticipant.id }), {
                preserveScroll: true,
                onSuccess: () => {
                    setPage('detail');
                },
            });
            return;
        }
        setPage('detail');
    };

    return (
        <>
            <Head title="Monev Mentor - Kokek" />
            <div className={`monev-shell ${page === 'detail' ? 'detail-shell' : ''}`}>
                <div className="app-canvas">
                    {page === 'home' && (
                        <HomePage
                            setPage={setPage}
                            openDetail={openDetail}
                            user={user}
                            pendingCount={pendingAttendancesCount}
                            announcements={announcements}
                            onOpenNotifications={() => setShowNotifications(true)}
                            onOpenAnnouncements={() => setShowAnnouncements(true)}
                        />
                    )}
                    {page === 'participants' && (
                        <ParticipantsPage
                            openDetail={openDetail}
                            pendingCount={pendingAttendancesCount}
                            participants={participants}
                            batches={batches}
                        />
                    )}
                    {page === 'detail' && (
                        <DetailPage
                            goBack={() => setPage('participants')}
                            initialTab={initialTab}
                            attendances={attendances}
                            pendingCount={pendingAttendancesCount}
                            flash={flash}
                            participant={participant}
                            evaluations={evaluations}
                            curriculumFocuses={curriculumFocuses}
                        />
                    )}
                    {page === 'account' && <AccountPage user={user} />}

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
                        canCreate={true}
                        highlightId={highlightAnnouncementId}
                    />

                    <div className="footer-spacer" />
                    <ServerTime />
                    <BottomNav page={page} setPage={setPage} />
                </div>
            </div>
        </>
    );
}
