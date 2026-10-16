import InputError from '@/Components/InputError';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Eye, EyeOff, Lock, Mail, ShieldCheck, UserPlus, UserRound } from 'lucide-react';
import { useState } from 'react';

export default function Register() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <GuestLayout
            title="Daftar Akun Baru"
            subtitle="Portal Monitoring & Evaluasi Magang PT KOKEK"
            activeTab="register"
        >
            <Head title="Daftar Akun Baru - Monev Magang" />

            <div className="detail-card p-6 sm:p-7">
                {/* Header Kartu Form */}
                <div className="flex items-center gap-3 pb-5 mb-5 border-b border-[#e9f0fa]">
                    <span className="grid h-10 w-10 place-items-center rounded-2xl bg-[#edf4ff] text-[#075cdb]">
                        <UserPlus size={20} />
                    </span>
                    <div>
                        <h2 className="text-lg font-bold text-[#061737]">Formulir Pendaftaran</h2>
                        <p className="text-xs font-semibold text-[#61718d]">
                            Lengkapi data diri untuk membuat akun peserta baru
                        </p>
                    </div>
                </div>

                <form onSubmit={submit} className="space-y-4">
                    <div>
                        <label htmlFor="name" className="monev-label">
                            Nama Lengkap
                        </label>
                        <div className="monev-input-wrap">
                            <UserRound className="input-icon" />
                            <input
                                id="name"
                                name="name"
                                type="text"
                                value={data.name}
                                placeholder="Contoh: Budi Santoso"
                                className="monev-input has-icon"
                                autoComplete="name"
                                autoFocus
                                onChange={(e) => setData('name', e.target.value)}
                                required
                            />
                        </div>
                        <InputError message={errors.name} className="mt-2" />
                    </div>

                    <div>
                        <label htmlFor="email" className="monev-label">
                            Alamat Email
                        </label>
                        <div className="monev-input-wrap">
                            <Mail className="input-icon" />
                            <input
                                id="email"
                                type="email"
                                name="email"
                                value={data.email}
                                placeholder="nama@email.com"
                                className="monev-input has-icon"
                                autoComplete="username"
                                onChange={(e) => setData('email', e.target.value)}
                                required
                            />
                        </div>
                        <InputError message={errors.email} className="mt-2" />
                    </div>

                    <div>
                        <label htmlFor="password" className="monev-label">
                            Kata Sandi
                        </label>
                        <div className="monev-input-wrap">
                            <Lock className="input-icon" />
                            <input
                                id="password"
                                type={showPassword ? 'text' : 'password'}
                                name="password"
                                value={data.password}
                                placeholder="Minimal 8 karakter"
                                className="monev-input has-icon has-toggle"
                                autoComplete="new-password"
                                onChange={(e) => setData('password', e.target.value)}
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="input-toggle-btn"
                                aria-label={showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
                            >
                                {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
                            </button>
                        </div>
                        <InputError message={errors.password} className="mt-2" />
                    </div>

                    <div>
                        <label htmlFor="password_confirmation" className="monev-label">
                            Konfirmasi Kata Sandi
                        </label>
                        <div className="monev-input-wrap">
                            <Lock className="input-icon" />
                            <input
                                id="password_confirmation"
                                type={showConfirmPassword ? 'text' : 'password'}
                                name="password_confirmation"
                                value={data.password_confirmation}
                                placeholder="Ulangi kata sandi Anda"
                                className="monev-input has-icon has-toggle"
                                autoComplete="new-password"
                                onChange={(e) =>
                                    setData('password_confirmation', e.target.value)
                                }
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="input-toggle-btn"
                                aria-label={showConfirmPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
                            >
                                {showConfirmPassword ? <EyeOff size={19} /> : <Eye size={19} />}
                            </button>
                        </div>
                        <InputError
                            message={errors.password_confirmation}
                            className="mt-2"
                        />
                    </div>

                    <div className="pt-2">
                        <button
                            type="submit"
                            disabled={processing}
                            className="monev-btn monev-btn-primary w-full"
                        >
                            {processing ? 'Mendaftarkan...' : 'Daftar Sekarang'}
                        </button>
                    </div>
                </form>
            </div>

            {/* Banner Pengumuman / Info Akses Gaya Dashboard */}
            <div className="announcement mt-5 !bg-[#eff6ff] !text-[#075cdb] border border-[#d2e4fc]">
                <span className="alert-dot !bg-[#075cdb] text-white">
                    <ShieldCheck size={18} />
                </span>
                <div className="text-xs sm:text-sm font-semibold text-[#1e3155]">
                    Sudah memiliki akun? Silakan klik tab{' '}
                    <Link href={route('login')} className="font-bold text-[#075cdb] underline">
                        Masuk ke Akun
                    </Link>{' '}
                    di atas untuk langsung login.
                </div>
            </div>
        </GuestLayout>
    );
}
