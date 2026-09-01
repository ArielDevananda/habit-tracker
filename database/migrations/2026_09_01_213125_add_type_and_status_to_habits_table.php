<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('habits', function (Blueprint $table) {
            $table->string('type', 20)->default('binary')->after('category');
            $table->string('status', 20)->default('active')->after('is_active');
        });

        // Migrate data
        DB::table('habits')->where('is_active', true)->update(['status' => 'active']);
        DB::table('habits')->where('is_active', false)->update(['status' => 'paused']);

        Schema::table('habits', function (Blueprint $table) {
            $table->dropIndex(['user_id', 'is_active']);
            $table->dropColumn('is_active');
            $table->index(['user_id', 'status']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('habits', function (Blueprint $table) {
            $table->boolean('is_active')->default(true)->after('status');
        });

        // Migrate back
        DB::table('habits')->where('status', 'active')->update(['is_active' => true]);
        DB::table('habits')->whereIn('status', ['paused', 'archived'])->update(['is_active' => false]);

        Schema::table('habits', function (Blueprint $table) {
            $table->dropColumn(['type', 'status']);
        });
    }
};
