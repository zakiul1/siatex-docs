<?php

namespace Database\Factories;

use App\Models\BankType;
use Illuminate\Database\Eloquent\Factories\Factory;

class BankTypeFactory extends Factory
{
    protected $model = BankType::class;

    public function definition()
    {
        return [
            'key' => $this->faker->unique()->word,
            'label' => ucfirst($this->faker->word),
            'description' => $this->faker->sentence,
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }
}