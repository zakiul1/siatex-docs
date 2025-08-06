<?php

namespace Database\Factories;

use App\Models\Shipper;
use App\Models\Bank;
use Illuminate\Database\Eloquent\Factories\Factory;

class ShipperFactory extends Factory
{
    protected $model = Shipper::class;

    public function definition()
    {
        // pick a random subset of existing Banks
        $bankIds = Bank::query()
            ->inRandomOrder()
            ->limit($this->faker->numberBetween(1, 3))
            ->pluck('id')
            ->toArray();

        return [
            'name' => $this->faker->company,
            'address' => $this->faker->streetAddress . "\n" . $this->faker->city . ', ' . $this->faker->state,
            'phone' => $this->faker->phoneNumber,
            'email' => $this->faker->optional()->companyEmail,
            'website' => $this->faker->optional()->url,
            'mobile' => $this->faker->optional()->e164PhoneNumber,
            'bank_ids' => $bankIds,
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }
}