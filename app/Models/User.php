<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use App\Models\Comment; 

class User extends Authenticatable
{
    use HasFactory, Notifiable;

    const ROLE_ADMIN = 'admin';
    const ROLE_MANAGER = 'manager';
    const ROLE_AGENT = 'agent';
    const ROLE_USER = 'user';
    const ROLE_VIEWER = 'viewer';

    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
    ];

    protected $hidden = [
    'password',
    'remember_token',
];

protected function casts(): array
{
    return [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
    ];
}

    public function isAdmin() {
        return $this->role === self::ROLE_ADMIN;
    }

    public function isManager() {
        return $this->role === self::ROLE_MANAGER;
    }

    public function isAgent() {
        return $this->role === self::ROLE_AGENT;
    }

    public function isUser() {
        return $this->role === self::ROLE_USER;
    }

    public function isViewer() {
        return $this->role === self::ROLE_VIEWER;
    }

    public function isAdminOrManager()
    {
        return in_array($this->role, [
            self::ROLE_ADMIN,
            self::ROLE_MANAGER
        ]);
    }

    // user comments
    public function comments()
     { 
        return $this->hasMany(Comment::class);
     }
}