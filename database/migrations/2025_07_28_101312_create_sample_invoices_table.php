<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up()
    {
        Schema::create('sample_invoices', function (Blueprint $table) {
            $table->id();
            $table->string('invoice_no')->unique();
            $table->foreignId('shipper_id')->constrained()->cascadeOnDelete();
            $table->foreignId('customer_id')->constrained()->cascadeOnDelete();
            $table->date('date')->default(now());
            $table->string('buyer_account')->nullable();
            $table->enum('shipment_terms', ['Collect', 'Prepaid'])->default('Collect');
            $table->string('courier_name')->nullable();
            $table->string('tracking_number')->nullable();
            $table->text('footnotes')->nullable();
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('sample_invoices');
    }
};