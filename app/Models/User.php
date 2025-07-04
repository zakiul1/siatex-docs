<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'level', // Added 'level' for user roles
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    /**
     * Check if the user is an Admin or Super Admin.
     */
    public function isAdmin(): bool
    {
        return in_array($this->level, ['Admin', 'Super Admin']);
    }

    /**
     * Check if the user is a Super Admin.
     */
    public function isSAdmin(): bool
    {
        return $this->level === 'Super Admin';
    }

    /**
     * Define relationship with Customer.
     */
    public function customers()
    {
        return $this->hasMany(Customer::class);
    }

    /**
     * Define relationship with Sales.
     */
    public function sales()
    {
        return $this->hasMany(Sale::class);
    }

    /**
     * Define relationship with Payments.
     */
    public function payments()
    {
        return $this->hasMany(Payment::class);
    }
}
