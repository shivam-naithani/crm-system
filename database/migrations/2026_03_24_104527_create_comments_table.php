<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
{
    Schema::create('comments', function (Blueprint $table) {
        $table->id();

        $table->foreignId('ticket_id')->constrained()->cascadeOnDelete(); // link to ticket
        $table->foreignId('user_id')->constrained()->cascadeOnDelete();   // who commented

        $table->text('message'); // comment text

        $table->timestamps();
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('comments');
    }
};
