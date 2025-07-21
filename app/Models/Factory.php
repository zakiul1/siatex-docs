<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Factory extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'name',
        'address',
        'contact',
        'category_id',
        'profile_path',
        'compliance',
        'production_capacity',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function category()
    {
        return $this->belongsTo(FactoryCategory::class);
    }

    public function profile()
    {
        return $this->hasOne(FactoryProfile::class);
    }

    public function certificates()
    {
        return $this->hasMany(FactoryCertificate::class);
    }

    public function images()
    {
        return $this->hasMany(FactoryImage::class);
    }
}