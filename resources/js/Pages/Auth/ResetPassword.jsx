import InputError from '@/Components/InputError';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, useForm } from '@inertiajs/react';
import { Lock, Mail } from 'lucide-react';

export default function ResetPassword({ token, email }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        token: token,
        email: email,
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('password.store'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Atur Ulang Kata Sandi" />

            <div className="auth-header">
                <h1>Atur Ulang Kata Sandi</h1>
                <p>Masukkan kata sandi baru untuk akun Anda.</p>
            </div>

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
                        Kata Sandi Baru
                    </label>
                    <div className="monev-input-wrap">
                        <Lock className="input-icon" />
                        <input
                            id="password"
                            type="password"
                            name="password"
                            value={data.password}
                            placeholder="Minimal 8 karakter"
                            className="monev-input has-icon"
                            autoComplete="new-password"
                            autoFocus
                            onChange={(e) => setData('password', e.target.value)}
                            required
                        />
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
                            type="password"
                            id="password_confirmation"
                            name="password_confirmation"
                            value={data.password_confirmation}
                            placeholder="Ulangi kata sandi baru"
                            className="monev-input has-icon"
                            autoComplete="new-password"
                            onChange={(e) =>
                                setData('password_confirmation', e.target.value)
                            }
                            required
                        />
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
                        {processing ? 'Menyimpan...' : 'Perbarui Kata Sandi'}
                    </button>
                </div>
            </form>
        </GuestLayout>
    );
}
