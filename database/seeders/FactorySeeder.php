<?php
namespace Database\Seeders;

use App\Models\Factory;
use App\Models\User;
use Illuminate\Database\Seeder;

class FactorySeeder extends Seeder
{
    public function run(): void
    {
        $admin = User::where('email','admin@gmail.com')->first();
        if(!\$admin) return;
        Factory::factory()->count(10)->create(['user_id'=>\$admin->id]);
    }
}