import InputError from '@/Components/InputError';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Check, Eye, EyeOff, Lock, Mail, Shield, UserCheck, Users } from 'lucide-react';
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
        <GuestLayout>
            <Head title="Masuk ke Akun" />

            <div className="auth-header">
                <h1>Masuk ke Akun</h1>
                <p>Silakan masuk untuk mengakses portal Monev Magang</p>
            </div>

            {status && (
                <div className="mb-5 rounded-2xl bg-[#e9f9ef] p-4 text-sm font-semibold text-[#0b8a46]">
                    {status}
                </div>
            )}

            <form onSubmit={submit} className="space-y-5">
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
                                className="text-sm font-bold text-[#075cdb] hover:underline"
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

                <div className="flex items-center">
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

                <button
                    type="submit"
                    disabled={processing}
                    className="monev-btn monev-btn-primary w-full"
                >
                    {processing ? 'Memproses...' : 'Masuk ke Akun'}
                </button>
            </form>

            <div className="mt-6 border-t border-[#e5edf7] pt-5">
                <span className="mb-3 block text-center text-xs font-bold uppercase tracking-wider text-[#798ba5]">
                    Pilihan Akun Uji Coba Cepat
                </span>
                <div className="grid grid-cols-3 gap-2">
                    <button
                        type="button"
                        onClick={() => fillAccount('mentor@monev.test')}
                        className="flex flex-col items-center justify-center gap-1 rounded-2xl border border-[#d5e1ef] bg-[#f8fbff] p-2.5 text-xs font-bold text-[#075cdb] transition hover:bg-[#edf4ff]"
                    >
                        <UserCheck size={18} />
                        <span>Mentor</span>
                    </button>
                    <button
                        type="button"
                        onClick={() => fillAccount('peserta@monev.test')}
                        className="flex flex-col items-center justify-center gap-1 rounded-2xl border border-[#d5e1ef] bg-[#f8fbff] p-2.5 text-xs font-bold text-[#075cdb] transition hover:bg-[#edf4ff]"
                    >
                        <Users size={18} />
                        <span>Peserta</span>
                    </button>
                    <button
                        type="button"
                        onClick={() => fillAccount('admin@monev.test')}
                        className="flex flex-col items-center justify-center gap-1 rounded-2xl border border-[#d5e1ef] bg-[#f8fbff] p-2.5 text-xs font-bold text-[#075cdb] transition hover:bg-[#edf4ff]"
                    >
                        <Shield size={18} />
                        <span>Admin</span>
                    </button>
                </div>
            </div>

            <div className="mt-6 text-center text-sm font-medium text-[#61718d]">
                Belum memiliki akun?{' '}
                <Link
                    href={route('register')}
                    className="font-bold text-[#075cdb] hover:underline"
                >
                    Daftar Sekarang
                </Link>
            </div>
        </GuestLayout>
    );
}
