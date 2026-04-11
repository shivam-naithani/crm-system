<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class RoleController extends Controller
{
    /**
     * Display roles page
     */
    public function index()
    {
        $users = User::select('id', 'name', 'email', 'role')
            ->orderBy('role')
            ->orderBy('name')
            ->get()
            ->groupBy('role');

        return Inertia::render('Admin/Roles/Index', [
            'usersByRole' => $users,
            'roles' => [
                User::ROLE_ADMIN,
                User::ROLE_MANAGER,
                User::ROLE_AGENT,
                User::ROLE_USER,
                User::ROLE_VIEWER,
            ],
        ]);
    }

    /**
     * Update user role
     */
    public function update(Request $request, User $user)
    {
        $request->validate([
            'role' => 'required|in:admin,manager,agent,user,viewer',
        ]);

        $user->update([
            'role' => $request->role,
        ]);

        return back();
    }
}