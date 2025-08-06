<?php

namespace Database\Factories;

use App\Models\Customer;
use Illuminate\Database\Eloquent\Factories\Factory;

class CustomerFactory extends Factory
{
    protected $model = Customer::class;

    public function definition()
    {
        return [
            'name' => $this->faker->company,
            'address' => $this->faker->streetAddress . "\n" . $this->faker->city . ', ' . $this->faker->state,
            'mobile' => $this->faker->e164PhoneNumber,
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }
}