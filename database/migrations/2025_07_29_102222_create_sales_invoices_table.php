<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateSalesInvoicesTable extends Migration
{
    public function up()
    {
        Schema::create('sales_invoices', function (Blueprint $table) {
            $table->id();
            $table->string('invoice_no')->unique();
            $table->enum('type', ['LC', 'TT'])->default('LC');
            $table->foreignId('shipper_id')->constrained()->cascadeOnDelete();
            $table->foreignId('customer_id')->constrained()->cascadeOnDelete();
            $table->date('issue_date');
            $table->date('delivery_date')->nullable();
            $table->string('payment_mode')->nullable();
            $table->string('terms_of_shipment')->nullable();
            $table->string('currency', 3)->default('USD');
            $table->decimal('siatex_discount', 14, 2)->default(0);
            $table->text('footnotes')->nullable();
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('sales_invoices');
    }
}