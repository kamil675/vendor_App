<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('app_notifications', function (Blueprint $table) {

            $table->unsignedBigInteger('vendor_id')->after('id');

            $table->string('title')->after('vendor_id');

            $table->text('message')->after('title');

            $table->boolean('is_read')
                  ->default(false)
                  ->after('message');

        });
    }

    public function down(): void
    {
        Schema::table('app_notifications', function (Blueprint $table) {

            $table->dropColumn([
                'vendor_id',
                'title',
                'message',
                'is_read'
            ]);

        });
    }
};