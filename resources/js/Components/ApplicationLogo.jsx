export default function ApplicationLogo({ className = 'h-12 w-12', showText = false, textClassName = '' }) {
    return (
        <div className="inline-flex items-center gap-3">
            <span
                className={`grid shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-md shadow-blue-500/20 ${className}`}
                style={{ aspectRatio: '1/1' }}
            >
                <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-3/5 w-3/5"
                >
                    <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                    <path d="M6 12v5c3 3 9 3 12 0v-5" />
                </svg>
            </span>
            {showText && (
                <div className={`flex flex-col text-left ${textClassName}`}>
                    <span className="text-xl font-extrabold tracking-tight text-[#061737]">Monev Magang</span>
                    <span className="text-xs font-semibold text-[#61718d]">Kokek Monitoring & Evaluasi</span>
                </div>
            )}
        </div>
    );
}
