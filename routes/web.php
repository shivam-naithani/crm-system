<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\TicketController;
use App\Http\Controllers\CommentController; 
use App\Http\Controllers\DashboardController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

// Dashboard 
Route::get('/dashboard', [DashboardController::class, 'index'])
    ->middleware(['auth', 'verified'])
    ->name('dashboard');

// Protected routes
Route::middleware(['auth'])->group(function () {

    // Ticket routes
    Route::resource('tickets', TicketController::class);

    // comment route 
    Route::post('/tickets/{ticket}/comments', [CommentController::class, 'store']);

    // Profile 
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Admin only
Route::middleware(['auth', 'role:admin'])->group(function () {

    Route::get('/admin', function () {
        return 'Admin Panel';
    });

    // Roles management page
    Route::get('/admin/roles', [\App\Http\Controllers\RoleController::class, 'index'])
        ->name('roles.index');

    // Update user role
    Route::patch('/admin/users/{user}/role', [\App\Http\Controllers\RoleController::class, 'update'])
        ->name('roles.update');
    });

    // Manager + Admin
    Route::middleware(['role:manager,admin'])->group(function () {
        Route::get('/manage-tickets', function () {
            return 'Manage Tickets';
        });
    });

    // Agent only
    Route::middleware(['role:agent,admin'])->group(function () {
        Route::get('/agent', function () {
            return 'Agent Panel';
        });
    });

});

require __DIR__.'/auth.php';