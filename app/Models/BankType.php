<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BankType extends Model
{
    use HasFactory;

    protected $fillable = ['name'];

    public function banks()
    {
        return $this->hasMany(Bank::class);
    }
}