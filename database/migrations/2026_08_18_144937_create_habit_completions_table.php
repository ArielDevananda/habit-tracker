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
        Schema::create('habit_completions', function (Blueprint $table) {
            $table->id();

            $table->foreignId('habit_id')
                ->constrained()
                ->cascadeOnDelete();

            $table->date('completed_on');
            $table->decimal('value', 8, 2)->nullable();
            $table->text('note')->nullable();

            $table->timestamps();

            $table->unique(['habit_id', 'completed_on']);
            $table->index('completed_on');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('habit_completions');
    }
};
