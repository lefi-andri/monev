import { Clock3 } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function ServerTime({ className = '' }) {
    const [now, setNow] = useState(new Date());

    useEffect(() => {
        const interval = setInterval(() => setNow(new Date()), 1000);
        return () => clearInterval(interval);
    }, []);

    const time = new Intl.DateTimeFormat('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
        timeZone: 'Asia/Jakarta',
    }).format(now);

    return (
        <div className={`server-time ${className}`} aria-label="Waktu server">
            <Clock3 size={22} />
            <b>Waktu Server&nbsp; {time} WIB (GMT+7)</b>
        </div>
    );
}
