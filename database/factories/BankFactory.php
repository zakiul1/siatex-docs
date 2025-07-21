<?php

namespace Database\Factories;

use App\Models\Bank;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class BankFactory extends Factory
{
    protected $model = Bank::class;

    public function definition()
    {
        return [
            // will create a new user for each bank by default
            'user_id' => User::factory(),
            'bank_type' => $this->faker->randomElement(['customer', 'factory']),
            'name' => $this->faker->company . ' Bank',
            'swift_code' => strtoupper($this->faker->bothify('????##??')),
            'address' => $this->faker->address,
            'phone' => $this->faker->phoneNumber,
            'email' => $this->faker->companyEmail,
        ];
    }
}