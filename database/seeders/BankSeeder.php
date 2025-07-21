<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Bank;

class BankSeeder extends Seeder
{
    public function run()
    {
        // create 20 banks (and 20 users, by default)
        Bank::factory()
            ->count(20)
            ->create();
    }
}