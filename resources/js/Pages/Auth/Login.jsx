import InputError from '@/Components/InputError';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Check, Eye, EyeOff, Lock, LogIn, Mail, Shield, UserCheck, Users } from 'lucide-react';
import { useState } from 'react';

export default function Login({ status, canResetPassword }) {
    const [showPassword, setShowPassword] = useState(false);
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    const fillAccount = (email) => {
        setData({
            email,
            password: 'Password123!',
            remember: true,
        });
    };

    return (
        <GuestLayout
            title="Masuk ke Akun"
            subtitle="Portal Monitoring & Evaluasi Magang PT KOKEK"
            activeTab="login"
        >
            <Head title="Masuk ke Akun - Monev Magang" />

            <div className="detail-card p-6 sm:p-7">
                {/* Header Kartu Form */}
                <div className="flex items-center gap-3 pb-5 mb-5 border-b border-[#e9f0fa]">
                    <span className="grid h-10 w-10 place-items-center rounded-2xl bg-[#edf4ff] text-[#075cdb]">
                        <LogIn size={20} />
                    </span>
                    <div>
                        <h2 className="text-lg font-bold text-[#061737]">Kredensial Masuk</h2>
                        <p className="text-xs font-semibold text-[#61718d]">
                            Gunakan alamat email & kata sandi akun Anda
                        </p>
                    </div>
                </div>

                {status && (
                    <div className="mb-5 flex items-center gap-2 rounded-2xl bg-[#e9f9ef] border border-[#a7f3d0] p-4 text-sm font-semibold text-[#0b8a46]">
                        <Check size={18} />
                        <span>{status}</span>
                    </div>
                )}

                <form onSubmit={submit} className="space-y-4">
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
                                autoFocus
                                onChange={(e) => setData('email', e.target.value)}
                                required
                            />
                        </div>
                        <InputError message={errors.email} className="mt-2" />
                    </div>

                    <div>
                        <div className="flex items-center justify-between">
                            <label htmlFor="password" className="monev-label">
                                Kata Sandi
                            </label>
                            {canResetPassword && (
                                <Link
                                    href={route('password.request')}
                                    className="text-xs font-bold text-[#075cdb] hover:underline"
                                >
                                    Lupa kata sandi?
                                </Link>
                            )}
                        </div>
                        <div className="monev-input-wrap">
                            <Lock className="input-icon" />
                            <input
                                id="password"
                                type={showPassword ? 'text' : 'password'}
                                name="password"
                                value={data.password}
                                placeholder="••••••••"
                                className="monev-input has-icon has-toggle"
                                autoComplete="current-password"
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

                    <div className="flex items-center pt-1">
                        <label className="flex cursor-pointer items-center gap-2.5 text-sm font-semibold text-[#54657e]">
                            <input
                                type="checkbox"
                                name="remember"
                                checked={data.remember}
                                onChange={(e) => setData('remember', e.target.checked)}
                                className="h-5 w-5 rounded-md border-[#c5d4e8] text-[#075cdb] focus:ring-[#075cdb]"
                            />
                            <span>Ingat saya di perangkat ini</span>
                        </label>
                    </div>

                    <div className="pt-2">
                        <button
                            type="submit"
                            disabled={processing}
                            className="monev-btn monev-btn-primary w-full"
                        >
                            {processing ? 'Memproses...' : 'Masuk ke Akun'}
                        </button>
                    </div>
                </form>

                {/* Akun Uji Coba Cepat (Demo) */}
                <div className="mt-6 border-t border-[#e5edf7] pt-5">
                    <span className="mb-3 block text-center text-xs font-bold uppercase tracking-wider text-[#798ba5]">
                        Pilihan Cepat Akun Demo (1-Klik)
                    </span>
                    <div className="grid grid-cols-3 gap-2 sm:gap-3">
                        <button
                            type="button"
                            onClick={() => fillAccount('mentor@monev.test')}
                            className="flex flex-col items-center justify-center gap-1.5 rounded-2xl border border-[#d5e1ef] bg-[#f8fbff] p-3 text-xs font-bold text-[#075cdb] transition hover:bg-[#edf4ff] hover:border-[#b8d4f6] cursor-pointer shadow-2xs"
                        >
                            <span className="grid h-8 w-8 place-items-center rounded-xl bg-[#eef4ff] text-[#075cdb]">
                                <UserCheck size={18} />
                            </span>
                            <span>Mentor</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => fillAccount('peserta@monev.test')}
                            className="flex flex-col items-center justify-center gap-1.5 rounded-2xl border border-[#d5e1ef] bg-[#f8fbff] p-3 text-xs font-bold text-[#059669] transition hover:bg-[#edf4ff] hover:border-[#a7f3d0] cursor-pointer shadow-2xs"
                        >
                            <span className="grid h-8 w-8 place-items-center rounded-xl bg-[#ecfdf5] text-[#059669]">
                                <Users size={18} />
                            </span>
                            <span>Peserta</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => fillAccount('admin@monev.test')}
                            className="flex flex-col items-center justify-center gap-1.5 rounded-2xl border border-[#d5e1ef] bg-[#f8fbff] p-3 text-xs font-bold text-[#7c3aed] transition hover:bg-[#edf4ff] hover:border-[#ddd6fe] cursor-pointer shadow-2xs"
                        >
                            <span className="grid h-8 w-8 place-items-center rounded-xl bg-[#f5f3ff] text-[#7c3aed]">
                                <Shield size={18} />
                            </span>
                            <span>Admin</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Banner Pengumuman / Info Akses Gaya Dashboard */}
            <div className="announcement mt-5 !bg-[#eff6ff] !text-[#075cdb] border border-[#d2e4fc]">
                <span className="alert-dot !bg-[#075cdb] text-white">
                    <Shield size={18} />
                </span>
                <div className="text-xs sm:text-sm font-semibold text-[#1e3155]">
                    Belum memiliki akun peserta? Silakan klik tab{' '}
                    <Link href={route('register')} className="font-bold text-[#075cdb] underline">
                        Daftar Baru
                    </Link>{' '}
                    di atas untuk melakukan registrasi.
                </div>
            </div>
        </GuestLayout>
    );
}
