<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Batch;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class BatchController extends Controller
{
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:1000'],
            'start_date' => ['required', 'date'],
            'end_date' => ['required', 'date', 'after_or_equal:start_date'],
            'status' => ['required', Rule::in(['upcoming', 'active', 'completed', 'archived'])],
            'is_active' => ['boolean'],
            'participant_ids' => ['nullable', 'array'],
            'participant_ids.*' => ['exists:users,id'],
        ]);

        $isActive = $request->boolean('is_active');

        if ($isActive) {
            Batch::query()->update(['is_active' => false]);
        }

        $batch = Batch::create([
            'name' => $validated['name'],
            'description' => $validated['description'] ?? null,
            'start_date' => $validated['start_date'],
            'end_date' => $validated['end_date'],
            'status' => $validated['status'],
            'is_active' => $isActive,
        ]);

        if (!empty($validated['participant_ids'])) {
            User::whereIn('id', $validated['participant_ids'])->update(['batch_id' => $batch->id]);
        }

        activity('batch_management')
            ->causedBy($request->user())
            ->performedOn($batch)
            ->event('batch_created')
            ->withProperties(['name' => $batch->name, 'status' => $batch->status])
            ->log("Admin membuat batch magang '{$batch->name}'");

        return back()->with('success', "Batch '{$batch->name}' berhasil dibuat.");
    }

    public function update(Request $request, Batch $batch): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:1000'],
            'start_date' => ['required', 'date'],
            'end_date' => ['required', 'date', 'after_or_equal:start_date'],
            'status' => ['required', Rule::in(['upcoming', 'active', 'completed', 'archived'])],
            'is_active' => ['boolean'],
            'participant_ids' => ['nullable', 'array'],
            'participant_ids.*' => ['exists:users,id'],
        ]);

        $isActive = $request->boolean('is_active');

        if ($isActive && !$batch->is_active) {
            Batch::where('id', '!=', $batch->id)->update(['is_active' => false]);
        }

        $batch->update([
            'name' => $validated['name'],
            'description' => $validated['description'] ?? null,
            'start_date' => $validated['start_date'],
            'end_date' => $validated['end_date'],
            'status' => $validated['status'],
            'is_active' => $isActive,
        ]);

        if ($request->has('participant_ids')) {
            $participantIds = $validated['participant_ids'] ?? [];
            User::where('batch_id', $batch->id)
                ->whereNotIn('id', $participantIds)
                ->update(['batch_id' => null]);

            if (!empty($participantIds)) {
                User::whereIn('id', $participantIds)->update(['batch_id' => $batch->id]);
            }
        }

        activity('batch_management')
            ->causedBy($request->user())
            ->performedOn($batch)
            ->event('batch_updated')
            ->withProperties(['name' => $batch->name, 'status' => $batch->status])
            ->log("Admin memperbarui data batch '{$batch->name}'");

        return back()->with('success', "Data batch '{$batch->name}' berhasil diperbarui.");
    }

    public function destroy(Request $request, Batch $batch): RedirectResponse
    {
        $name = $batch->name;
        User::where('batch_id', $batch->id)->update(['batch_id' => null]);

        $batch->delete();

        activity('batch_management')
            ->causedBy($request->user())
            ->event('batch_deleted')
            ->withProperties(['name' => $name])
            ->log("Admin menghapus batch '{$name}'");

        return back()->with('success', "Batch '{$name}' berhasil dihapus.");
    }

    public function setActive(Request $request, Batch $batch): RedirectResponse
    {
        Batch::where('id', '!=', $batch->id)->update(['is_active' => false]);

        $batch->update([
            'is_active' => true,
            'status' => 'active',
        ]);

        activity('batch_management')
            ->causedBy($request->user())
            ->performedOn($batch)
            ->event('batch_activated')
            ->withProperties(['name' => $batch->name])
            ->log("Admin mengaktifkan batch '{$batch->name}' sebagai batch utama");

        return back()->with('success', "'{$batch->name}' sekarang ditetapkan sebagai Batch Aktif.");
    }

    public function assignParticipants(Request $request, Batch $batch): RedirectResponse
    {
        $validated = $request->validate([
            'participant_ids' => ['nullable', 'array'],
            'participant_ids.*' => ['exists:users,id'],
        ]);

        $participantIds = $validated['participant_ids'] ?? [];

        User::where('batch_id', $batch->id)
            ->whereNotIn('id', $participantIds)
            ->update(['batch_id' => null]);

        if (!empty($participantIds)) {
            User::whereIn('id', $participantIds)->update(['batch_id' => $batch->id]);
        }

        activity('batch_management')
            ->causedBy($request->user())
            ->performedOn($batch)
            ->event('batch_assigned')
            ->withProperties(['participant_count' => count($participantIds)])
            ->log("Admin memperbarui daftar peserta untuk batch '{$batch->name}'");

        return back()->with('success', "Peserta untuk batch '{$batch->name}' berhasil diperbarui.");
    }
}
