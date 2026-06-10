<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('equipment_requests', function (Blueprint $table) {
            $table->id();

            $table->unsignedBigInteger('vendor_id');

            $table->string('equipment_name');
            $table->integer('quantity');
            $table->text('description')->nullable();

            $table->string('status')
                  ->default('Pending');

            $table->timestamps();

            $table->foreign('vendor_id')
                  ->references('id')
                  ->on('vendors')
                  ->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('equipment_requests');
    }
};