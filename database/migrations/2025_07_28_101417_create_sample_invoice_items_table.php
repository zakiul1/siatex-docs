<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up()
    {
        Schema::create('sample_invoice_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('sample_invoice_id')
                ->constrained('sample_invoices')
                ->cascadeOnDelete();
            $table->string('art_num')->nullable();
            $table->string('description')->nullable();
            $table->string('size')->nullable();
            $table->string('hs_code')->nullable();
            $table->integer('qty')->default(0);
            $table->decimal('unit_price', 12, 2)->default(0);
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('sample_invoice_items');
    }
};