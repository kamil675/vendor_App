<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('dispatch_histories', function (Blueprint $table) {

            $table->id();

            $table->foreignId('equipment_request_id');

            $table->foreignId('vendor_id');

            $table->string('action');

            $table->timestamps();

        });
    }

    public function down(): void
    {
        Schema::dropIfExists('dispatch_histories');
    }
};