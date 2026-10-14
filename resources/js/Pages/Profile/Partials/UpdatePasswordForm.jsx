import InputError from '@/Components/InputError';
import { Transition } from '@headlessui/react';
import { useForm } from '@inertiajs/react';
import { Check, Eye, EyeOff, KeyRound, Lock } from 'lucide-react';
import { useRef, useState } from 'react';

export default function UpdatePasswordForm({ className = '' }) {
    const passwordInput = useRef();
    const currentPasswordInput = useRef();
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const {
        data,
        setData,
        errors,
        put,
        reset,
        processing,
        recentlySuccessful,
    } = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const updatePassword = (e) => {
        e.preventDefault();

        put(route('password.update'), {
            preserveScroll: true,
            onSuccess: () => reset(),
            onError: (errors) => {
                if (errors.password) {
                    reset('password', 'password_confirmation');
                    passwordInput.current?.focus();
                }

                if (errors.current_password) {
                    reset('current_password');
                    currentPasswordInput.current?.focus();
                }
            },
        });
    };

    return (
        <section className={`detail-card p-7 sm:p-8 ${className}`}>
            <header className="flex items-center gap-4">
                <span className="icon-tile blue">
                    <KeyRound />
                </span>
                <div>
                    <h2 className="text-xl font-bold text-[#061737]">Perbarui Kata Sandi</h2>
                    <p className="mt-0.5 text-sm text-[#61718d]">
                        Pastikan akun Anda menggunakan kata sandi acak dan panjang agar tetap aman.
                    </p>
                </div>
            </header>

            <form onSubmit={updatePassword} className="mt-6 space-y-5">
                <div>
                    <label htmlFor="current_password" className="monev-label">
                        Kata Sandi Saat Ini
                    </label>
                    <div className="monev-input-wrap">
                        <Lock className="input-icon" />
                        <input
                            id="current_password"
                            ref={currentPasswordInput}
                            value={data.current_password}
                            onChange={(e) =>
                                setData('current_password', e.target.value)
                            }
                            type={showCurrentPassword ? 'text' : 'password'}
                            className="monev-input has-icon has-toggle"
                            autoComplete="current-password"
                            placeholder="Kata sandi saat ini"
                        />
                        <button
                            type="button"
                            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                            className="input-toggle-btn"
                            aria-label={showCurrentPassword ? 'Sembunyikan' : 'Lihat'}
                        >
                            {showCurrentPassword ? <EyeOff size={19} /> : <Eye size={19} />}
                        </button>
                    </div>
                    <InputError
                        message={errors.current_password}
                        className="mt-2"
                    />
                </div>

                <div>
                    <label htmlFor="password" className="monev-label">
                        Kata Sandi Baru
                    </label>
                    <div className="monev-input-wrap">
                        <Lock className="input-icon" />
                        <input
                            id="password"
                            ref={passwordInput}
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            type={showPassword ? 'text' : 'password'}
                            className="monev-input has-icon has-toggle"
                            autoComplete="new-password"
                            placeholder="Minimal 8 karakter"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="input-toggle-btn"
                            aria-label={showPassword ? 'Sembunyikan' : 'Lihat'}
                        >
                            {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
                        </button>
                    </div>
                    <InputError message={errors.password} className="mt-2" />
                </div>

                <div>
                    <label htmlFor="password_confirmation" className="monev-label">
                        Konfirmasi Kata Sandi Baru
                    </label>
                    <div className="monev-input-wrap">
                        <Lock className="input-icon" />
                        <input
                            id="password_confirmation"
                            value={data.password_confirmation}
                            onChange={(e) =>
                                setData('password_confirmation', e.target.value)
                            }
                            type={showConfirmPassword ? 'text' : 'password'}
                            className="monev-input has-icon has-toggle"
                            autoComplete="new-password"
                            placeholder="Ulangi kata sandi baru"
                        />
                        <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="input-toggle-btn"
                            aria-label={showConfirmPassword ? 'Sembunyikan' : 'Lihat'}
                        >
                            {showConfirmPassword ? <EyeOff size={19} /> : <Eye size={19} />}
                        </button>
                    </div>
                    <InputError
                        message={errors.password_confirmation}
                        className="mt-2"
                    />
                </div>

                <div className="flex items-center gap-4 pt-2">
                    <button
                        type="submit"
                        disabled={processing}
                        className="monev-btn monev-btn-primary"
                    >
                        {processing ? 'Menyimpan...' : 'Perbarui Kata Sandi'}
                    </button>

                    <Transition
                        show={recentlySuccessful}
                        enter="transition ease-in-out duration-300"
                        enterFrom="opacity-0 translate-y-1"
                        leave="transition ease-in-out duration-300"
                        leaveTo="opacity-0"
                    >
                        <span className="inline-flex items-center gap-1.5 text-sm font-bold text-[#0b8a46]">
                            <Check size={18} /> Kata sandi berhasil diubah
                        </span>
                    </Transition>
                </div>
            </form>
        </section>
    );
}
