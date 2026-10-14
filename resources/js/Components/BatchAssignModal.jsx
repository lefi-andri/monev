import React, { useState, useEffect, useMemo } from 'react';
import { router } from '@inertiajs/react';
import { Search, UserRound, Users, X, Check, AlertCircle } from 'lucide-react';

export default function BatchAssignModal({ isOpen, onClose, batch, participants = [] }) {
    const [selectedIds, setSelectedIds] = useState([]);
    const [search, setSearch] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (isOpen && batch) {
            setSelectedIds(batch.participant_ids || []);
            setSearch('');
        }
    }, [isOpen, batch]);

    const filteredParticipants = useMemo(() => {
        if (!search) return participants;
        const q = search.toLowerCase();
        return participants.filter(
            (p) =>
                p.name.toLowerCase().includes(q) ||
                p.email.toLowerCase().includes(q) ||
                (p.bidang && p.bidang.toLowerCase().includes(q))
        );
    }, [participants, search]);

    if (!isOpen || !batch) return null;

    const handleToggle = (id) => {
        setSelectedIds((prev) =>
            prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
        );
    };

    const handleSelectAllFiltered = () => {
        const filteredIdSet = new Set(filteredParticipants.map((p) => p.id));
        const allSelected = filteredParticipants.every((p) => selectedIds.includes(p.id));

        if (allSelected) {
            // Uncheck all filtered
            setSelectedIds((prev) => prev.filter((id) => !filteredIdSet.has(id)));
        } else {
            // Check all filtered
            setSelectedIds((prev) => Array.from(new Set([...prev, ...filteredIdSet])));
        }
    };

    const handleSave = () => {
        setIsSaving(true);
        router.post(
            route('admin.batches.assign', batch.id),
            { participant_ids: selectedIds },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setIsSaving(false);
                    onClose();
                },
                onError: () => {
                    setIsSaving(false);
                },
            }
        );
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4 sm:p-6 backdrop-blur-xs">
            <div className="w-full max-w-lg max-h-[calc(100dvh-2rem)] sm:max-h-[calc(100dvh-4rem)] flex flex-col rounded-3xl border border-[#d5e1ef] bg-white shadow-2xl overflow-hidden animate-in fade-in duration-150">
                {/* Header */}
                <div className="shrink-0 flex items-center justify-between border-b border-[#e9f0fa] p-5 sm:p-6 bg-white">
                    <div className="flex items-center gap-3">
                        <span className="icon-tile blue">
                            <Users size={20} />
                        </span>
                        <div>
                            <h3 className="text-lg font-bold text-[#061737]">
                                Atur Peserta Batch
                            </h3>
                            <p className="text-xs text-[#61718d]">
                                Angkatan: <strong className="text-[#075cdb]">{batch.name}</strong>
                            </p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="grid h-8 w-8 place-items-center rounded-full text-[#61718d] hover:bg-[#f1f5f9] cursor-pointer"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Body Content */}
                <div className="flex-1 min-h-0 flex flex-col overflow-hidden p-5 sm:p-6">
                    {/* Search & Bulk Select Toolbar */}
                    <div className="shrink-0 flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between mb-3">
                        <div className="monev-input-wrap flex-1">
                            <Search className="input-icon" size={16} />
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Cari nama, email, atau bidang..."
                                className="monev-input has-icon !h-10 text-xs"
                            />
                        </div>

                        {filteredParticipants.length > 0 && (
                            <button
                                type="button"
                                onClick={handleSelectAllFiltered}
                                className="shrink-0 text-xs font-bold text-[#075cdb] hover:underline cursor-pointer"
                            >
                                {filteredParticipants.every((p) => selectedIds.includes(p.id))
                                    ? 'Batalkan Semua'
                                    : 'Pilih Semua Hasil'}
                            </button>
                        )}
                    </div>

                    <div className="shrink-0 mb-3 flex items-center justify-between text-xs">
                        <span className="text-[#61718d]">Centang peserta untuk angkatan ini:</span>
                        <span className="font-bold text-[#075cdb] bg-[#edf4ff] px-2.5 py-0.5 rounded-full">
                            {selectedIds.length} peserta dipilih
                        </span>
                    </div>

                    {participants.length === 0 ? (
                        <div className="py-8 text-center text-sm italic text-[#8c9cae]">
                            Belum ada akun dengan role peserta magang.
                        </div>
                    ) : filteredParticipants.length === 0 ? (
                        <div className="py-8 text-center text-xs text-[#8c9cae]">
                            Tidak ada peserta yang cocok dengan kata kunci pencarian.
                        </div>
                    ) : (
                        <div className="flex-1 min-h-0 space-y-2 overflow-y-auto monev-scrollbar pr-1">
                            {filteredParticipants.map((p) => {
                                const isChecked = selectedIds.includes(p.id);
                                const currentBatchName = p.batch_name;
                                const isDifferentBatch =
                                    currentBatchName && p.batch_id !== batch.id;

                                return (
                                    <label
                                        key={p.id}
                                        className={`flex items-center justify-between rounded-2xl border p-3 text-xs transition cursor-pointer ${
                                            isChecked
                                                ? 'border-[#075cdb] bg-[#edf4ff]'
                                                : 'border-[#e2ebf6] hover:bg-[#f8fbff]'
                                        }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <input
                                                type="checkbox"
                                                checked={isChecked}
                                                onChange={() => handleToggle(p.id)}
                                                className="h-4 w-4 rounded border-[#c5d4e8] text-[#075cdb] focus:ring-[#075cdb]"
                                            />
                                            {p.avatar_url ? (
                                                <img
                                                    src={p.avatar_url}
                                                    alt=""
                                                    className="h-8 w-8 rounded-full object-cover ring-1 ring-[#cde0f8]"
                                                />
                                            ) : (
                                                <span className="grid h-8 w-8 place-items-center rounded-full bg-[#e2ecf9] text-[11px] font-bold text-[#075cdb]">
                                                    {p.name.trim().split(/\s+/).slice(0, 2).map((x) => x[0]).join('').toUpperCase()}
                                                </span>
                                            )}
                                            <div>
                                                <b className="block font-bold text-[#061737]">
                                                    {p.name}
                                                </b>
                                                <div className="flex items-center gap-1.5 text-[11px] text-[#687b95]">
                                                    <span>{p.email}</span>
                                                    <span>&bull;</span>
                                                    <span className="text-[#075cdb] font-medium">{p.bidang || 'UI/UX Designer'}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="text-right">
                                            {isDifferentBatch && (
                                                <span className="inline-block rounded-md bg-[#fff7ed] px-2 py-0.5 text-[10px] font-semibold text-[#c2410c]">
                                                    Saat ini: {currentBatchName}
                                                </span>
                                            )}
                                            {p.mentor_name && (
                                                <div className="text-[10px] text-[#8c9cae]">
                                                    Mentor: {p.mentor_name}
                                                </div>
                                            )}
                                        </div>
                                    </label>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Footer - Sticky Bottom */}
                <div className="shrink-0 flex justify-end gap-3 border-t border-[#e9f0fa] p-4 sm:px-6 bg-[#fafcff]">
                    <button
                        type="button"
                        onClick={onClose}
                        className="monev-btn monev-btn-secondary text-xs"
                    >
                        Batal
                    </button>
                    <button
                        type="button"
                        disabled={isSaving}
                        onClick={handleSave}
                        className="monev-btn monev-btn-primary text-xs"
                    >
                        {isSaving ? 'Menyimpan...' : 'Simpan Pembagian Peserta'}
                    </button>
                </div>
            </div>
        </div>
    );

}
