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
    Schema::create('tickets', function (Blueprint $table) {
        $table->id();

        $table->string('title');
        $table->text('description');

        $table->enum('status', ['pending','inprogress','completed','onhold'])
              ->default('pending');

        $table->enum('priority', ['low','medium','high','critical'])
              ->default('low');

        $table->foreignId('created_by')
              ->constrained('users')
              ->cascadeOnDelete();

        $table->foreignId('assigned_to')
              ->nullable()
              ->constrained('users')
              ->nullOnDelete();

        $table->timestamp('assigned_at')->nullable();
        $table->timestamp('due_at')->nullable();

        $table->timestamps();
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tickets');
    }
};
