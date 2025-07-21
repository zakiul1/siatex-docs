<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up()
    {
        Schema::create('factories', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')
                ->constrained()
                ->cascadeOnDelete();
            $table->string('name');
            $table->string('address');
            $table->string('contact')->nullable();
            $table->foreignId('category_id')
                ->nullable()
                ->constrained('factory_categories')
                ->cascadeOnDelete();
            $table->text('profile')->nullable();
            $table->string('compliance')->nullable();
            $table->integer('production_capacity')->nullable();
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('factories');
    }
};