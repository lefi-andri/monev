import ApplicationLogo from '@/Components/ApplicationLogo';
import ServerTime from '@/Components/ServerTime';
import { Link } from '@inertiajs/react';
import { Globe, LogIn, ShieldCheck, UserPlus } from 'lucide-react';

export default function GuestLayout({
    children,
    title = 'Portal Monev Magang',
    subtitle = 'PT KOKEK - Sistem Monitoring & Evaluasi Magang',
    activeTab = 'login',
    showTabs = true,
}) {
    return (
        <div className="monev-shell">
            <div className="app-canvas flex min-h-screen flex-col justify-between">
                {/* Header Canvas Dashboard Style */}
                <header className="sticky top-0 z-20 flex items-center justify-between border-b border-[#e2eaf4] bg-white/95 px-5 py-3.5 backdrop-blur-md">
                    <Link href="/" className="flex items-center gap-3 transition hover:opacity-90">
                        <ApplicationLogo showText={true} className="h-10 w-10" />
                    </Link>
                    <div className="flex items-center gap-2">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#eef4ff] border border-[#cbe0ff] px-3 py-1 text-xs font-bold text-[#075cdb]">
                            <ShieldCheck size={14} />
                            <span>Portal Akses</span>
                        </span>
                    </div>
                </header>

                {/* Konten Halaman Auth dalam Canvas Page */}
                <main className="page flex-1">
                    {/* Welcome Row Dashboard Style */}
                    <div className="welcome-row">
                        <div>
                            <h1>
                                {title} <span>{activeTab === 'login' ? '🔐' : activeTab === 'register' ? '📝' : '🔒'}</span>
                            </h1>
                            <p>{subtitle}</p>
                        </div>
                    </div>

                    {/* Tab Switcher Masuk / Daftar */}
                    {showTabs && (
                        <div className="tab-bar !grid-cols-2 mt-2 mb-6">
                            <Link
                                href={route('login')}
                                className={activeTab === 'login' ? 'active' : ''}
                            >
                                <LogIn size={18} className="mr-1.5 inline" />
                                <span>Masuk ke Akun</span>
                            </Link>
                            <Link
                                href={route('register')}
                                className={activeTab === 'register' ? 'active' : ''}
                            >
                                <UserPlus size={18} className="mr-1.5 inline" />
                                <span>Daftar Baru</span>
                            </Link>
                        </div>
                    )}

                    {children}
                </main>

                {/* Footer spacer agar konten tidak tertutup ServerTime dan BottomNav */}
                <div className="footer-spacer" />

                {/* ServerTime floating persis seperti di Dashboard */}
                <ServerTime />

                {/* Bottom Navigation Guest / Auth */}
                <nav className="bottom-nav" aria-label="Navigasi Akses">
                    <Link
                        href={route('login')}
                        className={activeTab === 'login' ? 'active' : ''}
                    >
                        <span className="nav-icon">
                            <LogIn size={25} strokeWidth={2.3} />
                        </span>
                        <span>Masuk</span>
                    </Link>
                    <Link
                        href={route('register')}
                        className={activeTab === 'register' ? 'active' : ''}
                    >
                        <span className="nav-icon">
                            <UserPlus size={25} strokeWidth={2.3} />
                        </span>
                        <span>Daftar</span>
                    </Link>
                    <a
                        href="https://kokek.com"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <span className="nav-icon">
                            <Globe size={25} strokeWidth={2.3} />
                        </span>
                        <span>PT KOKEK</span>
                    </a>
                </nav>
            </div>
        </div>
    );
}
