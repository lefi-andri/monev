<?php

use App\Http\Controllers\Admin\ActivityLogController;
use App\Http\Controllers\Admin\BatchController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\AvatarController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return auth()->check()
        ? redirect()->route('dashboard')
        : Inertia::render('Auth/Login', [
            'canResetPassword' => Route::has('password.request'),
            'status' => session('status'),
        ]);
});

Route::get('/dashboard', DashboardController::class)
    ->middleware('auth')
    ->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    Route::post('/profile/avatar', [AvatarController::class, 'update'])->name('profile.avatar.update');
    Route::delete('/profile/avatar', [AvatarController::class, 'destroy'])->name('profile.avatar.destroy');

    Route::post('/attendances', [\App\Http\Controllers\AttendanceController::class, 'store'])->name('attendances.store');
    Route::post('/attendances/{attendance}/verify', [\App\Http\Controllers\AttendanceController::class, 'verify'])->name('attendances.verify');

    Route::post('/announcements', [\App\Http\Controllers\AnnouncementController::class, 'store'])->name('announcements.store');
    Route::delete('/announcements/{announcement}', [\App\Http\Controllers\AnnouncementController::class, 'destroy'])->name('announcements.destroy');

    Route::post('/notifications/{notification}/read', [\App\Http\Controllers\NotificationController::class, 'markAsRead'])->name('notifications.read');
    Route::post('/notifications/read-all', [\App\Http\Controllers\NotificationController::class, 'markAllAsRead'])->name('notifications.read-all');

    Route::post('/evaluations', [\App\Http\Controllers\EvaluationController::class, 'store'])->name('evaluations.store');
    Route::post('/curriculum-focus', [\App\Http\Controllers\CurriculumController::class, 'saveFocus'])->name('curriculum.focus');
});

Route::prefix('admin')->name('admin.')->middleware(['auth', 'role:admin'])->group(function () {
    Route::middleware('permission:manage users')->group(function () {
        Route::post('/users', [UserController::class, 'store'])->name('users.store');
        Route::patch('/users/{user}', [UserController::class, 'update'])->name('users.update');
        Route::delete('/users/{user}', [UserController::class, 'destroy'])->name('users.destroy');
        Route::post('/mentors/assign', [UserController::class, 'assignParticipants'])->name('mentors.assign');

        Route::post('/batches', [BatchController::class, 'store'])->name('batches.store');
        Route::patch('/batches/{batch}', [BatchController::class, 'update'])->name('batches.update');
        Route::delete('/batches/{batch}', [BatchController::class, 'destroy'])->name('batches.destroy');
        Route::post('/batches/{batch}/set-active', [BatchController::class, 'setActive'])->name('batches.set-active');
        Route::post('/batches/{batch}/assign', [BatchController::class, 'assignParticipants'])->name('batches.assign');
    });
    Route::get('/activity-logs', ActivityLogController::class)
        ->middleware('permission:view audit trail')
        ->name('activity-logs.index');
});

require __DIR__.'/auth.php';
