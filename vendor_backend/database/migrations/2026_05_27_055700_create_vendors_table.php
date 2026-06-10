<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('vendors', function (Blueprint $table) {

            $table->id();

            $table->string('name');

            $table->string('email')->unique();

            $table->string('phone')->unique();

            $table->string('password');

            $table->string('shop_name');

            $table->text('address');

            $table->double('latitude')->nullable();

            $table->double('longitude')->nullable();

            $table->boolean('is_online')->default(false);

            $table->float('rating')->default(0);

            $table->rememberToken();

            $table->timestamps();

        });
    }

    public function down(): void
    {
        Schema::dropIfExists('vendors');
    }
};