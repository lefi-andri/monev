import InputError from '@/Components/InputError';
import { router, useForm, usePage } from '@inertiajs/react';
import { Camera, Check, Trash2, Upload } from 'lucide-react';
import { useRef, useState } from 'react';

export default function UpdateAvatarForm({ className = '' }) {
    const user = usePage().props.auth.user;
    const input = useRef();
    const [preview, setPreview] = useState(user.avatar_url);
    const { data, setData, post, processing, errors, reset, recentlySuccessful } = useForm({ avatar: null });

    const chooseAvatar = (event) => {
        const file = event.target.files?.[0] ?? null;
        setData('avatar', file);
        setPreview(file ? URL.createObjectURL(file) : user.avatar_url);
    };

    const submit = (event) => {
        event.preventDefault();
        post(route('profile.avatar.update'), {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => reset('avatar'),
        });
    };

    const remove = () => {
        if (window.confirm('Apakah Anda yakin ingin menghapus foto avatar?')) {
            router.delete(route('profile.avatar.destroy'), {
                preserveScroll: true,
                onSuccess: () => setPreview(null),
            });
        }
    };

    const initials = user.name.split(' ').map((part) => part[0]).slice(0, 2).join('');

    return (
        <section className={`detail-card p-7 sm:p-8 ${className}`}>
            <header className="flex items-center gap-4">
                <span className="icon-tile blue">
                    <Camera />
                </span>
                <div>
                    <h2 className="text-xl font-bold text-[#061737]">Foto Avatar</h2>
                    <p className="mt-0.5 text-sm text-[#61718d]">
                        Unggah foto profil dalam format JPG, PNG, atau WebP (maksimal 2 MB).
                    </p>
                </div>
            </header>

            <form onSubmit={submit} className="mt-6 space-y-5">
                <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                    <div className="relative">
                        {preview ? (
                            <img
                                src={preview}
                                alt={user.name}
                                className="h-24 w-24 rounded-full object-cover ring-4 ring-[#edf4ff]"
                            />
                        ) : (
                            <div className="grid h-24 w-24 place-items-center rounded-full bg-[#1260d9] text-2xl font-extrabold text-white shadow-md">
                                {initials}
                            </div>
                        )}
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        <input
                            ref={input}
                            type="file"
                            accept="image/jpeg,image/png,image/webp"
                            className="hidden"
                            onChange={chooseAvatar}
                        />
                        <button
                            type="button"
                            onClick={() => input.current?.click()}
                            className="monev-btn monev-btn-secondary"
                        >
                            <Upload size={18} />
                            Pilih Avatar Baru
                        </button>
                        {preview && (
                            <button
                                type="button"
                                onClick={remove}
                                className="monev-btn monev-btn-danger"
                            >
                                <Trash2 size={18} />
                                Hapus
                            </button>
                        )}
                    </div>
                </div>

                <InputError message={errors.avatar} />

                {data.avatar && (
                    <div className="flex items-center gap-3 pt-2">
                        <button
                            type="submit"
                            disabled={processing}
                            className="monev-btn monev-btn-primary"
                        >
                            {processing ? 'Menyimpan...' : 'Simpan Foto Avatar'}
                        </button>
                    </div>
                )}

                {recentlySuccessful && (
                    <div className="inline-flex items-center gap-2 rounded-xl bg-[#e9f9ef] px-3.5 py-2 text-sm font-bold text-[#0b8a46]">
                        <Check size={16} /> Foto avatar berhasil diperbarui.
                    </div>
                )}
            </form>
        </section>
    );
}
