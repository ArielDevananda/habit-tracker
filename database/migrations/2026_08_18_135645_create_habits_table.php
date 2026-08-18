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
        Schema::create('habits', function (Blueprint $table) {
            $table->id();

            $table->foreignId('user_id')
                ->constrained()
                ->cascadeOnDelete();

            $table->string('name', 100);
            $table->text('description')->nullable();
            $table->string('category', 50)->nullable();

            $table->decimal('target_value', 8, 2)->nullable();
            $table->string('unit', 30)->nullable();

            $table->string('frequency', 20)->default('daily');
            $table->json('days_of_week')->nullable();

            $table->boolean('is_active')->default(true);
            $table->date('start_date');

            $table->timestamps();
            $table->softDeletes();

            $table->index(['user_id', 'is_active']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('habits');
    }
};
