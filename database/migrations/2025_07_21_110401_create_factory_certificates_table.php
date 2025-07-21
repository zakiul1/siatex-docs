<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up()
    {
        Schema::create('factory_certificates', function (Blueprint $table) {
            $table->id();
            $table->foreignId('factory_id')
                ->constrained()
                ->cascadeOnDelete();
            $table->string('name');
            $table->string('file_path');    // where the certificate file is stored
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('factory_certificates');
    }
};