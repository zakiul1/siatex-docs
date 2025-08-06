<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // 1) Create your Super‑Admin user
        $admin = User::factory()->create([
            'name' => 'Super Admin',
            'email' => 'admin@gmail.com',
            'password' => Hash::make('12345678'),
            'level' => 'Super Admin',
        ]);

        // 2) Call your other seeders, passing the Super‑Admin's ID
        $this->call([
            BankSeeder::class,           // seeds banks (optionally with user_id)
            CustomerSeeder::class,       // seeds customers (owned by $admin)
            FactoryFactory::class,        // seeds factories (owned by $admin)
            ShipperSeeder::class,        // seeds shippers (owned by $admin)
            // add any others here...
        ]);
    }
}