<?php

namespace App\Policies;

use App\Models\Ticket;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class TicketPolicy
{
    public function viewAny(User $user): bool
    {
        return true;
    }

    public function view(User $user, Ticket $ticket): bool
    {
        return 
            $user->isAdmin() ||
            $user->isManager() ||
            $user->isViewer() ||
            (int) $ticket->assigned_to === (int) $user->id || 
            (int) $ticket->created_by === (int) $user->id;
    }

    public function create(User $user): bool
    {
        return true;
    }

    public function update(User $user, Ticket $ticket): bool
    {
        return 
            $user->isAdmin() ||
            $user->isManager() ||
            (int) $ticket->assigned_to === (int) $user->id;
    }

    public function delete(User $user, Ticket $ticket): bool
    {
        return 
            $user->isAdmin() ||
            ($user->isUser() && (int) $ticket->created_by === (int) $user->id);
    }

    public function restore(User $user, Ticket $ticket): bool
    {
        return false;
    }

    public function forceDelete(User $user, Ticket $ticket): bool
    {
        return false;
    }

    public function assign(User $user): bool
    {
        return $user->isAdmin() || $user->isManager();
    }

    public function updatePriority(User $user): bool
    {
        return $user->isAdmin() || $user->isManager();
    }
}