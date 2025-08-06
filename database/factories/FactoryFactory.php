<?php

namespace Database\Factories;

use App\Models\Factory as FactoryModel;
use Illuminate\Database\Eloquent\Factories\Factory;

class FactoryFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = FactoryModel::class;

    public function definition()
    {
        return [
            'name' => $this->faker->company . ' Factory',
            'address' => $this->faker->streetAddress . "\n" . $this->faker->city . ', ' . $this->faker->state,
            // created_at / updated_at will be handled automatically by Laravel if you leave them off
        ];
    }
}