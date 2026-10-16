import InputError from '@/Components/InputError';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Mail, KeyRound } from 'lucide-react';

export default function ForgotPassword({ status }) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('password.email'));
    };

    return (
        <GuestLayout
            title="Lupa Kata Sandi"
            subtitle="Masukkan email terdaftar untuk pemulihan kata sandi"
            showTabs={false}
            activeTab={null}
        >
            <Head title="Lupa Kata Sandi - Monev Magang" />

            <div className="detail-card p-6 sm:p-7">
                <div className="flex items-center gap-3 pb-5 mb-5 border-b border-[#e9f0fa]">
                    <span className="grid h-10 w-10 place-items-center rounded-2xl bg-[#edf4ff] text-[#075cdb]">
                        <KeyRound size={20} />
                    </span>
                    <div>
                        <h2 className="text-lg font-bold text-[#061737]">Pemulihan Akun</h2>
                        <p className="text-xs font-semibold text-[#61718d]">
                            Tautan reset akan dikirim ke email Anda
                        </p>
                    </div>
                </div>

                {status && (
                    <div className="mb-5 rounded-2xl bg-[#e9f9ef] border border-[#a7f3d0] p-4 text-sm font-semibold text-[#0b8a46]">
                        {status}
                    </div>
                )}

                <form onSubmit={submit} className="space-y-4">
                    <div>
                        <label htmlFor="email" className="monev-label">
                            Alamat Email Terdaftar
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
                                autoFocus
                                onChange={(e) => setData('email', e.target.value)}
                                required
                            />
                        </div>
                        <InputError message={errors.email} className="mt-2" />
                    </div>

                    <div className="pt-2">
                        <button
                            type="submit"
                            disabled={processing}
                            className="monev-btn monev-btn-primary w-full"
                        >
                            {processing ? 'Mengirim...' : 'Kirim Tautan Pemulihan'}
                        </button>
                    </div>
                </form>

                <div className="mt-6 border-t border-[#e5edf7] pt-5 text-center">
                    <Link
                        href={route('login')}
                        className="inline-flex items-center gap-2 text-sm font-bold text-[#075cdb] hover:underline"
                    >
                        <ArrowLeft size={16} /> Kembali ke Halaman Masuk
                    </Link>
                </div>
            </div>
        </GuestLayout>
    );
}
