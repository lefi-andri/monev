import MonevSelect from '@/Components/MonevSelect';
import { router, useForm, usePage } from '@inertiajs/react';
import {
    Bookmark, Calendar, Check, Megaphone, Pin, Plus,
    Search, Trash2, UserRound, X,
} from 'lucide-react';
import { useMemo, useState } from 'react';

const badgeColors = {
    Penting: 'bg-[#fff1f2] text-[#e11d48] border-[#fecdd3]',
    Jadwal: 'bg-[#faf5ff] text-[#7e22ce] border-[#e9d5ff]',
    Evaluasi: 'bg-[#ecfdf5] text-[#059669] border-[#a7f3d0]',
    Info: 'bg-[#edf4ff] text-[#075cdb] border-[#cde0f8]',
};

const targetLabels = {
    all: 'Semua (Mentor & Peserta)',
    mentor: 'Khusus Mentor',
    peserta: 'Khusus Peserta',
};

export default function AnnouncementModal({
    isOpen,
    onClose,
    announcements = [],
    canCreate = false,
    highlightId = null,
}) {
    if (!isOpen) return null;

    const authUser = usePage().props.auth.user;
    const isMentor = authUser.role === 'mentor';
    const isAdmin = authUser.role === 'admin';

    const [showForm, setShowForm] = useState(false);
    const [search, setSearch] = useState('');

    const { data, setData, post, processing, errors, reset } = useForm({
        title: '',
        content: '',
        target_role: isMentor ? 'peserta' : 'all',
        badge: 'Info',
        is_pinned: false,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('announcements.store'), {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                setShowForm(false);
            },
        });
    };

    const remove = (id, title) => {
        if (window.confirm(`Hapus pengumuman "${title}"?`)) {
            router.delete(route('announcements.destroy', id), {
                preserveScroll: true,
            });
        }
    };

    const filtered = useMemo(() => {
        return announcements.filter((a) => {
            const matches =
                a.title.toLowerCase().includes(search.toLowerCase()) ||
                a.content.toLowerCase().includes(search.toLowerCase()) ||
                a.author_name.toLowerCase().includes(search.toLowerCase());
            return matches;
        });
    }, [announcements, search]);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4 sm:p-6 backdrop-blur-xs animate-in fade-in duration-150">
            <div className="w-full max-w-2xl max-h-[calc(100dvh-2rem)] sm:max-h-[calc(100dvh-4rem)] overflow-hidden rounded-3xl border border-[#d5e1ef] bg-white shadow-2xl flex flex-col">
                {/* Header - Fixed Top */}
                <div className="flex items-center justify-between border-b border-[#e9f0fa] px-6 py-5 shrink-0 bg-white">
                    <div className="flex items-center gap-3">
                        <span className="grid h-11 w-11 place-items-center rounded-2xl bg-[#edf4ff] text-[#075cdb]">
                            <Megaphone size={22} />
                        </span>
                        <div>
                            <div className="flex items-center gap-2">
                                <h3 className="text-xl font-bold text-[#061737]">
                                    {showForm ? 'Buat Pengumuman Baru' : 'Papan Pengumuman'}
                                </h3>
                                {!showForm && (
                                    <span className="rounded-full bg-[#edf4ff] px-2.5 py-0.5 text-xs font-bold text-[#075cdb]">
                                        {announcements.length}
                                    </span>
                                )}
                            </div>
                            <p className="text-xs text-[#61718d]">
                                {showForm
                                    ? 'Isi formulir untuk mempublikasikan pengumuman baru'
                                    : 'Informasi dan instruksi resmi untuk magang.'}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        {canCreate && (
                            <button
                                type="button"
                                onClick={() => setShowForm(!showForm)}
                                className="monev-btn monev-btn-primary !h-10 !px-3 text-xs"
                            >
                                {showForm ? <X size={16} /> : <Plus size={16} />}
                                <span>{showForm ? 'Lihat Daftar' : 'Buat Pengumuman'}</span>
                            </button>
                        )}
                        <button
                            type="button"
                            onClick={onClose}
                            className="grid h-9 w-9 place-items-center rounded-xl text-[#61718d] hover:bg-[#f1f5f9] transition cursor-pointer"
                        >
                            <X size={20} />
                        </button>
                    </div>
                </div>

                {/* Body: Single Scrollable View (Either Form or Cards List) */}
                {showForm ? (
                    /* Single Scrollable Form View */
                    <form
                        onSubmit={submit}
                        className="flex-1 min-h-0 overflow-y-auto monev-scrollbar bg-[#f8fbff] p-5 sm:p-6 space-y-4"
                    >
                        <div className="space-y-3.5">
                            <div>
                                <label className="monev-label">Judul Pengumuman</label>
                                <input
                                    type="text"
                                    className="monev-input"
                                    placeholder="Contoh: Sesi Mentoring Tambahan & Evaluasi Sprint"
                                    value={data.title}
                                    onChange={(e) => setData('title', e.target.value)}
                                    required
                                />
                                {errors.title && (
                                    <small className="mt-1 block text-xs font-semibold text-red-600">
                                        {errors.title}
                                    </small>
                                )}
                            </div>

                            <div className="grid gap-3 sm:grid-cols-2">
                                {isAdmin ? (
                                    <div>
                                        <label className="monev-label">Target Penerima</label>
                                        <MonevSelect
                                            value={data.target_role}
                                            onChangeValue={(val) => setData('target_role', val)}
                                            options={[
                                                { value: 'all', label: 'Semua (Mentor & Peserta)' },
                                                { value: 'mentor', label: 'Khusus Mentor' },
                                                { value: 'peserta', label: 'Khusus Peserta' },
                                            ]}
                                            size="md"
                                        />
                                    </div>
                                ) : (
                                    <div>
                                        <label className="monev-label">Target Penerima</label>
                                        <div className="flex h-11 items-center rounded-2xl border border-[#c5d4e8] bg-[#f1f5f9] px-4 text-xs font-bold text-[#334155]">
                                            Peserta Bimbingan Anda
                                        </div>
                                    </div>
                                )}

                                <div>
                                    <label className="monev-label">Kategori / Label</label>
                                    <MonevSelect
                                        value={data.badge}
                                        onChangeValue={(val) => setData('badge', val)}
                                        options={[
                                            { value: 'Info', label: 'Info Umum' },
                                            { value: 'Penting', label: 'Penting & Mendesak' },
                                            { value: 'Jadwal', label: 'Jadwal & Agenda' },
                                            { value: 'Evaluasi', label: 'Evaluasi & Penilaian' },
                                        ]}
                                        size="md"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="monev-label">Isi Pengumuman</label>
                                <textarea
                                    className="w-full rounded-2xl border border-[#c5d4e8] p-3.5 text-sm text-[#071a3c] focus:border-[#075cdb] focus:outline-none focus:ring-2 focus:ring-[#075cdb]/20"
                                    placeholder="Tuliskan isi pengumuman atau instruksi secara jelas..."
                                    rows={4}
                                    value={data.content}
                                    onChange={(e) => setData('content', e.target.value)}
                                    required
                                />
                                {errors.content && (
                                    <small className="mt-1 block text-xs font-semibold text-red-600">
                                        {errors.content}
                                    </small>
                                )}
                            </div>

                            <label className="flex items-center gap-2 text-xs font-bold text-[#061737] cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={data.is_pinned}
                                    onChange={(e) => setData('is_pinned', e.target.checked)}
                                    className="h-4 w-4 rounded border-[#c5d4e8] text-[#075cdb] focus:ring-[#075cdb]"
                                />
                                <span>Sematkan pengumuman ini di bagian atas (Pinned)</span>
                            </label>

                            <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#e9f0fa]">
                                <button
                                    type="button"
                                    onClick={() => setShowForm(false)}
                                    className="monev-btn monev-btn-secondary !h-10 text-xs"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="monev-btn monev-btn-primary !h-10 text-xs"
                                >
                                    {processing ? 'Menyimpan...' : 'Publikasikan Pengumuman'}
                                </button>
                            </div>
                        </div>
                    </form>
                ) : (
                    /* Single Scrollable Announcements List View */
                    <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
                        {/* Search Bar - Fixed */}
                        <div className="p-4 border-b border-[#e9f0fa] shrink-0 bg-[#fafcff]">
                            <div className="monev-input-wrap">
                                <Search className="input-icon" size={17} />
                                <input
                                    type="text"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Cari pengumuman..."
                                    className="monev-input has-icon !h-10 text-xs"
                                />
                            </div>
                        </div>

                        {/* Announcement Cards List - Only Scrollable Area */}
                        <div className="p-4 sm:p-6 overflow-y-auto monev-scrollbar space-y-4 flex-1 min-h-0">
                            {filtered.length === 0 ? (
                                <div className="py-12 text-center">
                                    <span className="mx-auto mb-3 grid h-14 w-14 place-items-center rounded-3xl bg-[#f0f4f9] text-[#8697ae]">
                                        <Megaphone size={26} />
                                    </span>
                                    <p className="text-sm font-bold text-[#061737]">Belum ada pengumuman</p>
                                    <p className="text-xs text-[#8c9cae]">
                                        {search ? 'Tidak ada hasil yang sesuai dengan kata kunci pencarian.' : 'Pengumuman terbaru akan ditampilkan di sini.'}
                                    </p>
                                </div>
                            ) : (
                                filtered.map((item) => {
                            const isHighlighted = highlightId && Number(item.id) === Number(highlightId);
                            const badgeStyle = badgeColors[item.badge] || badgeColors.Info;

                            return (
                                <article
                                    key={item.id}
                                    className={`rounded-2xl border p-5 transition ${
                                        isHighlighted
                                            ? 'border-[#075cdb] bg-[#f8fbff] ring-2 ring-[#075cdb]/20'
                                            : 'border-[#d5e1ef] bg-white hover:border-[#b8cfed]'
                                    }`}
                                >
                                    <header className="flex flex-wrap items-center justify-between gap-2 border-b border-[#f0f4fa] pb-3">
                                        <div className="flex flex-wrap items-center gap-2">
                                            {item.is_pinned && (
                                                <span className="inline-flex items-center gap-1 rounded-lg border border-[#fef08a] bg-[#fefce8] px-2 py-0.5 text-[11px] font-bold text-[#854d0e]">
                                                    <Pin size={11} /> Disematkan
                                                </span>
                                            )}
                                            <span
                                                className={`inline-flex items-center rounded-lg border px-2.5 py-0.5 text-[11px] font-bold ${badgeStyle}`}
                                            >
                                                {item.badge}
                                            </span>
                                            <span className="rounded-lg bg-[#f1f5f9] px-2 py-0.5 text-[11px] font-semibold text-[#64748b]">
                                                {targetLabels[item.target_role] || item.target_role}
                                            </span>
                                        </div>

                                        {(isAdmin || item.can_delete || item.author_id === authUser.id) && (
                                            <button
                                                type="button"
                                                onClick={() => remove(item.id, item.title)}
                                                className="inline-flex cursor-pointer items-center gap-1 text-xs font-bold text-red-600 hover:text-red-700 transition"
                                                title="Hapus pengumuman"
                                            >
                                                <Trash2 size={14} /> Hapus
                                            </button>
                                        )}
                                    </header>

                                    <h4 className="mt-3 text-base font-bold text-[#061737] leading-snug">
                                        {item.title}
                                    </h4>

                                    <p className="mt-2 text-xs text-[#334155] leading-relaxed whitespace-pre-line">
                                        {item.content}
                                    </p>

                                    <footer className="mt-4 flex items-center justify-between gap-3 pt-3 border-t border-[#f8fafc] text-xs text-[#64748b]">
                                        <div className="flex items-center gap-2">
                                            {item.author_avatar ? (
                                                <img
                                                    src={item.author_avatar}
                                                    alt=""
                                                    className="h-6 w-6 rounded-full object-cover ring-1 ring-[#cbd5e1]"
                                                />
                                            ) : (
                                                <span className="grid h-6 w-6 place-items-center rounded-full bg-[#edf4ff] text-[10px] font-extrabold text-[#075cdb]">
                                                    {item.author_name[0]}
                                                </span>
                                            )}
                                            <span className="font-semibold text-[#061737]">
                                                {item.author_name}
                                            </span>
                                            <span className="rounded bg-[#f1f5f9] px-1.5 py-0.5 text-[10px] font-bold text-[#64748b] capitalize">
                                                {item.author_role}
                                            </span>
                                        </div>
                                        <time className="shrink-0 text-[11px] text-[#8c9cae]">
                                            {item.relative_time || item.created_at}
                                        </time>
                                    </footer>
                                </article>
                            );
                        })
                    )}
                </div>
            </div>
        )}

                {/* Footer */}
                <div className="border-t border-[#e9f0fa] bg-[#fafcff] px-6 py-4 flex items-center justify-between shrink-0">
                    <span className="text-xs text-[#61718d]">
                        Total <strong>{filtered.length}</strong> pengumuman aktif
                    </span>
                    <button
                        type="button"
                        onClick={onClose}
                        className="monev-btn monev-btn-secondary !h-9 text-xs"
                    >
                        Tutup
                    </button>
                </div>
            </div>
        </div>
    );
}
