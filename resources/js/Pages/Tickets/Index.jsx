import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useForm, usePage, router, Head } from '@inertiajs/react';
import { useState } from 'react';

export default function Index({ tickets, users }) {
    const { auth, filters: pageFilters } = usePage().props;
    const currentUser = auth.user;

    const createForm = useForm({
        title: '',
        description: ''
    });

    const [ticketUpdates, setTicketUpdates] = useState({});

    const [filters, setFilters] = useState({
        search: pageFilters?.search || '',
        status: pageFilters?.status || '',
        priority: pageFilters?.priority || '',
        assigned_to: pageFilters?.assigned_to || ''
    });

    const getCleanedFilters = () => {
        return Object.fromEntries(
            Object.entries(filters).filter(([_, value]) => value !== '' && value !== null)
        );
    };

    const applyFilters = () => {
        router.get('/tickets', getCleanedFilters(), {
            preserveState: true,
            replace: true,
            preserveScroll: true
        });
    };

    const createTicket = (e) => {
        e.preventDefault();

        createForm.post('/tickets', {
            onSuccess: () => {
                createForm.reset();
                createForm.clearErrors();
            }
        });
    };

    const updateTicket = (ticket) => {
        const updates = ticketUpdates[ticket.id] || {};
        if (Object.keys(updates).length === 0) return;

        router.put(`/tickets/${ticket.id}`, updates, {
            preserveScroll: true
        });
    };

    const deleteTicket = (ticket) => {
        if (confirm('Delete this ticket?')) {
            router.delete(`/tickets/${ticket.id}`);
        }
    };

    return (
        <AuthenticatedLayout
            header={<h2 className="text-xl font-semibold">Tickets</h2>}
        >
            <Head title="Tickets" />

            <div className="p-6 space-y-6">

                {/* FILTERS */}
                <div className="bg-white p-4 rounded shadow">
                    <h3 className="mb-3 font-semibold">Filters</h3>

                    <div className="flex flex-wrap items-center gap-3">
                        <input
                            className="w-full sm:w-64 px-3 py-2 border rounded text-sm"
                            placeholder="Search..."
                            value={filters.search}
                            onChange={e =>
                                setFilters(prev => ({ ...prev, search: e.target.value }))
                            }
                        />

                        <select
                            className="min-w-[140px] px-3 py-2 border rounded text-sm bg-white"
                            value={filters.status}
                            onChange={e =>
                                setFilters(prev => ({ ...prev, status: e.target.value }))
                            }
                        >
                            <option value="">All Status</option>
                            <option value="pending">Pending</option>
                            <option value="inprogress">In Progress</option>
                            <option value="completed">Completed</option>
                            <option value="onhold">On Hold</option>
                        </select>

                        <select
                            className="min-w-[140px] px-3 py-2 border rounded text-sm bg-white"
                            value={filters.priority}
                            onChange={e =>
                                setFilters(prev => ({ ...prev, priority: e.target.value }))
                            }
                        >
                            <option value="">All Priority</option>
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                            <option value="critical">Critical</option>
                        </select>

                        <select
                            className="min-w-[160px] px-3 py-2 border rounded text-sm bg-white"
                            value={filters.assigned_to}
                            onChange={e =>
                                setFilters(prev => ({ ...prev, assigned_to: e.target.value }))
                            }
                        >
                            <option value="">All Assignees</option>
                            {users.map(user => (
                                <option key={user.id} value={user.id}>
                                    {user.name}
                                </option>
                            ))}
                        </select>

                        <button
                            onClick={applyFilters}
                            className="px-4 py-2 bg-blue-600 text-white rounded text-sm"
                        >
                            Apply
                        </button>

                        <button
                            onClick={() => router.get('/tickets')}
                            className="px-4 py-2 bg-gray-200 rounded text-sm"
                        >
                            Reset
                        </button>
                    </div>
                </div>

                {/* CREATE */}
                <form onSubmit={createTicket} className="bg-white p-4 rounded shadow space-y-3">
                    <h3 className="font-semibold">Create Ticket</h3>

                    <input
                        className="border p-2 w-full rounded text-sm"
                        placeholder="Title"
                        value={createForm.data.title}
                        onChange={e => createForm.setData('title', e.target.value)}
                    />

                    <textarea
                        className="border p-2 w-full rounded text-sm"
                        placeholder="Description"
                        value={createForm.data.description}
                        onChange={e => createForm.setData('description', e.target.value)}
                    />

                    <button className="bg-green-600 text-white px-4 py-2 rounded text-sm">
                        Create
                    </button>
                </form>

                {/* TABLE */}
                <div className="bg-white rounded shadow overflow-x-auto">
                    <table className="min-w-full table-fixed text-sm">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="p-3 text-left w-[25%]">Title</th>
                                <th className="p-3 text-left w-[15%]">Status</th>
                                <th className="p-3 text-left w-[15%]">Priority</th>
                                <th className="p-3 text-left w-[15%]">Assigned</th>
                                <th className="p-3 text-left w-[15%]">Due</th>
                                <th className="p-3 text-left w-[15%]">Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {tickets.data.map(ticket => {
                                const isManager =
                                    currentUser.role === 'manager' ||
                                    currentUser.role === 'admin';

                                return (
                                    <tr
                                        key={ticket.id}
                                        className="border-t cursor-pointer hover:bg-gray-50"
                                        onClick={() => router.get(`/tickets/${ticket.id}`)}
                                    >
                                        <td className="p-3 truncate max-w-[250px]">
                                            {ticket.title}
                                        </td>

                                        <td className="p-3">
                                            <select
                                                onClick={(e) => e.stopPropagation()}
                                                className="w-full min-w-[120px] border rounded px-2 py-1 text-sm"
                                                defaultValue={ticket.status}
                                                onChange={e =>
                                                    setTicketUpdates(prev => ({
                                                        ...prev,
                                                        [ticket.id]: {
                                                            ...prev[ticket.id],
                                                            status: e.target.value
                                                        }
                                                    }))
                                                }
                                            >
                                                <option value="pending">Pending</option>
                                                <option value="inprogress">In Progress</option>
                                                <option value="completed">Completed</option>
                                                <option value="onhold">On Hold</option>
                                            </select>
                                        </td>

                                        <td className="p-3">
                                            {isManager ? (
                                                <select
                                                    onClick={(e) => e.stopPropagation()}
                                                    className="w-full min-w-[120px] border rounded px-2 py-1 text-sm"
                                                    defaultValue={ticket.priority}
                                                    onChange={e =>
                                                        setTicketUpdates(prev => ({
                                                            ...prev,
                                                            [ticket.id]: {
                                                                ...prev[ticket.id],
                                                                priority: e.target.value
                                                            }
                                                        }))
                                                    }
                                                >
                                                    <option value="low">Low</option>
                                                    <option value="medium">Medium</option>
                                                    <option value="high">High</option>
                                                    <option value="critical">Critical</option>
                                                </select>
                                            ) : (
                                                <span className="capitalize">{ticket.priority}</span>
                                            )}
                                        </td>

                                        <td className="p-3">
                                            {ticket.assigned_user?.name || '—'}
                                        </td>

                                        <td className="p-3">
                                            {ticket.due_at
                                                ? new Date(ticket.due_at).toLocaleString()
                                                : '—'}
                                        </td>

                                        <td className="p-3 space-x-2">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    updateTicket(ticket);
                                                }}
                                                className="bg-blue-600 text-white px-3 py-1 text-sm rounded"
                                            >
                                                Update
                                            </button>

                                            {(currentUser.id === ticket.created_by ||
                                                currentUser.role === 'admin') && (
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        deleteTicket(ticket);
                                                    }}
                                                    className="bg-red-600 text-white px-3 py-1 text-sm rounded"
                                                >
                                                    Delete
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>

                    {/* PAGINATION */}
                    <div className="p-4 flex gap-2">
                        {tickets.links.map((link, index) => (
                            <button
                                key={index}
                                disabled={!link.url}
                                onClick={() =>
                                    link.url &&
                                    router.get(link.url, getCleanedFilters(), {
                                        preserveState: true,
                                        preserveScroll: true
                                    })
                                }
                                className={`px-3 py-1 border rounded text-sm ${
                                    link.active ? 'bg-black text-white' : 'bg-white'
                                }`}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ))}
                    </div>
                </div>

            </div>
        </AuthenticatedLayout>
    );
}