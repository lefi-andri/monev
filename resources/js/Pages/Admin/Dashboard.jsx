import ServerTime from '@/Components/ServerTime';
import MonevSelect from '@/Components/MonevSelect';
import NotificationModal from '@/Components/NotificationModal';
import AnnouncementModal from '@/Components/AnnouncementModal';
import BatchModal from '@/Components/BatchModal';
import BatchAssignModal from '@/Components/BatchAssignModal';
import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import {
    Activity, Bell, ChevronDown, Check, LogOut, Megaphone, Plus, Search, Shield,
    ShieldCheck, Trash2, Upload, UserCog, UserRound, Users, X,
    UserCheck, UserPlus, SlidersHorizontal, AlertCircle, Layers, Calendar, Edit3,
    Bookmark, Sparkles, CheckCircle2
} from 'lucide-react';
import { useMemo, useState } from 'react';

const roleLabels = { admin: 'Admin', mentor: 'Mentor', peserta: 'Peserta' };

export default function AdminDashboard({
    stats,
    users = [],
    activities = [],
    mentorsList = [],
    participantsList = [],
    announcements = [],
    batches = [],
    activeBatch = null,
}) {
    const flash = usePage().props.flash;
    const authUser = usePage().props.auth.user;
    const unreadNotificationsCount = usePage().props.unreadNotificationsCount || 0;
    const [showForm, setShowForm] = useState(false);
    const [search, setSearch] = useState('');
    const [roleFilter, setRoleFilter] = useState('all');
    const [batchFilter, setBatchFilter] = useState('all');

    // Modals state
    const [showNotifications, setShowNotifications] = useState(false);
    const [showAnnouncements, setShowAnnouncements] = useState(false);
    const [highlightAnnouncementId, setHighlightAnnouncementId] = useState(null);

    // Batch modals state
    const [showBatchModal, setShowBatchModal] = useState(false);
    const [editingBatch, setEditingBatch] = useState(null);
    const [assigningBatch, setAssigningBatch] = useState(null);

    // State for modal assigning participants to a mentor
    const [activeMentor, setActiveMentor] = useState(null);
    const [selectedParticipantIds, setSelectedParticipantIds] = useState([]);
    const [isAssigning, setIsAssigning] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        role: 'mentor',
        mentor_id: '',
        batch_id: '',
        participant_ids: [],
        avatar: null,
    });

    const handleRoleChange = (newRole) => {
        setData((prev) => ({
            ...prev,
            role: newRole,
            mentor_id: newRole === 'peserta' ? prev.mentor_id : '',
            batch_id: newRole === 'peserta' ? prev.batch_id : '',
            participant_ids: newRole === 'mentor' ? prev.participant_ids : [],
        }));
    };

    const submit = (event) => {
        event.preventDefault();
        post(route('admin.users.store'), {
            forceFormData: true,
            onSuccess: () => {
                reset();
                setShowForm(false);
            },
        });
    };

    const updateRole = (user, role) =>
        router.patch(
            route('admin.users.update', user.id),
            {
                name: user.name,
                email: user.email,
                role,
            },
            { preserveScroll: true }
        );

    const updateParticipantMentor = (participantId, participantName, participantEmail, mentorId) => {
        router.patch(
            route('admin.users.update', participantId),
            {
                name: participantName,
                email: participantEmail,
                role: 'peserta',
                mentor_id: mentorId ? Number(mentorId) : null,
            },
            { preserveScroll: true }
        );
    };

    const updateParticipantBatch = (participantId, participantName, participantEmail, batchId) => {
        router.patch(
            route('admin.users.update', participantId),
            {
                name: participantName,
                email: participantEmail,
                role: 'peserta',
                batch_id: batchId ? Number(batchId) : null,
            },
            { preserveScroll: true }
        );
    };

    const handleSetActiveBatch = (batch) => {
        if (window.confirm(`Jadikan "${batch.name}" sebagai Batch Aktif utama?`)) {
            router.post(route('admin.batches.set-active', batch.id), {}, { preserveScroll: true });
        }
    };

    const handleDeleteBatch = (batch) => {
        if (window.confirm(`Hapus batch "${batch.name}"? Peserta di batch ini tidak akan dihapus, hanya relasi batch-nya yang dikosongkan.`)) {
            router.delete(route('admin.batches.destroy', batch.id), { preserveScroll: true });
        }
    };

    const openCreateBatch = () => {
        setEditingBatch(null);
        setShowBatchModal(true);
    };

    const openEditBatch = (batch) => {
        setEditingBatch(batch);
        setShowBatchModal(true);
    };

    const openAssignBatch = (batch) => {
        setAssigningBatch(batch);
    };

    const remove = (user) => {
        if (window.confirm(`Hapus akun ${user.name}?`)) {
            router.delete(route('admin.users.destroy', user.id), {
                preserveScroll: true,
            });
        }
    };

    const openAssignModal = (mentor) => {
        setActiveMentor(mentor);
        setSelectedParticipantIds(mentor.participant_ids || []);
    };

    const saveAssignments = () => {
        if (!activeMentor) return;
        setIsAssigning(true);
        router.post(
            route('admin.mentors.assign'),
            {
                mentor_id: activeMentor.id,
                participant_ids: selectedParticipantIds,
            },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setIsAssigning(false);
                    setActiveMentor(null);
                },
                onError: () => {
                    setIsAssigning(false);
                },
            }
        );
    };

    const filteredUsers = useMemo(() => {
        return users.filter((u) => {
            const matchesSearch =
                u.name.toLowerCase().includes(search.toLowerCase()) ||
                u.email.toLowerCase().includes(search.toLowerCase());
            const matchesRole = roleFilter === 'all' || u.role === roleFilter;
            const matchesBatch =
                batchFilter === 'all'
                    ? true
                    : batchFilter === 'none'
                    ? !u.batch_id
                    : String(u.batch_id) === String(batchFilter);
            return matchesSearch && matchesRole && matchesBatch;
        });
    }, [users, search, roleFilter, batchFilter]);

    const cards = [
        ['Total Pengguna', stats.users, Users, 'blue'],
        ['Mentor Magang', stats.mentors, UserCog, 'blue'],
        ['Peserta Magang', stats.participants, Users, 'orange'],
        ['Batch Magang', stats.batches ?? batches.length, Layers, 'purple'],
    ];

    const initials = authUser.name
        .split(' ')
        .map((p) => p[0])
        .slice(0, 2)
        .join('');

    return (
        <>
            <Head title="Dashboard Admin - Monev Magang" />
            <div className="monev-shell">
                <div className="app-canvas">
                    <main className="page home-page">
                        {/* Welcome Header */}
                        <div className="welcome-row">
                            <div>
                                <h1>
                                    Halo, Admin {authUser.name.split(' ')[0]} <span>👋</span>
                                </h1>
                                <p>Kokek &middot; Portal Administrasi Sistem & Pengguna</p>
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
                                <Link href={route('profile.edit')} title="Kelola Profil">
                                    {authUser.avatar_url ? (
                                        <img
                                            src={authUser.avatar_url}
                                            alt={authUser.name}
                                            className="initial-avatar object-cover ring-2 ring-[#075cdb]/20"
                                        />
                                    ) : (
                                        <div className="initial-avatar">{initials}</div>
                                    )}
                                </Link>
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

                        {/* Banner Pengumuman Sistem */}
                        <button
                            type="button"
                            onClick={() => setShowAnnouncements(true)}
                            className="announcement mb-6 cursor-pointer w-full text-left"
                        >
                            <span className="alert-dot">!</span>
                            <b>{announcements.length} Pengumuman Sistem Aktif</b>
                            <u>Kelola & Lihat Pengumuman &rarr;</u>
                        </button>

                        {flash?.success && (
                            <div className="mb-6 flex items-center gap-2 rounded-2xl bg-[#e9f9ef] p-4 font-bold text-[#0b8a46]">
                                <Check size={20} /> {flash.success}
                            </div>
                        )}

                        {/* Banner Batch Aktif Utama */}
                        {activeBatch && (
                            <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-3xl border border-[#b8d6fc] bg-gradient-to-r from-[#eef6ff] via-[#f4f9ff] to-[#edf4ff] p-5 shadow-xs">
                                <div className="flex items-center gap-4">
                                    <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-[#075cdb] text-white shadow-md">
                                        <Layers size={24} />
                                    </span>
                                    <div>
                                        <div className="flex flex-wrap items-center gap-2">
                                            <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#075cdb]">
                                                Angkatan Utama Berjalan
                                            </span>
                                            <span className="inline-flex items-center gap-1 rounded-full bg-[#10b981]/15 px-2.5 py-0.5 text-xs font-bold text-[#059669]">
                                                <CheckCircle2 size={13} /> Batch Aktif
                                            </span>
                                        </div>
                                        <h3 className="text-lg font-extrabold text-[#061737]">
                                            {activeBatch.name}
                                        </h3>
                                        <p className="text-xs text-[#5f718c] flex flex-wrap items-center gap-2 mt-0.5">
                                            <span className="inline-flex items-center gap-1">
                                                <Calendar size={13} /> {activeBatch.start_date_formatted} &mdash; {activeBatch.end_date_formatted}
                                            </span>
                                            <span>&bull;</span>
                                            <span className="font-semibold text-[#075cdb]">
                                                {activeBatch.participants_count} Peserta Terdaftar
                                            </span>
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        type="button"
                                        onClick={() => openAssignBatch(activeBatch)}
                                        className="monev-btn monev-btn-primary shrink-0 text-xs font-bold"
                                    >
                                        <UserPlus size={15} />
                                        Kelola Peserta Batch
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Statistik Grid */}
                        <div className="grid gap-3.5 grid-cols-2">
                            {cards.map(([label, value, Icon, color]) => (
                                <div
                                    key={label}
                                    className="flex items-center gap-4 rounded-3xl border border-[#d5e1ef] bg-white p-5 shadow-xs"
                                >
                                    <span className={`icon-tile ${color}`}>
                                        <Icon />
                                    </span>
                                    <div>
                                        <p className="text-sm font-semibold text-[#61718d]">{label}</p>
                                        <strong className="text-3xl font-extrabold text-[#061737]">
                                            {value}
                                        </strong>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Bagian Pengelolaan Batch & Angkatan Magang */}
                        <section className="detail-card mt-8 overflow-hidden p-6 sm:p-8">
                            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                <div className="flex items-center gap-4">
                                    <span className="icon-tile purple">
                                        <Layers />
                                    </span>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <h2 className="text-xl font-bold text-[#061737]">
                                                Pengelolaan Batch & Angkatan
                                            </h2>
                                            <span className="inline-flex items-center rounded-full bg-[#f3e8ff] px-2.5 py-0.5 text-xs font-extrabold text-[#7e22ce]">
                                                {batches.length} Batch
                                            </span>
                                        </div>
                                        <p className="text-sm text-[#61718d]">
                                            Atur periode pelaksanaan magang, status angkatan, dan alokasi peserta magang ke batch masing-masing.
                                        </p>
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={openCreateBatch}
                                    className="monev-btn monev-btn-primary shrink-0 text-xs font-bold"
                                >
                                    <Plus size={16} />
                                    Tambah Batch Baru
                                </button>
                            </div>

                            {batches.length === 0 ? (
                                <div className="mt-5 rounded-2xl border border-dashed border-[#c5d4e8] p-8 text-center text-sm text-[#61718d]">
                                    <Layers className="mx-auto mb-2 text-[#94a3b8]" size={32} />
                                    <p className="font-semibold text-[#334155]">Belum ada batch magang yang dibuat.</p>
                                    <p className="text-xs text-[#64748b] mt-1">Klik tombol &ldquo;Tambah Batch Baru&rdquo; untuk membuat angkatan pertama.</p>
                                </div>
                            ) : (
                                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {batches.map((b) => {
                                        const statusBadgeClasses = {
                                            active: 'bg-[#ecfdf5] text-[#059669] border-[#a7f3d0]',
                                            upcoming: 'bg-[#fffbeb] text-[#d97706] border-[#fde68a]',
                                            completed: 'bg-[#f1f5f9] text-[#475569] border-[#cbd5e1]',
                                            archived: 'bg-[#f3f4f6] text-[#6b7280] border-[#e5e7eb]',
                                        }[b.status] || 'bg-[#edf4ff] text-[#075cdb] border-[#bfdbfe]';

                                        const statusLabel = {
                                            active: 'Berjalan / Aktif',
                                            upcoming: 'Akan Datang',
                                            completed: 'Selesai',
                                            archived: 'Diarsipkan',
                                        }[b.status] || b.status;

                                        return (
                                            <div
                                                key={b.id}
                                                className={`flex flex-col justify-between rounded-2xl border p-5 transition-all shadow-xs ${
                                                    b.is_active
                                                        ? 'border-[#075cdb] bg-gradient-to-br from-[#f8fbff] to-[#edf4ff] ring-2 ring-[#075cdb]/20'
                                                        : 'border-[#d5e1ef] bg-[#fafcff] hover:bg-white hover:border-[#b8d6fc]'
                                                }`}
                                            >
                                                <div>
                                                    <div className="flex items-start justify-between gap-2">
                                                        <div>
                                                            <div className="flex flex-wrap items-center gap-2">
                                                                <h3 className="font-bold text-[#061737] text-base">
                                                                    {b.name}
                                                                </h3>
                                                                {b.is_active && (
                                                                    <span className="inline-flex items-center gap-1 rounded-full bg-[#075cdb] px-2.5 py-0.5 text-[11px] font-extrabold text-white shadow-xs">
                                                                        <Sparkles size={11} /> Batch Aktif
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-[#687b95]">
                                                                <span className="inline-flex items-center gap-1 font-medium">
                                                                    <Calendar size={13} className="text-[#075cdb]" />
                                                                    {b.start_date_formatted} &mdash; {b.end_date_formatted}
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <span className={`inline-flex items-center rounded-lg border px-2.5 py-0.5 text-[11px] font-bold ${statusBadgeClasses}`}>
                                                            {statusLabel}
                                                        </span>
                                                    </div>

                                                    {b.description && (
                                                        <p className="mt-3 text-xs text-[#52637a] line-clamp-2">
                                                            {b.description}
                                                        </p>
                                                    )}

                                                    <div className="mt-4 flex items-center justify-between border-t border-[#e5edf8] pt-3 text-xs">
                                                        <span className="inline-flex items-center gap-1.5 font-bold text-[#061737]">
                                                            <Users size={14} className="text-[#075cdb]" />
                                                            {b.participants_count} Peserta Terdaftar
                                                        </span>

                                                        {!b.is_active && (
                                                            <button
                                                                type="button"
                                                                onClick={() => handleSetActiveBatch(b)}
                                                                className="text-[11px] font-bold text-[#075cdb] hover:underline cursor-pointer"
                                                            >
                                                                Jadikan Batch Aktif &rarr;
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="mt-4 flex flex-wrap items-center justify-end gap-2 border-t border-[#e5edf8] pt-3">
                                                    <button
                                                        type="button"
                                                        onClick={() => openAssignBatch(b)}
                                                        className="monev-btn monev-btn-secondary !h-8 text-xs font-bold"
                                                        title="Atur siapa saja peserta yang tergabung di batch ini"
                                                    >
                                                        <UserPlus size={13} />
                                                        Atur Peserta
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => openEditBatch(b)}
                                                        className="monev-btn monev-btn-secondary !h-8 text-xs font-bold"
                                                        title="Ubah informasi batch"
                                                    >
                                                        <Edit3 size={13} />
                                                        Edit
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleDeleteBatch(b)}
                                                        className="monev-btn !h-8 text-xs font-bold text-red-600 hover:bg-red-50 border border-transparent"
                                                        title="Hapus batch"
                                                    >
                                                        <Trash2 size={13} />
                                                        Hapus
                                                    </button>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </section>

                        {/* Bagian Distribusi Mentor & Peserta Bimbingan */}
                        <section className="detail-card mt-8 overflow-hidden p-6 sm:p-8">
                            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                <div className="flex items-center gap-4">
                                    <span className="icon-tile blue">
                                        <UserCog />
                                    </span>
                                    <div>
                                        <h2 className="text-xl font-bold text-[#061737]">
                                            Distribusi Mentor & Peserta
                                        </h2>
                                        <p className="text-sm text-[#61718d]">
                                            Kelola dan pantau peserta magang yang dibimbing oleh setiap mentor.
                                        </p>
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setData('role', 'mentor');
                                        setShowForm(true);
                                        window.scrollTo({ top: 380, behavior: 'smooth' });
                                    }}
                                    className="monev-btn monev-btn-primary shrink-0 text-xs"
                                >
                                    <Plus size={16} />
                                    Tambah Mentor
                                </button>
                            </div>

                            {mentorsList.length === 0 ? (
                                <div className="mt-5 rounded-2xl border border-dashed border-[#c5d4e8] p-6 text-center text-sm text-[#61718d]">
                                    Belum ada akun mentor. Buat akun mentor terlebih dahulu melalui tombol Tambah Akun.
                                </div>
                            ) : (
                                <div className="mt-6 grid gap-4">
                                    {mentorsList.map((m) => (
                                        <div
                                            key={m.id}
                                            className="flex flex-col justify-between gap-4 rounded-2xl border border-[#d5e1ef] bg-[#f8fbff] p-5 sm:flex-row sm:items-center"
                                        >
                                            <div className="flex items-start gap-3.5">
                                                {m.avatar_url ? (
                                                    <img
                                                        src={m.avatar_url}
                                                        alt={m.name}
                                                        className="h-11 w-11 rounded-full object-cover ring-2 ring-[#075cdb]/20"
                                                    />
                                                ) : (
                                                    <span className="grid h-11 w-11 place-items-center rounded-full bg-[#edf4ff] text-xs font-extrabold text-[#075cdb]">
                                                        {m.name.trim().split(/\s+/).filter(Boolean).map((p) => p[0]).slice(0, 2).join('').toUpperCase()}
                                                    </span>
                                                )}
                                                <div>
                                                    <div className="flex flex-wrap items-center gap-2">
                                                        <b className="font-bold text-[#061737]">{m.name}</b>
                                                        <span className="inline-flex items-center rounded-full bg-[#edf4ff] px-2.5 py-0.5 text-xs font-bold text-[#075cdb]">
                                                            {m.participants_count} Peserta Dibimbing
                                                        </span>
                                                    </div>
                                                    <p className="text-xs text-[#687b95]">{m.email}</p>

                                                    <div className="mt-2.5 flex flex-wrap gap-1.5">
                                                        {m.participants.length === 0 ? (
                                                            <span className="text-xs italic text-[#8c9cae]">
                                                                Belum ada peserta yang ditugaskan
                                                            </span>
                                                        ) : (
                                                            m.participants.map((p) => (
                                                                <span
                                                                    key={p.id}
                                                                    className="inline-flex items-center gap-1 rounded-lg border border-[#cde0f8] bg-white px-2.5 py-1 text-xs font-semibold text-[#0f4ca5]"
                                                                >
                                                                    <UserRound size={12} />
                                                                    {p.name}
                                                                </span>
                                                            ))
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            <button
                                                type="button"
                                                onClick={() => openAssignModal(m)}
                                                className="monev-btn monev-btn-secondary shrink-0 text-xs font-bold"
                                            >
                                                <UserPlus size={15} />
                                                Atur Peserta Binaan
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </section>

                        {/* Bagian Manajemen Pengguna */}
                        <section className="detail-card mt-8 overflow-hidden p-6 sm:p-8">
                            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                <div className="flex items-center gap-4">
                                    <span className="icon-tile blue">
                                        <Users />
                                    </span>
                                    <div>
                                        <h2 className="text-xl font-bold text-[#061737]">
                                            Manajemen Pengguna
                                        </h2>
                                        <p className="text-sm text-[#61718d]">
                                            Kelola akun pengguna, role, dan hak akses sistem.
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setShowForm(!showForm)}
                                    className="monev-btn monev-btn-primary shrink-0"
                                >
                                    {showForm ? <X size={18} /> : <Plus size={18} />}
                                    {showForm ? 'Tutup Formulir' : 'Tambah Akun Baru'}
                                </button>
                            </div>

                            {/* Formulir Tambah Akun */}
                            {showForm && (
                                <form
                                    onSubmit={submit}
                                    className="mt-6 rounded-2xl border border-[#d5e1ef] bg-[#f8fbff] p-6 shadow-xs"
                                >
                                    <h3 className="mb-4 text-lg font-bold text-[#061737]">
                                        Formulir Pembuatan Akun Baru
                                    </h3>
                                    <div className="grid gap-4 md:grid-cols-2">
                                        <div>
                                            <label className="monev-label">Nama Lengkap</label>
                                            <input
                                                className="monev-input"
                                                value={data.name}
                                                onChange={(e) => setData('name', e.target.value)}
                                                placeholder="Nama Pengguna"
                                                required
                                            />
                                            {errors.name && (
                                                <small className="mt-1 block text-sm font-semibold text-red-600">
                                                    {errors.name}
                                                </small>
                                            )}
                                        </div>

                                        <div>
                                            <label className="monev-label">Alamat Email</label>
                                            <input
                                                type="email"
                                                className="monev-input"
                                                value={data.email}
                                                onChange={(e) => setData('email', e.target.value)}
                                                placeholder="email@monev.test"
                                                required
                                            />
                                            {errors.email && (
                                                <small className="mt-1 block text-sm font-semibold text-red-600">
                                                    {errors.email}
                                                </small>
                                            )}
                                        </div>

                                        <div>
                                            <label className="monev-label">Kata Sandi</label>
                                            <input
                                                type="password"
                                                className="monev-input"
                                                value={data.password}
                                                onChange={(e) => setData('password', e.target.value)}
                                                placeholder="Minimal 8 karakter"
                                                required
                                            />
                                            {errors.password && (
                                                <small className="mt-1 block text-sm font-semibold text-red-600">
                                                    {errors.password}
                                                </small>
                                            )}
                                        </div>

                                        <div>
                                            <label className="monev-label">Role Akses</label>
                                            <MonevSelect
                                                value={data.role}
                                                onChangeValue={(val) => handleRoleChange(val)}
                                                options={Object.entries(roleLabels).map(([val, lbl]) => ({
                                                    value: val,
                                                    label: lbl,
                                                }))}
                                                placeholder="Pilih Role Akses..."
                                            />
                                        </div>

                                        {/* Jika role Mentor: Pilih Peserta yang Ditangani */}
                                        {data.role === 'mentor' && (
                                            <div className="md:col-span-2 rounded-2xl border border-[#d5e1ef] bg-white p-4 shadow-xs">
                                                <div className="mb-2 flex items-center justify-between">
                                                    <label className="monev-label !mb-0 font-bold text-[#061737]">
                                                        Pilih Peserta Bimbingan yang Ditangani (Opsional)
                                                    </label>
                                                    <span className="text-xs font-bold text-[#075cdb]">
                                                        {data.participant_ids.length} dipilih
                                                    </span>
                                                </div>
                                                <p className="mb-3 text-xs text-[#61718d]">
                                                    Centang peserta magang yang akan dibimbing oleh mentor baru ini.
                                                </p>

                                                {participantsList.length === 0 ? (
                                                    <p className="py-2 text-xs italic text-[#8898aa]">
                                                        Belum ada data peserta yang terdaftar di sistem.
                                                    </p>
                                                ) : (
                                                    <div className="max-h-44 space-y-2 overflow-y-auto pr-1">
                                                        {participantsList.map((p) => {
                                                            const isChecked = data.participant_ids.includes(p.id);
                                                            return (
                                                                <label
                                                                    key={p.id}
                                                                    className={`flex items-center justify-between rounded-xl border p-2.5 text-xs transition cursor-pointer ${
                                                                        isChecked
                                                                            ? 'border-[#075cdb] bg-[#edf4ff]'
                                                                            : 'border-[#e2ebf6] hover:bg-[#f8fbff]'
                                                                    }`}
                                                                >
                                                                    <div className="flex items-center gap-2.5">
                                                                        <input
                                                                            type="checkbox"
                                                                            checked={isChecked}
                                                                            onChange={(e) => {
                                                                                if (e.target.checked) {
                                                                                    setData('participant_ids', [
                                                                                        ...data.participant_ids,
                                                                                        p.id,
                                                                                    ]);
                                                                                } else {
                                                                                    setData(
                                                                                        'participant_ids',
                                                                                        data.participant_ids.filter(
                                                                                            (id) => id !== p.id
                                                                                        )
                                                                                    );
                                                                                }
                                                                            }}
                                                                            className="h-4 w-4 rounded border-[#c5d4e8] text-[#075cdb] focus:ring-[#075cdb]"
                                                                        />
                                                                        <div>
                                                                            <strong className="block font-bold text-[#061737]">
                                                                                {p.name}
                                                                            </strong>
                                                                            <span className="text-[#687b95]">
                                                                                {p.email}
                                                                            </span>
                                                                        </div>
                                                                    </div>
                                                                    {p.mentor_name && (
                                                                        <span className="rounded-md bg-[#fff7ed] px-2 py-0.5 text-[11px] font-semibold text-[#c2410c]">
                                                                            Mentor saat ini: {p.mentor_name}
                                                                        </span>
                                                                    )}
                                                                </label>
                                                            );
                                                        })}
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        {/* Jika role Peserta: Pilih Mentor Pembimbing & Batch Magang */}
                                        {data.role === 'peserta' && (
                                            <>
                                                <div className="md:col-span-2">
                                                    <label className="monev-label">
                                                        Pilih Batch / Angkatan Magang (Opsional)
                                                    </label>
                                                    <MonevSelect
                                                        value={data.batch_id || ''}
                                                        onChangeValue={(val) => setData('batch_id', val || '')}
                                                        options={[
                                                            { value: '', label: '-- Belum Ditugaskan ke Batch --' },
                                                            ...batches.map((b) => ({
                                                                value: b.id,
                                                                label: `${b.name} ${b.is_active ? '(Batch Aktif)' : ''}`,
                                                            })),
                                                        ]}
                                                        placeholder="Pilih atau cari batch..."
                                                        isClearable
                                                    />
                                                    {errors.batch_id && (
                                                        <small className="mt-1 block text-sm font-semibold text-red-600">
                                                            {errors.batch_id}
                                                        </small>
                                                    )}
                                                </div>

                                                <div className="md:col-span-2">
                                                    <label className="monev-label">
                                                        Pilih Mentor Pembimbing (Opsional)
                                                    </label>
                                                    <MonevSelect
                                                        value={data.mentor_id || ''}
                                                        onChangeValue={(val) => setData('mentor_id', val || '')}
                                                        options={[
                                                            { value: '', label: '-- Belum Ditugaskan Mentor --' },
                                                            ...mentorsList.map((m) => ({
                                                                value: m.id,
                                                                label: `${m.name} (${m.participants_count} peserta dibimbing)`,
                                                            })),
                                                        ]}
                                                        placeholder="Pilih atau cari mentor..."
                                                        isClearable
                                                    />
                                                    {errors.mentor_id && (
                                                        <small className="mt-1 block text-sm font-semibold text-red-600">
                                                            {errors.mentor_id}
                                                        </small>
                                                    )}
                                                </div>
                                            </>
                                        )}

                                        <div className="md:col-span-2">
                                            <label className="monev-label">Foto Avatar (Opsional)</label>
                                            <input
                                                type="file"
                                                accept="image/jpeg,image/png,image/webp"
                                                className="block w-full text-sm font-medium text-[#5f718c]"
                                                onChange={(e) => setData('avatar', e.target.files?.[0] ?? null)}
                                            />
                                            {errors.avatar && (
                                                <small className="mt-1 block text-sm font-semibold text-red-600">
                                                    {errors.avatar}
                                                </small>
                                            )}
                                        </div>
                                    </div>

                                    <div className="mt-5 flex gap-3">
                                        <button
                                            type="submit"
                                            disabled={processing}
                                            className="monev-btn monev-btn-primary"
                                        >
                                            {processing ? 'Menyimpan...' : 'Simpan Akun'}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setShowForm(false)}
                                            className="monev-btn monev-btn-secondary"
                                        >
                                            Batal
                                        </button>
                                    </div>
                                </form>
                            )}

                            {/* Filter & Pencarian Pengguna */}
                            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                <div className="monev-input-wrap flex-1 sm:max-w-md">
                                    <Search className="input-icon" />
                                    <input
                                        type="text"
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        placeholder="Cari berdasarkan nama atau email..."
                                        className="monev-input has-icon !h-12"
                                    />
                                </div>

                                <div className="flex flex-wrap items-center gap-2">
                                    <span className="text-sm font-bold text-[#61718d]">Filter:</span>
                                    <div className="w-40">
                                        <MonevSelect
                                            value={roleFilter}
                                            onChangeValue={(val) => setRoleFilter(val || 'all')}
                                            options={[
                                                { value: 'all', label: 'Semua Role' },
                                                { value: 'admin', label: 'Admin' },
                                                { value: 'mentor', label: 'Mentor' },
                                                { value: 'peserta', label: 'Peserta' },
                                            ]}
                                            size="md"
                                        />
                                    </div>
                                    <div className="w-48">
                                        <MonevSelect
                                            value={batchFilter}
                                            onChangeValue={(val) => setBatchFilter(val || 'all')}
                                            options={[
                                                { value: 'all', label: 'Semua Batch' },
                                                { value: 'none', label: 'Belum Ada Batch' },
                                                ...batches.map((b) => ({
                                                    value: String(b.id),
                                                    label: `${b.name} ${b.is_active ? '★' : ''}`,
                                                })),
                                            ]}
                                            size="md"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Tabel Pengguna */}
                            <div className="mt-5 overflow-x-auto rounded-2xl border border-[#e2ebf6]">
                                <table className="w-full text-left">
                                    <thead className="bg-[#f7faff] text-sm font-bold text-[#566883]">
                                        <tr>
                                            <th className="p-4">Pengguna</th>
                                            <th className="p-4">Role Akses</th>
                                            <th className="p-4">Mentor / Bimbingan</th>
                                            <th className="p-4">Batch Magang</th>
                                            <th className="p-4">Tanggal Dibuat</th>
                                            <th className="p-4 text-right">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-[#e8f0fa] text-sm">
                                        {filteredUsers.map((u) => (
                                            <tr key={u.id} className="transition hover:bg-[#fafcff]">
                                                <td className="p-4">
                                                    <div className="flex items-center gap-3">
                                                        {u.avatar_url ? (
                                                            <img
                                                                src={u.avatar_url}
                                                                alt=""
                                                                className="h-10 w-10 rounded-full object-cover ring-2 ring-[#edf4ff]"
                                                            />
                                                        ) : (
                                                            <span className="grid h-10 w-10 place-items-center rounded-full bg-[#edf4ff] text-xs font-extrabold text-[#075cdb]">
                                                                {u.name.trim().split(/\s+/).filter(Boolean).map((p) => p[0]).slice(0, 2).join('').toUpperCase()}
                                                            </span>
                                                        )}
                                                        <div>
                                                            <b className="block font-bold text-[#061737]">
                                                                {u.name}
                                                            </b>
                                                            <small className="text-[#687b95]">{u.email}</small>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="p-4">
                                                    <div className="w-32">
                                                        <MonevSelect
                                                            value={u.role ?? ''}
                                                            onChangeValue={(newRole) => {
                                                                if (newRole && newRole !== u.role) {
                                                                    updateRole(u, newRole);
                                                                }
                                                            }}
                                                            options={Object.entries(roleLabels).map(([val, lbl]) => ({
                                                                value: val,
                                                                label: lbl,
                                                            }))}
                                                            size="sm"
                                                        />
                                                    </div>
                                                </td>
                                                <td className="p-4">
                                                    {u.role === 'peserta' && (
                                                        <div className="min-w-[180px] max-w-[220px]">
                                                            <MonevSelect
                                                                value={u.mentor_id || ''}
                                                                onChangeValue={(mentorId) =>
                                                                    updateParticipantMentor(
                                                                        u.id,
                                                                        u.name,
                                                                        u.email,
                                                                        mentorId
                                                                    )
                                                                }
                                                                options={[
                                                                    { value: '', label: 'Belum ada mentor' },
                                                                    ...mentorsList.map((m) => ({
                                                                        value: m.id,
                                                                        label: m.name,
                                                                    })),
                                                                ]}
                                                                placeholder="Pilih mentor..."
                                                                size="sm"
                                                            />
                                                        </div>
                                                    )}
                                                    {u.role === 'mentor' && (
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                const mentorObj =
                                                                    mentorsList.find((m) => m.id === u.id) || {
                                                                        id: u.id,
                                                                        name: u.name,
                                                                        participant_ids: (u.participants || []).map(
                                                                            (p) => p.id
                                                                        ),
                                                                    };
                                                                openAssignModal(mentorObj);
                                                            }}
                                                            className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl border border-[#cde0f8] bg-[#f0f6ff] px-2.5 py-1 text-xs font-bold text-[#075cdb] transition hover:bg-[#e2efff]"
                                                            title="Klik untuk atur peserta binaan"
                                                        >
                                                            <UserCog size={14} />
                                                            <span>{u.participants_count || 0} Peserta</span>
                                                        </button>
                                                    )}
                                                    {u.role === 'admin' && (
                                                        <span className="text-xs text-[#8c9cae]">-</span>
                                                    )}
                                                </td>
                                                <td className="p-4">
                                                    {u.role === 'peserta' ? (
                                                        <div className="min-w-[170px] max-w-[210px]">
                                                            <MonevSelect
                                                                value={u.batch_id || ''}
                                                                onChangeValue={(batchId) =>
                                                                    updateParticipantBatch(
                                                                        u.id,
                                                                        u.name,
                                                                        u.email,
                                                                        batchId
                                                                    )
                                                                }
                                                                options={[
                                                                    { value: '', label: 'Belum ada batch' },
                                                                    ...batches.map((b) => ({
                                                                        value: b.id,
                                                                        label: `${b.name} ${b.is_active ? '★' : ''}`,
                                                                    })),
                                                                ]}
                                                                placeholder="Pilih batch..."
                                                                size="sm"
                                                            />
                                                        </div>
                                                    ) : (
                                                        <span className="text-xs text-[#8c9cae]">-</span>
                                                    )}
                                                </td>
                                                <td className="p-4 font-medium text-[#647590]">
                                                    {u.created_at}
                                                </td>
                                                <td className="p-4 text-right">
                                                    <button
                                                        onClick={() => remove(u)}
                                                        className="inline-flex items-center gap-1 rounded-xl px-2.5 py-1 text-xs font-bold text-red-600 transition hover:bg-red-50"
                                                    >
                                                        <Trash2 size={15} /> Hapus
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </section>

                        {/* Modal Kelola Peserta Bimbingan Mentor */}
                        {activeMentor && (
                            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4 sm:p-6 backdrop-blur-xs">
                                <div className="w-full max-w-lg max-h-[calc(100dvh-2rem)] sm:max-h-[calc(100dvh-4rem)] flex flex-col rounded-3xl border border-[#d5e1ef] bg-white shadow-2xl overflow-hidden animate-in fade-in duration-150">
                                    {/* Modal Header - Fixed */}
                                    <div className="shrink-0 flex items-center justify-between border-b border-[#e9f0fa] p-5 sm:p-6 bg-white">
                                        <div>
                                            <h3 className="text-lg font-bold text-[#061737]">
                                                Kelola Peserta Bimbingan
                                            </h3>
                                            <p className="text-xs text-[#61718d]">
                                                Mentor:{' '}
                                                <strong className="text-[#075cdb]">{activeMentor.name}</strong>
                                            </p>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => setActiveMentor(null)}
                                            className="grid h-8 w-8 place-items-center rounded-full text-[#61718d] hover:bg-[#f1f5f9] cursor-pointer"
                                        >
                                            <X size={18} />
                                        </button>
                                    </div>

                                    {/* Modal Body */}
                                    <div className="flex-1 min-h-0 flex flex-col overflow-hidden p-5 sm:p-6">
                                        <div className="shrink-0 mb-3 flex items-center justify-between">
                                            <p className="text-xs text-[#61718d]">
                                                Centang peserta magang yang dibimbing:
                                            </p>
                                            <span className="text-xs font-bold text-[#075cdb] bg-[#edf4ff] px-2.5 py-0.5 rounded-full">
                                                {selectedParticipantIds.length} dipilih
                                            </span>
                                        </div>

                                        {participantsList.length === 0 ? (
                                            <p className="py-6 text-center text-sm italic text-[#8c9cae]">
                                                Belum ada peserta magang yang terdaftar di sistem.
                                            </p>
                                        ) : (
                                            <div className="flex-1 min-h-0 space-y-2 overflow-y-auto monev-scrollbar pr-1">
                                                {participantsList.map((p) => {
                                                    const isChecked = selectedParticipantIds.includes(p.id);
                                                    const isAssignedToOther =
                                                        p.mentor_id && p.mentor_id !== activeMentor.id;

                                                    return (
                                                        <label
                                                            key={p.id}
                                                            className={`flex items-center justify-between rounded-xl border p-3 text-xs transition cursor-pointer ${
                                                                isChecked
                                                                    ? 'border-[#075cdb] bg-[#edf4ff]'
                                                                    : 'border-[#e2ebf6] hover:bg-[#f8fbff]'
                                                            }`}
                                                        >
                                                            <div className="flex items-center gap-2.5">
                                                                <input
                                                                    type="checkbox"
                                                                    checked={isChecked}
                                                                    onChange={(e) => {
                                                                        if (e.target.checked) {
                                                                            setSelectedParticipantIds((prev) => [
                                                                                ...prev,
                                                                                p.id,
                                                                            ]);
                                                                        } else {
                                                                            setSelectedParticipantIds((prev) =>
                                                                                prev.filter((id) => id !== p.id)
                                                                            );
                                                                        }
                                                                    }}
                                                                    className="h-4 w-4 rounded border-[#c5d4e8] text-[#075cdb] focus:ring-[#075cdb]"
                                                                />
                                                                <div>
                                                                    <b className="block font-bold text-[#061737]">
                                                                        {p.name}
                                                                    </b>
                                                                    <span className="text-[#687b95]">{p.email}</span>
                                                                </div>
                                                            </div>
                                                            {isAssignedToOther && (
                                                                <span className="rounded-md bg-[#fff7ed] px-2 py-0.5 text-[11px] font-semibold text-[#c2410c]">
                                                                    Mentor: {p.mentor_name}
                                                                </span>
                                                            )}
                                                        </label>
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </div>

                                    {/* Modal Footer - Fixed */}
                                    <div className="shrink-0 flex justify-end gap-3 border-t border-[#e9f0fa] p-4 sm:px-6 bg-[#fafcff]">
                                        <button
                                            type="button"
                                            onClick={() => setActiveMentor(null)}
                                            className="monev-btn monev-btn-secondary text-xs"
                                        >
                                            Batal
                                        </button>
                                        <button
                                            type="button"
                                            disabled={isAssigning}
                                            onClick={saveAssignments}
                                            className="monev-btn monev-btn-primary text-xs"
                                        >
                                            {isAssigning ? 'Menyimpan...' : 'Simpan Pembagian Peserta'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Bagian Aktivitas Terbaru */}
                        <section className="detail-card mt-8 p-6 sm:p-8">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <span className="icon-tile blue">
                                        <Activity />
                                    </span>
                                    <div>
                                        <h2 className="text-xl font-bold text-[#061737]">
                                            Aktivitas Sistem Terbaru
                                        </h2>
                                        <p className="text-sm text-[#61718d]">
                                            Catatan audit trail log aktivitas pengguna.
                                        </p>
                                    </div>
                                </div>
                                <Link
                                    href={route('admin.activity-logs.index')}
                                    className="text-sm font-extrabold text-[#075cdb] hover:underline"
                                >
                                    Lihat Semua &rarr;
                                </Link>
                            </div>

                            <div className="mt-6 divide-y divide-[#e9f0fa]">
                                {activities.map((item) => (
                                    <div
                                        key={item.id}
                                        className="flex items-start justify-between gap-4 py-3.5 first:pt-0 last:pb-0"
                                    >
                                        <div>
                                            <b className="block text-sm font-bold text-[#071a3c]">
                                                {item.causer}
                                            </b>
                                            <span className="text-sm text-[#5f718d]">
                                                {item.description}
                                            </span>
                                        </div>
                                        <time className="shrink-0 text-xs font-bold text-[#8697ae]">
                                            {item.created_at}
                                        </time>
                                    </div>
                                ))}
                            </div>
                        </section>

                        <div className="mt-8 flex justify-center">
                            <button
                                type="button"
                                className="logout-button !mt-0"
                                onClick={() => router.post(route('logout'))}
                            >
                                <LogOut /> Keluar dari akun
                            </button>
                        </div>

                        <div className="footer-spacer" />
                        <ServerTime />

                        {/* Modals */}
                        <NotificationModal
                            isOpen={showNotifications}
                            onClose={() => setShowNotifications(false)}
                            onOpenAnnouncement={(id) => {
                                setHighlightAnnouncementId(id);
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

                        {/* Modal Tambah / Edit Batch */}
                        <BatchModal
                            isOpen={showBatchModal}
                            onClose={() => {
                                setShowBatchModal(false);
                                setEditingBatch(null);
                            }}
                            batch={editingBatch}
                        />

                        {/* Modal Penugasan Peserta ke Batch */}
                        <BatchAssignModal
                            isOpen={Boolean(assigningBatch)}
                            onClose={() => setAssigningBatch(null)}
                            batch={assigningBatch}
                            participants={participantsList}
                        />

                        {/* Navigasi Admin di Bawah */}
                        <nav className="bottom-nav" aria-label="Navigasi Admin">
                            <button
                                className="active"
                                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                            >
                                <span className="nav-icon">
                                    <Users size={25} strokeWidth={2.3} />
                                </span>
                                <span>Manajemen</span>
                            </button>
                            <button onClick={() => router.visit(route('admin.activity-logs.index'))}>
                                <span className="nav-icon">
                                    <Activity size={25} strokeWidth={2.3} />
                                </span>
                                <span>Audit Trail</span>
                            </button>
                            <button onClick={() => router.visit(route('profile.edit'))}>
                                <span className="nav-icon">
                                    <UserRound size={25} strokeWidth={2.3} />
                                </span>
                                <span>Profil</span>
                            </button>
                            <button
                                onClick={() => router.post(route('logout'))}
                                className="text-[#d02a2a] hover:text-[#b01e1e]"
                            >
                                <span className="nav-icon">
                                    <LogOut size={25} strokeWidth={2.3} />
                                </span>
                                <span>Keluar</span>
                            </button>
                        </nav>
                    </main>
                </div>
            </div>
        </>
    );
}
