<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // create your Super Admin user
        $admin = User::factory()->create([
            'name' => 'Test User',
            'email' => 'admin@gmail.com',
            'password' => Hash::make('12345678'),
            'level' => 'Super Admin',
        ]);

        // call BankSeeder and CustomerSeeder
        $this->call([
            BankSeeder::class,
            CustomerSeeder::class,
        ]);
    }
}