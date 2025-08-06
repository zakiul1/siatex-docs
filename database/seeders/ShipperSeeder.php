<?php

namespace Database\Seeders;

use App\Models\Shipper;
use App\Models\Bank;
use App\Models\User;
use Illuminate\Database\Seeder;

class ShipperSeeder extends Seeder
{
    public function run(): void
    {
        $admin = User::where('email', 'admin@gmail.com')->first();

        if (!$admin) {
            $this->command->error('Super Admin not found; skipping shipper seeding.');
            return;
        }

        // Grab all bank IDs for random assignment
        $bankIds = Bank::pluck('id')->all();

        Shipper::factory()
            ->count(20)
            ->create([
                'user_id' => $admin->id,
            ])
            ->each(function (Shipper $shipper) use ($bankIds) {
                $shipper->update([
                    'bank_ids' => collect($bankIds)
                        ->shuffle()
                        ->take(rand(1, 3))
                        ->values()
                        ->all(),
                ]);
            });
    }
}