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
            // these match your validation rules: name, mobile, address
            'name' => $this->faker->name(),
            'mobile' => $this->faker->unique()->phoneNumber(),
            'address' => $this->faker->address(),
        ];
    }
}