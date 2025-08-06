<?php

namespace Database\Factories;

use App\Models\Bank;
use Illuminate\Database\Eloquent\Factories\Factory;

class BankFactory extends Factory
{
    protected $model = Bank::class;

    public function definition()
    {
        return [
            'name' => $this->faker->company . ' Bank',
            'address' => $this->faker->streetAddress . "\n" . $this->faker->city . ', ' . $this->faker->state,
            'swift_code' => strtoupper($this->faker->bothify('??##??')),
            'phone' => $this->faker->phoneNumber,
            'email' => $this->faker->companyEmail,
            'bank_type' => $this->faker->randomElement(['shipper', 'other']),
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }
}