<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Factory;
use App\Models\User;

class FactoryFactory extends Seeder
{
    public function run(): void
    {
        // look up your Super Admin by email
        $admin = User::where('email', 'admin@gmail.com')->first();

        if (!$admin) {
            $this->command->error('Super Admin not found; skipping factory seeding.');
            return;
        }

        // create 10 factories owned by the Super Admin
        Factory::factory()
            ->count(10)
            ->create([
                'user_id' => $admin->id,
            ]);
    }
}