<?php
// database/migrations/2025_07_25_043756_create_shippers_table.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up()
    {
        Schema::create('shippers', function (Blueprint $table) {
            $table->id();

            // link each shipper to a user (nullable in case of legacy data)
            $table->foreignId('user_id')
                ->nullable()
                ->constrained()
                ->cascadeOnDelete();

            $table->string('name');
            $table->text('address');
            $table->string('phone')->nullable();
            $table->string('email')->nullable();
            $table->string('website')->nullable();
            $table->string('mobile')->nullable();

            // keep your array of bank IDs
            $table->json('bank_ids')->nullable();

            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('shippers');
    }
};