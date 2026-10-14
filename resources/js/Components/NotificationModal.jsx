import { router, usePage } from '@inertiajs/react';
import {
    Bell, CalendarClock, Check, CheckCheck, Megaphone,
    ShieldCheck, Sparkles, Star, X,
} from 'lucide-react';

export default function NotificationModal({
    isOpen,
    onClose,
    onOpenAnnouncement,
}) {
    if (!isOpen) return null;

    const notifications = usePage().props.notifications || [];
    const unreadCount = usePage().props.unreadNotificationsCount || 0;

    const markAsRead = (n) => {
        if (!n.is_read) {
            router.post(route('notifications.read', n.id), {}, { preserveScroll: true });
        }
        if (n.type === 'announcement' && onOpenAnnouncement) {
            onClose();
            onOpenAnnouncement(n.data?.announcement_id);
        }
    };

    const markAllRead = () => {
        router.post(route('notifications.read-all'), {}, { preserveScroll: true });
    };

    const getIcon = (type) => {
        switch (type) {
            case 'announcement':
                return <Megaphone size={17} className="text-[#075cdb]" />;
            case 'attendance':
                return <CalendarClock size={17} className="text-[#e65100]" />;
            case 'evaluation':
                return <Star size={17} className="text-[#ca8a04]" />;
            case 'system':
                return <ShieldCheck size={17} className="text-[#059669]" />;
            default:
                return <Sparkles size={17} className="text-[#075cdb]" />;
        }
    };

    const getBgColor = (type) => {
        switch (type) {
            case 'announcement':
                return 'bg-[#edf4ff] ring-1 ring-[#cde0f8]';
            case 'attendance':
                return 'bg-[#fff3e0] ring-1 ring-[#ffe0b2]';
            case 'evaluation':
                return 'bg-[#fefce8] ring-1 ring-[#fef08a]';
            case 'system':
                return 'bg-[#ecfdf5] ring-1 ring-[#a7f3d0]';
            default:
                return 'bg-[#edf4ff] ring-1 ring-[#cde0f8]';
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4 sm:p-6 backdrop-blur-xs animate-in fade-in duration-150">
            <div className="w-full max-w-lg max-h-[calc(100dvh-2rem)] sm:max-h-[calc(100dvh-4rem)] overflow-hidden rounded-3xl border border-[#d5e1ef] bg-white shadow-2xl flex flex-col">
                {/* Header */}
                <div className="shrink-0 flex items-center justify-between border-b border-[#e9f0fa] px-6 py-5">
                    <div className="flex items-center gap-3">
                        <span className="grid h-10 w-10 place-items-center rounded-2xl bg-[#edf4ff] text-[#075cdb]">
                            <Bell size={20} />
                        </span>
                        <div>
                            <div className="flex items-center gap-2">
                                <h3 className="text-lg font-bold text-[#061737]">Notifikasi</h3>
                                {unreadCount > 0 && (
                                    <span className="rounded-full bg-[#ef4444] px-2 py-0.5 text-xs font-bold text-white">
                                        {unreadCount} baru
                                    </span>
                                )}
                            </div>
                            <p className="text-xs text-[#61718d]">Pemberitahuan aktivitas & pengumuman terkini.</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-1">
                        {unreadCount > 0 && (
                            <button
                                type="button"
                                onClick={markAllRead}
                                className="inline-flex cursor-pointer items-center gap-1 rounded-xl px-2.5 py-1.5 text-xs font-bold text-[#075cdb] hover:bg-[#edf4ff] transition"
                                title="Tandai semua telah dibaca"
                            >
                                <CheckCheck size={15} />
                                <span className="hidden sm:inline">Tandai dibaca</span>
                            </button>
                        )}
                        <button
                            type="button"
                            onClick={onClose}
                            className="grid h-9 w-9 place-items-center rounded-xl text-[#61718d] hover:bg-[#f1f5f9] transition cursor-pointer"
                        >
                            <X size={19} />
                        </button>
                    </div>
                </div>

                {/* Notification List - Single Scrollable Area */}
                <div className="flex-1 min-h-0 overflow-y-auto monev-scrollbar divide-y divide-[#f0f4fa] p-2">
                    {notifications.length === 0 ? (
                        <div className="py-12 text-center">
                            <span className="mx-auto mb-3 grid h-14 w-14 place-items-center rounded-3xl bg-[#f0f4f9] text-[#8697ae]">
                                <Bell size={26} />
                            </span>
                            <p className="text-sm font-bold text-[#061737]">Belum ada notifikasi</p>
                            <p className="text-xs text-[#8c9cae]">Pemberitahuan sistem akan muncul di sini.</p>
                        </div>
                    ) : (
                        notifications.map((n) => (
                            <div
                                key={n.id}
                                onClick={() => markAsRead(n)}
                                className={`flex cursor-pointer items-start gap-3.5 rounded-2xl p-4 transition ${
                                    !n.is_read
                                        ? 'bg-[#f8fbff] hover:bg-[#f0f6ff]'
                                        : 'hover:bg-[#fafcff]'
                                }`}
                            >
                                <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-2xl ${getBgColor(n.type)}`}>
                                    {getIcon(n.type)}
                                </span>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-baseline justify-between gap-2">
                                        <b className="truncate text-sm font-bold text-[#061737]">
                                            {n.title}
                                        </b>
                                        <time className="shrink-0 text-[11px] font-semibold text-[#8a9bb0]">
                                            {n.created_at}
                                        </time>
                                    </div>
                                    <p className="mt-0.5 text-xs text-[#52637a] leading-relaxed line-clamp-2">
                                        {n.message}
                                    </p>
                                </div>
                                {!n.is_read && (
                                    <span
                                        className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full bg-[#075cdb]"
                                        title="Belum dibaca"
                                    />
                                )}
                            </div>
                        ))
                    )}
                </div>

                {/* Footer */}
                <div className="shrink-0 border-t border-[#e9f0fa] bg-[#fafcff] px-6 py-3.5 text-center">
                    <button
                        type="button"
                        onClick={onClose}
                        className="text-xs font-bold text-[#61718d] hover:text-[#061737] transition cursor-pointer"
                    >
                        Tutup Jendela
                    </button>
                </div>
            </div>
        </div>
    );
}
