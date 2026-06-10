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
        Schema::table('catalogues', function (Blueprint $table) {

            $table->string('category')->nullable();

            $table->integer('stock_qty')
                  ->default(0);

            $table->integer('min_order_qty')
                  ->default(1);

            $table->enum(
                'delivery_option',
                [
                    'SELF_PICKUP',
                    'LOCAL_DELIVERY',
                    'BOTH'
                ]
            )->default('BOTH');

            $table->enum(
                'status',
                [
                    'PENDING_REVIEW',
                    'ACTIVE',
                    'INACTIVE',
                    'OUT_OF_STOCK'
                ]
            )->default('ACTIVE');

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('catalogues', function (Blueprint $table) {

            $table->dropColumn([
                'category',
                'stock_qty',
                'min_order_qty',
                'delivery_option',
                'status'
            ]);

        });
    }
};