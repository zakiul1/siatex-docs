<?php
namespace Database\Factories;

use App\Models\Factory;
use Illuminate\Database\Eloquent\Factories\Factory;

class FactoryFactory extends Factory
{
    protected $model = Factory::class;

    public function definition()
    {
        return [
            'name' => $this->faker->company,
            'address' => $this->faker->address,
            'contact' => $this->faker->phoneNumber,
            'category' => $this->faker->randomElement(['knit', 'woven', 'processing']),
            'profile' => $this->faker->paragraph,
            'compliance' => $this->faker->companySuffix,
            'production_capacity' => $this->faker->numberBetween(100, 10000),
        ];
    }
}