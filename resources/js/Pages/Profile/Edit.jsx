import ServerTime from '@/Components/ServerTime';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { ArrowLeft, LogOut, Mail, Phone, ShieldCheck } from 'lucide-react';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdateAvatarForm from './Partials/UpdateAvatarForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';

export default function Edit({ mustVerifyEmail, status }) {
    const user = usePage().props.auth.user;
    const initials = user.name
        .split(' ')
        .map((part) => part[0])
        .slice(0, 2)
        .join('');

    const roleName = user.role
        ? user.role.charAt(0).toUpperCase() + user.role.slice(1)
        : 'Pengguna';

    return (
        <>
            <Head title="Kelola Profil - Monev Magang" />
            <div className="monev-shell">
                <div className="app-canvas">
                    <main className="page profile-edit-page">
                        {/* Header dengan tombol kembali */}
                        <div className="mb-8 flex items-center justify-between gap-4">
                            <div className="flex items-center gap-4">
                                <Link
                                    href={route('dashboard')}
                                    className="back-btn"
                                    aria-label="Kembali ke Dashboard"
                                >
                                    <ArrowLeft size={22} />
                                </Link>
                                <div>
                                    <h1>Kelola Profil</h1>
                                    <p className="subtitle !mb-0 !mt-1">
                                        Perbarui profil, avatar, kata sandi, dan setelan akun Anda.
                                    </p>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => router.post(route('logout'))}
                                className="inline-flex items-center gap-2 rounded-2xl border border-[#ffc8c8] bg-[#fff4f4] px-4 py-2.5 text-sm font-bold text-[#d02a2a] shadow-xs transition hover:bg-[#ffe6e6]"
                                title="Keluar dari akun"
                            >
                                <LogOut size={18} />
                                <span>Keluar</span>
                            </button>
                        </div>

                        {/* Ringkasan Profil Pengguna (Sama dengan Akun Mentor) */}
                        <section className="profile-card !mt-0 mb-8">
                            {user.avatar_url ? (
                                <img
                                    src={user.avatar_url}
                                    alt={user.name}
                                    className="initial-avatar big object-cover"
                                />
                            ) : (
                                <div className="initial-avatar big">{initials}</div>
                            )}
                            <div>
                                <b>{user.name}</b>
                                <span className="inline-flex items-center gap-1.5 font-bold text-[#075cdb]">
                                    <ShieldCheck size={18} /> Role: {roleName}
                                </span>
                                <span>
                                    <Mail size={18} /> {user.email}
                                </span>
                                <span>
                                    <Phone size={18} /> Perusahaan: Kokek
                                </span>
                            </div>
                        </section>

                        {/* Formulir Pengaturan Profil */}
                        <div className="space-y-6">
                            <UpdateAvatarForm />
                            <UpdateProfileInformationForm
                                mustVerifyEmail={mustVerifyEmail}
                                status={status}
                            />
                            <UpdatePasswordForm />
                            <DeleteUserForm />
                        </div>

                        <div className="mt-8 flex justify-center">
                            <button
                                type="button"
                                className="logout-button !mt-0"
                                onClick={() => router.post(route('logout'))}
                            >
                                <LogOut /> Keluar dari akun
                            </button>
                        </div>

                        <div className="footer-spacer" />
                        <ServerTime />
                    </main>
                </div>
            </div>
        </>
    );
}
