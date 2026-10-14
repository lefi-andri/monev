import InputError from '@/Components/InputError';
import Modal from '@/Components/Modal';
import { useForm } from '@inertiajs/react';
import { AlertTriangle, Lock, UserRoundX } from 'lucide-react';
import { useRef, useState } from 'react';

export default function DeleteUserForm({ className = '' }) {
    const [confirmingUserDeletion, setConfirmingUserDeletion] = useState(false);
    const passwordInput = useRef();

    const {
        data,
        setData,
        delete: destroy,
        processing,
        reset,
        errors,
        clearErrors,
    } = useForm({
        password: '',
    });

    const confirmUserDeletion = () => {
        setConfirmingUserDeletion(true);
    };

    const deleteUser = (e) => {
        e.preventDefault();

        destroy(route('profile.destroy'), {
            preserveScroll: true,
            onSuccess: () => closeModal(),
            onError: () => passwordInput.current?.focus(),
            onFinish: () => reset(),
        });
    };

    const closeModal = () => {
        setConfirmingUserDeletion(false);
        clearErrors();
        reset();
    };

    return (
        <section className={`detail-card termination-card p-7 sm:p-8 ${className}`}>
            <header className="flex items-center gap-4">
                <span className="icon-tile red">
                    <UserRoundX />
                </span>
                <div>
                    <h2 className="text-xl font-bold text-[#ba2920]">Hapus Akun</h2>
                    <p className="mt-0.5 text-sm text-[#61718d]">
                        Setelah akun dihapus, seluruh data profil dan catatan magang akan dihapus permanen.
                    </p>
                </div>
            </header>

            <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm font-medium text-[#7a8a9e]">
                    Pastikan Anda telah mengunduh atau mencadangkan data penting sebelum melanjutkan penghapusan akun.
                </p>
                <button
                    type="button"
                    onClick={confirmUserDeletion}
                    className="monev-btn monev-btn-danger shrink-0"
                >
                    <UserRoundX size={18} />
                    Hapus Akun Ini
                </button>
            </div>

            <Modal show={confirmingUserDeletion} onClose={closeModal}>
                <form onSubmit={deleteUser} className="p-7">
                    <div className="flex items-center gap-3 text-[#ba2920]">
                        <span className="grid h-12 w-12 place-items-center rounded-2xl bg-[#fff0f0]">
                            <AlertTriangle size={24} />
                        </span>
                        <div>
                            <h2 className="text-lg font-bold text-[#061737]">
                                Konfirmasi Penghapusan Akun
                            </h2>
                            <p className="text-xs font-semibold text-[#8b99ae]">
                                Tindakan ini tidak dapat dibatalkan
                            </p>
                        </div>
                    </div>

                    <p className="mt-4 text-sm text-[#5f718c]">
                        Apakah Anda yakin ingin menghapus akun ini secara permanen? Silakan masukkan kata sandi akun Anda untuk mengonfirmasi.
                    </p>

                    <div className="mt-5">
                        <label htmlFor="confirm-delete-password" className="monev-label">
                            Kata Sandi Anda
                        </label>
                        <div className="monev-input-wrap">
                            <Lock className="input-icon" />
                            <input
                                id="confirm-delete-password"
                                type="password"
                                name="password"
                                ref={passwordInput}
                                value={data.password}
                                onChange={(e) =>
                                    setData('password', e.target.value)
                                }
                                className="monev-input has-icon"
                                placeholder="Masukkan kata sandi"
                                autoFocus
                            />
                        </div>
                        <InputError
                            message={errors.password}
                            className="mt-2"
                        />
                    </div>

                    <div className="mt-6 flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={closeModal}
                            className="monev-btn monev-btn-secondary"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            disabled={processing}
                            className="monev-btn monev-btn-danger"
                        >
                            {processing ? 'Menghapus...' : 'Ya, Hapus Akun'}
                        </button>
                    </div>
                </form>
            </Modal>
        </section>
    );
}
