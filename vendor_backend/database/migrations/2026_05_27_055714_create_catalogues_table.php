<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('catalogues', function (Blueprint $table) {

            $table->id();

            $table->unsignedBigInteger('vendor_id');

            $table->string('product_name');

            $table->decimal(
                'price',
                10,
                2
            );

            $table->text(
                'description'
            )->nullable();

            $table->timestamps();

            $table->foreign('vendor_id')
                  ->references('id')
                  ->on('vendors')
                  ->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('catalogues');
    }
};