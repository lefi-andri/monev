import InputError from '@/Components/InputError';
import { Transition } from '@headlessui/react';
import { Link, useForm, usePage } from '@inertiajs/react';
import { Check, Mail, UserRound } from 'lucide-react';

export default function UpdateProfileInformation({
    mustVerifyEmail,
    status,
    className = '',
}) {
    const user = usePage().props.auth.user;

    const { data, setData, patch, errors, processing, recentlySuccessful } =
        useForm({
            name: user.name,
            email: user.email,
        });

    const submit = (e) => {
        e.preventDefault();
        patch(route('profile.update'));
    };

    return (
        <section className={`detail-card p-7 sm:p-8 ${className}`}>
            <header className="flex items-center gap-4">
                <span className="icon-tile blue">
                    <UserRound />
                </span>
                <div>
                    <h2 className="text-xl font-bold text-[#061737]">Informasi Profil</h2>
                    <p className="mt-0.5 text-sm text-[#61718d]">
                        Perbarui nama lengkap dan alamat email utama akun Anda.
                    </p>
                </div>
            </header>

            <form onSubmit={submit} className="mt-6 space-y-5">
                <div>
                    <label htmlFor="profile-name" className="monev-label">
                        Nama Lengkap
                    </label>
                    <div className="monev-input-wrap">
                        <UserRound className="input-icon" />
                        <input
                            id="profile-name"
                            className="monev-input has-icon"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            required
                            autoComplete="name"
                            placeholder="Nama Lengkap"
                        />
                    </div>
                    <InputError className="mt-2" message={errors.name} />
                </div>

                <div>
                    <label htmlFor="profile-email" className="monev-label">
                        Alamat Email
                    </label>
                    <div className="monev-input-wrap">
                        <Mail className="input-icon" />
                        <input
                            id="profile-email"
                            type="email"
                            className="monev-input has-icon"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            required
                            autoComplete="username"
                            placeholder="nama@email.com"
                        />
                    </div>
                    <InputError className="mt-2" message={errors.email} />
                </div>

                {mustVerifyEmail && user.email_verified_at === null && (
                    <div className="rounded-2xl border border-[#ffbd6d] bg-[#fff7ee] p-4 text-sm text-[#9d2d00]">
                        <p className="font-semibold">
                            Alamat email Anda belum diverifikasi.{' '}
                            <Link
                                href={route('verification.send')}
                                method="post"
                                as="button"
                                className="font-extrabold underline hover:opacity-80"
                            >
                                Klik di sini untuk mengirim ulang email verifikasi.
                            </Link>
                        </p>

                        {status === 'verification-link-sent' && (
                            <div className="mt-2 font-bold text-[#0b8a46]">
                                Tautan verifikasi baru telah dikirim ke alamat email Anda.
                            </div>
                        )}
                    </div>
                )}

                <div className="flex items-center gap-4 pt-2">
                    <button
                        type="submit"
                        disabled={processing}
                        className="monev-btn monev-btn-primary"
                    >
                        {processing ? 'Menyimpan...' : 'Simpan Informasi'}
                    </button>

                    <Transition
                        show={recentlySuccessful}
                        enter="transition ease-in-out duration-300"
                        enterFrom="opacity-0 translate-y-1"
                        leave="transition ease-in-out duration-300"
                        leaveTo="opacity-0"
                    >
                        <span className="inline-flex items-center gap-1.5 text-sm font-bold text-[#0b8a46]">
                            <Check size={18} /> Berhasil disimpan
                        </span>
                    </Transition>
                </div>
            </form>
        </section>
    );
}
