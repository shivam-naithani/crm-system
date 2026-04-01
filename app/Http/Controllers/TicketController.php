<?php

namespace App\Http\Controllers;

use App\Models\Ticket;
use App\Models\User;
use App\Models\TicketActivity; 
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests; 

class TicketController extends Controller
{
    use AuthorizesRequests;

    public function index()
    {
        $this->authorize('viewAny', Ticket::class);
        $user = auth()->user();
        $request = request();

        //  include 'overdue' in filters
        $filters = collect($request->only(['search', 'status', 'priority', 'assigned_to', 'overdue']))
            ->filter(fn ($value) => $value !== null && $value !== '')
            ->toArray();

        $query = Ticket::with(
            'assignedUser',
            'creator',
            'comments.user',
            'activities.user'
        );

        // role-based filtering
        if ($user->isAgent()) {
            $query->where('assigned_to', $user->id);
        } elseif (!$user->isAdmin() && !$user->isManager()) {
            $query->where('created_by', $user->id);
        }

        // filters
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        if ($request->has('priority')) {
            $query->where('priority', $request->priority);
        }

        if ($request->has('assigned_to')) {
            $query->where('assigned_to', $request->assigned_to);
        }

        // overdue filter logic
        if ($request->has('overdue')) {
            $query->whereNotNull('due_at') // avoid null issues
                  ->where('due_at', '<', now())
                  ->whereNotIn('status', ['completed']);
        }

        // search 
        if ($request->filled('search') && trim($request->search) !== '') {
            $search = trim($request->search);

            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
            });
        }

        // pagination
        $tickets = $query->latest()
            ->paginate(10)
            ->withQueryString();

        $users = User::where('role', 'agent')
            ->select('id', 'name')
            ->orderBy('name')
            ->get();

        return Inertia::render('Tickets/Index', [
            'tickets' => $tickets,
            'users' => $users,
            'filters' => $filters 
        ]);
    }

    public function show(Ticket $ticket)
    {
        $this->authorize('view', $ticket);

        $ticket->load([
            'creator',
            'assignedUser',
            'comments.user',   
            'activities.user'   
        ]);

        return Inertia::render('Tickets/Show', [
            'ticket' => $ticket
        ]);
    }

    public function store(Request $request)
    {
        $this->authorize('create', Ticket::class);

        $request->validate([
            'title' => 'required',
            'description' => 'required'
        ]);

        $priority = 'low';

        $dueAt = match ($priority) {
            'low' => now()->addDays(3),
            'medium' => now()->addDays(2),
            'high' => now()->addDay(),
            'critical' => now()->addHours(4),
            default => now()->addDays(3),
        };

        $ticket = Ticket::create([
            'title' => $request->title,
            'description' => $request->description,
            'created_by' => auth()->id(),
            'status' => 'pending',
            'priority' => $priority,
            'due_at' => $dueAt 
        ]);

        TicketActivity::create([
            'ticket_id' => $ticket->id,
            'user_id' => auth()->id(),
            'action' => 'created',
        ]);

        return back();
    }

    public function update(Request $request, Ticket $ticket)
    {
        $this->authorize('update', $ticket);
        $ticket->refresh();

        $request->validate([
            'assigned_to' => 'nullable|exists:users,id',
            'status' => 'in:pending,inprogress,completed,onhold',
            'priority' => 'in:low,medium,high,critical' 
        ]);

        $changes = []; 

        if ($request->filled('assigned_to') && (int)$request->assigned_to !== (int)$ticket->assigned_to) {
            $this->authorize('assign', $ticket);

            $changes['assigned_to'] = [
                'old' => $ticket->assigned_to,
                'new' => $request->assigned_to
            ];

            $ticket->assigned_to = (int) $request->assigned_to;
            $ticket->assigned_at = now();
        }

        if ($request->exists('status')) {
            if ($ticket->status !== $request->status) {
                $changes['status'] = [
                    'old' => $ticket->status,
                    'new' => $request->status
                ];
            }

            $ticket->status = $request->status;
        }

        if ($request->exists('priority')) {
            $this->authorize('updatePriority', $ticket);

            if ($ticket->priority !== $request->priority) {
                $changes['priority'] = [
                    'old' => $ticket->priority,
                    'new' => $request->priority
                ];
            }

            $ticket->priority = $request->priority;

            $ticket->due_at = match ($request->priority) {
                'low' => now()->addDays(3),
                'medium' => now()->addDays(2),
                'high' => now()->addDay(),
                'critical' => now()->addHours(4),
                default => now()->addDays(3),
            };
        }

        if ($request->exists('title') || $request->exists('description')) {
            $ticket->title = $request->title ?? $ticket->title;
            $ticket->description = $request->description ?? $ticket->description;
        }

        $ticket->save();

        if (!empty($changes)) {
            TicketActivity::create([
                'ticket_id' => $ticket->id,
                'user_id' => auth()->id(),
                'action' => 'updated',
                'meta' => $changes
            ]);
        }

        return back();
    }

    public function destroy(Ticket $ticket)
    {
        $this->authorize('delete', $ticket);

        $ticket->delete();

        return back();
    }
}