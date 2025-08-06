<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateSalesInvoiceItemsTable extends Migration
{
    public function up()
    {
        Schema::create('sales_invoice_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('sales_invoice_id')->constrained()->cascadeOnDelete();
            $table->string('art_num')->nullable();
            $table->text('description')->nullable();
            $table->string('size')->nullable();
            $table->integer('qty')->default(0);
            $table->decimal('unit_price', 14, 2)->default(0);
            $table->decimal('commercial_cost', 15, 2)->default(0); // Merged field
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('sales_invoice_items');
    }
}