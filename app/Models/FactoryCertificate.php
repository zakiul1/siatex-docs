<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FactoryCertificate extends Model
{
    use HasFactory;

    protected $fillable = ['factory_id', 'name', 'file_path'];

    public function factory()
    {
        return $this->belongsTo(Factory::class);
    }
}