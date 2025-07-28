<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration {
    public function up()
    {
        Schema::table('sample_invoices', function (Blueprint $table) {
            // change 'date' to default to CURRENT_DATE
            $table->date('date')
                ->default(DB::raw('CURRENT_DATE'))
                ->change();
        });
    }

    public function down()
    {
        Schema::table('sample_invoices', function (Blueprint $table) {
            // remove the default so you can set it explicitly
            $table->date('date')
                ->default(null)
                ->change();
        });
    }
};