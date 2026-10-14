import React, { useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import MonevSelect from '@/Components/MonevSelect';
import { Calendar, Layers, X, Sparkles, Check } from 'lucide-react';

export default function BatchModal({ isOpen, onClose, batch = null }) {
    const isEdit = Boolean(batch?.id);

    const { data, setData, post, patch, processing, errors, reset, clearErrors } = useForm({
        name: '',
        description: '',
        start_date: '',
        end_date: '',
        status: 'active',
        is_active: false,
    });

    useEffect(() => {
        if (isOpen) {
            clearErrors();
            if (batch) {
                setData({
                    name: batch.name || '',
                    description: batch.description || '',
                    start_date: batch.start_date || '',
                    end_date: batch.end_date || '',
                    status: batch.status || 'active',
                    is_active: Boolean(batch.is_active),
                });
            } else {
                setData({
                    name: '',
                    description: '',
                    start_date: '',
                    end_date: '',
                    status: 'active',
                    is_active: false,
                });
            }
        }
    }, [isOpen, batch]);

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isEdit) {
            patch(route('admin.batches.update', batch.id), {
                preserveScroll: true,
                onSuccess: () => {
                    reset();
                    onClose();
                },
            });
        } else {
            post(route('admin.batches.store'), {
                preserveScroll: true,
                onSuccess: () => {
                    reset();
                    onClose();
                },
            });
        }
    };

    const statusOptions = [
        { value: 'active', label: 'Aktif / Berjalan' },
        { value: 'upcoming', label: 'Akan Datang' },
        { value: 'completed', label: 'Selesai' },
        { value: 'archived', label: 'Diarsipkan' },
    ];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4 sm:p-6 backdrop-blur-xs">
            <div className="w-full max-w-lg max-h-[calc(100dvh-2rem)] sm:max-h-[calc(100dvh-4rem)] flex flex-col rounded-3xl border border-[#d5e1ef] bg-white shadow-2xl overflow-hidden animate-in fade-in duration-150">
                {/* Header Modal - Sticky Top */}
                <div className="flex items-center justify-between border-b border-[#e9f0fa] p-5 sm:p-6 shrink-0 bg-white">
                    <div className="flex items-center gap-3">
                        <span className="icon-tile blue">
                            <Layers size={20} />
                        </span>
                        <div>
                            <h3 className="text-lg font-bold text-[#061737]">
                                {isEdit ? 'Perbarui Data Batch' : 'Tambah Batch Baru'}
                            </h3>
                            <p className="text-xs text-[#61718d]">
                                Atur informasi angkatan magang & periode pelaksanaan
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

                {/* Form Container - Scrollable Body (Single Scrollbar) */}
                <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden min-h-0">
                    <div className="overflow-y-auto monev-scrollbar flex-1 min-h-0 p-5 sm:p-6 space-y-4">
                        <div>
                            <label className="monev-label">Nama Batch / Angkatan</label>
                            <input
                                type="text"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                placeholder="Contoh: Batch 1 - Tahun 2026"
                                className="monev-input"
                                required
                            />
                            {errors.name && (
                                <small className="mt-1 block text-xs font-semibold text-red-600">
                                    {errors.name}
                                </small>
                            )}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                                <label className="monev-label">Tanggal Mulai</label>
                                <input
                                    type="date"
                                    value={data.start_date}
                                    onChange={(e) => setData('start_date', e.target.value)}
                                    className="monev-input"
                                    required
                                />
                                {errors.start_date && (
                                    <small className="mt-1 block text-xs font-semibold text-red-600">
                                        {errors.start_date}
                                    </small>
                                )}
                            </div>
                            <div>
                                <label className="monev-label">Tanggal Selesai</label>
                                <input
                                    type="date"
                                    value={data.end_date}
                                    onChange={(e) => setData('end_date', e.target.value)}
                                    className="monev-input"
                                    required
                                />
                                {errors.end_date && (
                                    <small className="mt-1 block text-xs font-semibold text-red-600">
                                        {errors.end_date}
                                    </small>
                                )}
                            </div>
                        </div>

                        <div>
                            <label className="monev-label">Status Angkatan</label>
                            <MonevSelect
                                value={data.status}
                                onChangeValue={(val) => setData('status', val || 'active')}
                                options={statusOptions}
                                placeholder="Pilih status..."
                            />
                            {errors.status && (
                                <small className="mt-1 block text-xs font-semibold text-red-600">
                                    {errors.status}
                                </small>
                            )}
                        </div>

                        <div>
                            <label className="monev-label">Deskripsi / Catatan (Opsional)</label>
                            <textarea
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                                placeholder="Tuliskan keterangan mengenai program atau batch ini..."
                                rows={3}
                                className="monev-textarea"
                            />
                            {errors.description && (
                                <small className="mt-1 block text-xs font-semibold text-red-600">
                                    {errors.description}
                                </small>
                            )}
                        </div>

                        <div className="rounded-2xl border border-[#d8e6f8] bg-[#f5f9ff] p-4">
                            <label className="flex items-start gap-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={data.is_active}
                                    onChange={(e) => setData('is_active', e.target.checked)}
                                    className="mt-0.5 h-4 w-4 rounded border-[#c5d4e8] text-[#075cdb] focus:ring-[#075cdb]"
                                />
                                <div>
                                    <b className="text-xs font-bold text-[#061737] flex items-center gap-1.5">
                                        <Sparkles size={14} className="text-[#075cdb]" />
                                        Tandai Sebagai Batch Aktif Utama
                                    </b>
                                    <p className="text-[11px] text-[#61718d] mt-0.5">
                                        Batch aktif akan dijadikan default pilihan monitoring dan ditampilkan sebagai angkatan utama saat ini.
                                    </p>
                                </div>
                            </label>
                        </div>
                    </div>

                    {/* Footer Modal - Sticky Bottom */}
                    <div className="shrink-0 flex items-center justify-end gap-3 border-t border-[#e9f0fa] p-4 sm:px-6 bg-[#fafcff]">
                        <button
                            type="button"
                            onClick={onClose}
                            className="monev-btn monev-btn-secondary text-xs"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            disabled={processing}
                            className="monev-btn monev-btn-primary text-xs"
                        >
                            {processing ? 'Menyimpan...' : (isEdit ? 'Simpan Perubahan' : 'Buat Batch Baru')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
