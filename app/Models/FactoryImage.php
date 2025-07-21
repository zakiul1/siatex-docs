<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FactoryImage extends Model
{
    use HasFactory;

    protected $fillable = ['factory_id', 'file_path', 'alt_text'];

    public function factory()
    {
        return $this->belongsTo(Factory::class);
    }
}