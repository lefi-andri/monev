<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('attendances', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('mentor_id')->nullable()->constrained('users')->nullOnDelete();
            $table->date('date');
            $table->string('time', 30)->nullable();
            $table->enum('status', ['pending', 'approved', 'needs_revision', 'rejected'])->default('pending');
            $table->string('type', 30)->default('Hadir'); // Hadir, Izin, Sakit, etc.
            $table->text('activity');
            $table->text('learning');
            $table->text('obstacles')->nullable();
            $table->text('mentor_note')->nullable();
            $table->timestamp('verified_at')->nullable();
            $table->timestamps();

            $table->unique(['user_id', 'date']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('attendances');
    }
};
