<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\TicketActivity; 

class Ticket extends Model
{
    protected $fillable = [
        'title',
        'description',
        'status',
        'priority',
        'created_by',
        'assigned_to',
        'assigned_at',
        'due_at'
    ];

    // ticket creator 
    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    // assigned agent
    public function assignedUser()
    {
        return $this->belongsTo(User::class, 'assigned_to');
    }

    // ticket comments 
    public function comments()
    {
        return $this->hasMany(Comment::class)->oldest();
    }

    // activity timeline 
    public function activities()
    {
        return $this->hasMany(TicketActivity::class)->oldest();
    }

    // cast timestamps 
    protected $casts = [
        'assigned_at' => 'datetime',
        'due_at' => 'datetime',
    ];
}

