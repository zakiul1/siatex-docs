<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up()
    {
        Schema::create('factory_images', function (Blueprint $table) {
            $table->id();
            $table->foreignId('factory_id')
                ->constrained()
                ->cascadeOnDelete();
            $table->string('file_path');    // where the image is stored
            $table->string('alt_text')->nullable();
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('factory_images');
    }
};