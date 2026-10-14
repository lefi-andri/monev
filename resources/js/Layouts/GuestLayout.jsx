import ApplicationLogo from '@/Components/ApplicationLogo';
import ServerTime from '@/Components/ServerTime';
import { Link } from '@inertiajs/react';

export default function GuestLayout({ children }) {
    return (
        <div className="monev-shell flex min-h-screen flex-col items-center justify-center px-4 py-10">
            <div className="mb-6">
                <Link href="/" className="transition hover:opacity-90">
                    <ApplicationLogo showText={true} className="h-14 w-14" />
                </Link>
            </div>

            <div className="w-full max-w-[480px]">
                <div className="auth-card">
                    {children}
                </div>
            </div>

            <div className="mt-8 flex flex-col items-center gap-3">
                <ServerTime className="!static !bottom-auto !left-auto !transform-none" />
                <p className="text-center text-xs font-medium text-[#7d8fa9]">
                    &copy; 2026 Monev Magang &middot; Kokek. Seluruh hak cipta dilindungi.
                </p>
            </div>
        </div>
    );
}
