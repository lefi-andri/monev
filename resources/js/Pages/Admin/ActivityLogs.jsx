import ServerTime from '@/Components/ServerTime';
import { Head, Link, router } from '@inertiajs/react';
import { Activity, ArrowLeft, LogOut } from 'lucide-react';

export default function ActivityLogs({ activities }) {
    return (
        <>
            <Head title="Audit Trail - Monev Magang" />
            <div className="monev-shell">
                <div className="app-canvas">
                    <main className="page detail-page">
                        {/* Header */}
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
                                    <h1>Audit Trail</h1>
                                    <p className="subtitle !mb-0 !mt-1">
                                        Catatan riwayat aktivitas pengguna dan perubahan data sistem.
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

                        <section className="detail-card overflow-hidden p-6 sm:p-8">
                            <div className="mb-6 flex items-center gap-4">
                                <span className="icon-tile blue">
                                    <Activity />
                                </span>
                                <div>
                                    <h2 className="text-xl font-bold text-[#061737]">
                                        Log Aktivitas Sistem
                                    </h2>
                                    <p className="text-sm text-[#61718d]">
                                        Daftar transaksi dan aksi yang tercatat oleh sistem.
                                    </p>
                                </div>
                            </div>

                            <div className="overflow-x-auto rounded-2xl border border-[#e2ebf6]">
                                <table className="w-full text-left">
                                    <thead className="bg-[#f7faff] text-sm font-bold text-[#566883]">
                                        <tr>
                                            <th className="p-4">Waktu</th>
                                            <th className="p-4">Pelaku</th>
                                            <th className="p-4">Aktivitas</th>
                                            <th className="p-4">Event</th>
                                            <th className="p-4">Subjek</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-[#e8f0fa] text-sm">
                                        {activities.data.map((item) => (
                                            <tr key={item.id} className="transition hover:bg-[#fafcff]">
                                                <td className="whitespace-nowrap p-4 font-medium text-[#647590]">
                                                    {item.created_at}
                                                </td>
                                                <td className="p-4 font-bold text-[#071a3c]">
                                                    {item.causer}
                                                </td>
                                                <td className="p-4 text-[#1e3155]">
                                                    {item.description}
                                                </td>
                                                <td className="p-4">
                                                    <span className="inline-flex rounded-full bg-[#edf4ff] px-3 py-1 text-xs font-bold text-[#075cdb]">
                                                        {item.event ?? '-'}
                                                    </span>
                                                </td>
                                                <td className="p-4 font-medium text-[#647590]">
                                                    {item.subject ?? '-'}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination */}
                            <div className="mt-6 flex flex-wrap gap-2 border-t border-[#e8f0fa] pt-4">
                                {activities.links.map((link, i) => (
                                    <Link
                                        key={i}
                                        href={link.url ?? '#'}
                                        preserveScroll
                                        className={`rounded-xl px-4 py-2 text-sm font-bold transition ${
                                            link.active
                                                ? 'bg-[#075cdb] text-white shadow-xs'
                                                : 'bg-[#f1f5fa] text-[#425570] hover:bg-[#e4ecf7]'
                                        } ${!link.url ? 'pointer-events-none opacity-40' : ''}`}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                ))}
                            </div>
                        </section>

                        <div className="footer-spacer" />
                        <ServerTime />
                    </main>
                </div>
            </div>
        </>
    );
}
