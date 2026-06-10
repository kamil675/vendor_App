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
    Schema::table('audit_logs', function ($table) {

        $table->unsignedBigInteger('vendor_id');
        $table->string('action');
        $table->text('description');

    });
}

    /**
     * Reverse the migrations.
     */
public function down(): void
{
    Schema::table('audit_logs', function ($table) {

        $table->dropColumn([
            'vendor_id',
            'action',
            'description'
        ]);

    });
}
};
