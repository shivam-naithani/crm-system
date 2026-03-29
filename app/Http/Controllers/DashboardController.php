<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use App\Models\Ticket;

class DashboardController extends Controller
{
    public function index()
    {
        $user = Auth::user();

        // Admin, Manager, Viewer → global dashboard
        if ($user->isAdminOrManager() || $user->isViewer()) {
            return $this->adminDashboard($user);
        }

        // Agent → only assigned tickets
        if ($user->isAgent()) {
            return $this->agentDashboard($user);
        }

        // Default → User (customer)
        return $this->userDashboard($user);
    }

     /* Admin / Manager / Viewer Dashboard */
     
    private function adminDashboard($user)
    {
        return Inertia::render('Dashboard', [
            'role' => $user->role,
            'stats' => [
                'total' => Ticket::count(),

                'pending' => Ticket::where('status', 'pending')->count(),

                'inprogress' => Ticket::where('status', 'inprogress')->count(),

                'completed' => Ticket::where('status', 'completed')->count(),

                'onhold' => Ticket::where('status', 'onhold')->count(),

                'overdue' => Ticket::where('status', '!=', 'completed')
                    ->whereNotNull('due_at')
                    ->where('due_at', '<', now())
                    ->count(),
            ]
        ]);
    }

     /* Agent Dashboard (assigned tickets only) */
     
    private function agentDashboard($user)
    {
        $query = Ticket::where('assigned_to', $user->id);

        return Inertia::render('Dashboard', [
            'role' => $user->role,
            'stats' => [
                'assigned' => $query->count(),

                'pending' => (clone $query)
                    ->where('status', 'pending')->count(),

                'inprogress' => (clone $query)
                    ->where('status', 'inprogress')->count(),

                'completed' => (clone $query)
                    ->where('status', 'completed')->count(),

                'onhold' => (clone $query)
                    ->where('status', 'onhold')->count(),

                'overdue' => (clone $query)
                    ->where('status', '!=', 'completed')
                    ->whereNotNull('due_at')
                    ->where('due_at', '<', now())
                    ->count(),
            ]
        ]);
    }

     /* User (Customer) Dashboard */
     
    private function userDashboard($user)
    {
        $query = Ticket::where('created_by', $user->id);

        return Inertia::render('Dashboard', [
            'role' => $user->role,
            'stats' => [
                'total' => $query->count(),

                'open' => (clone $query)
                    ->whereIn('status', ['pending', 'inprogress'])
                    ->count(),

                'completed' => (clone $query)
                    ->where('status', 'completed')->count(),

                'onhold' => (clone $query)
                    ->where('status', 'onhold')->count(),

                'overdue' => (clone $query)
                    ->where('status', '!=', 'completed')
                    ->whereNotNull('due_at')
                    ->where('due_at', '<', now())
                    ->count(),
            ]
        ]);
    }
}