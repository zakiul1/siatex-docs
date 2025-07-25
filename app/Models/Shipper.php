<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Shipper extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'name',
        'address',
        'phone',
        'email',
        'bank_ids',   // ← include bank_ids
    ];

    protected $casts = [
        'bank_ids' => 'array', // ← cast JSON to array
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}