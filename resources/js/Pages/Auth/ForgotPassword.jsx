import InputError from '@/Components/InputError';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Mail } from 'lucide-react';

export default function ForgotPassword({ status }) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('password.email'));
    };

    return (
        <GuestLayout>
            <Head title="Lupa Kata Sandi" />

            <div className="auth-header">
                <h1>Lupa Kata Sandi</h1>
                <p>
                    Masukkan alamat email Anda untuk menerima tautan pemulihan kata sandi.
                </p>
            </div>

            {status && (
                <div className="mb-5 rounded-2xl bg-[#e9f9ef] p-4 text-sm font-semibold text-[#0b8a46]">
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

            <div className="mt-6 text-center">
                <Link
                    href={route('login')}
                    className="inline-flex items-center gap-2 text-sm font-bold text-[#075cdb] hover:underline"
                >
                    <ArrowLeft size={16} /> Kembali ke halaman masuk
                </Link>
            </div>
        </GuestLayout>
    );
}
