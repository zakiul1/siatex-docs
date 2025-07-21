<?php

namespace Database\Seeders;

use App\Models\Customer;
use App\Models\User;
use Illuminate\Database\Seeder;

class CustomerSeeder extends Seeder
{
    public function run(): void
    {
        // assume your Super Admin has this email
        $admin = User::where('email', 'admin@gmail.com')->first();

        if (!$admin) {
            $this->command->error('Super Admin not found; skipping customer seeding.');
            return;
        }

        // create 20 customers owned by the Super Admin
        Customer::factory()
            ->count(20)
            ->create(['user_id' => $admin->id]);
    }
}