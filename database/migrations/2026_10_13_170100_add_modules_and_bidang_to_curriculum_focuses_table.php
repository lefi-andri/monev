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
        Schema::table('curriculum_focuses', function (Blueprint $table) {
            $table->string('bidang')->nullable()->after('period_id');
            $table->json('modules')->nullable()->after('focus_text');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('curriculum_focuses', function (Blueprint $table) {
            $table->dropColumn(['bidang', 'modules']);
        });
    }
};
