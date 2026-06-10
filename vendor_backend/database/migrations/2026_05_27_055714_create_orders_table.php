<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table) {

            $table->id();

            $table->foreignId('vendor_id')
                  ->constrained('vendors')
                  ->onDelete('cascade');

            $table->foreignId('catalogue_id')
                  ->constrained('catalogues')
                  ->onDelete('cascade');

            $table->integer('quantity');

            $table->decimal(
                'total_price',
                10,
                2
            );

            $table->string('status')
                  ->default('Pending');

            $table->timestamps();

        });
    }

    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};