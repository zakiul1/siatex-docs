// database/migrations/2025_07_25_000000_create_invoices_table.php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up()
    {
        Schema::create('invoices', function (Blueprint $table) {
            $table->id();
            $table->string('invoice_number')->unique();
            $table->enum('type', ['sample', 'sales'])->default('sample');
            $table->foreignId('shipper_id')->constrained()->cascadeOnDelete();
            $table->foreignId('customer_id')->constrained()->cascadeOnDelete();

            // common fields
            $table->string('buyer_account')->nullable();
            $table->string('shipment_terms')->nullable();
            $table->string('courier_name')->nullable();
            $table->string('tracking_number')->nullable();
            $table->text('notes')->nullable();

            // sales‑only
            $table->date('issue_date')->nullable();
            $table->date('delivery_date')->nullable();
            $table->string('payment_mode')->nullable();
            $table->string('terms_of_shipment')->nullable();
            $table->string('currency')->nullable();
            $table->decimal('commercial_cost', 15, 2)->nullable();
            $table->decimal('discount', 15, 2)->nullable();
            $table->enum('fob_or_cif', ['fob', 'cif'])->nullable();

            $table->decimal('total_amount', 15, 2)->default(0);
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('invoices');
    }
};