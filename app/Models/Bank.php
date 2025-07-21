<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Bank extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'bank_type',
        'name',
        'swift_code',
        'address',
        'phone',
        'email',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}