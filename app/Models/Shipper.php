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
        'mobile',    // ← new
        'email',
        'website',   // ← new
        'bank_ids',
    ];

    protected $casts = [
        'bank_ids' => 'array',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}