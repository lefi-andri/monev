<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        return [
            ...parent::share($request),
            'auth' => [
                'user' => fn () => $request->user() ? [
                    'id' => $request->user()->id,
                    'name' => $request->user()->name,
                    'email' => $request->user()->email,
                    'email_verified_at' => $request->user()->email_verified_at,
                    'avatar_url' => $request->user()->avatar_url,
                    'role' => $request->user()->getRoleNames()->first(),
                    'roles' => $request->user()->getRoleNames()->values(),
                    'bidang' => $request->user()->bidang ?? 'UI/UX Designer',
                    'permissions' => $request->user()->getAllPermissions()->pluck('name')->values(),
                ] : null,
            ],
            'flash' => [
                'success' => fn () => $request->session()->get('success'),
                'error' => fn () => $request->session()->get('error'),
            ],
            'notifications' => fn () => $request->user()
                ? $request->user()->appNotifications()->limit(15)->get()->map(fn ($n) => [
                    'id' => $n->id,
                    'title' => $n->title,
                    'message' => $n->message,
                    'type' => $n->type,
                    'data' => $n->data,
                    'is_read' => $n->read_at !== null,
                    'read_at' => $n->read_at?->format('d M Y H:i'),
                    'created_at' => $n->created_at?->diffForHumans(),
                ])
                : [],
            'unreadNotificationsCount' => fn () => $request->user()
                ? $request->user()->appNotifications()->whereNull('read_at')->count()
                : 0,
        ];
    }
}
