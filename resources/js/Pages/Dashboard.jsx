import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    Cell,
} from 'recharts';

export default function Dashboard({ role, stats = {}, recentTickets = [] }) {
    if (!role) {
        return <div className="p-6">Loading...</div>;
    }

    const adminRoles = ['admin', 'manager', 'viewer'];

    const priorityStyles = {
        low: "bg-gray-100 text-gray-600",
        medium: "bg-yellow-100 text-yellow-700",
        high: "bg-red-100 text-red-600",
    };

    const chartData = [
        { name: 'Pending', value: stats.pending || 0 },
        { name: 'In Progress', value: stats.inprogress || 0 },
        { name: 'Completed', value: stats.completed || 0 },
        { name: 'On Hold', value: stats.onhold || 0 },
        { name: 'Overdue', value: stats.overdue || 0 },
    ];

    const chartColors = {
        Pending: "#facc15",
        "In Progress": "#3b82f6",
        Completed: "#22c55e",
        "On Hold": "#a855f7",
        Overdue: "#ef4444",
    };

    return (
        <AuthenticatedLayout
            header={
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">
                        Dashboard
                    </h2>
                    <p className="text-sm text-gray-500">
                        Overview of tickets and activity
                    </p>
                </div>
            }
        >
            <Head title="Dashboard" />

            <div className="py-6 bg-gray-50 min-h-screen">
                <div className="mx-auto max-w-7xl px-4">

                    {/* CARDS */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-10">

                        {adminRoles.includes(role) && (
                            <>
                                <Card title="Total Tickets" value={stats.total} color="gray" href={route('tickets.index')} />
                                <Card title="Pending" value={stats.pending} color="yellow" href={route('tickets.index', { status: 'pending' })} />
                                <Card title="In Progress" value={stats.inprogress} color="blue" href={route('tickets.index', { status: 'inprogress' })} />
                                <Card title="Completed" value={stats.completed} color="green" href={route('tickets.index', { status: 'completed' })} />
                                <Card title="On Hold" value={stats.onhold} color="purple" href={route('tickets.index', { status: 'onhold' })} />
                                <Card title="Overdue" value={stats.overdue} color="red" href={route('tickets.index', { overdue: 1 })} />
                            </>
                        )}

                        {role === 'agent' && (
                            <>
                                <Card title="Assigned Tickets" value={stats.assigned} color="gray" href={route('tickets.index')} />
                                <Card title="Pending" value={stats.pending} color="yellow" href={route('tickets.index', { status: 'pending' })} />
                                <Card title="In Progress" value={stats.inprogress} color="blue" href={route('tickets.index', { status: 'inprogress' })} />
                                <Card title="Completed" value={stats.completed} color="green" href={route('tickets.index', { status: 'completed' })} />
                                <Card title="On Hold" value={stats.onhold} color="purple" href={route('tickets.index', { status: 'onhold' })} />
                                <Card title="Overdue" value={stats.overdue} color="red" href={route('tickets.index', { overdue: 1 })} />
                            </>
                        )}

                        {role === 'user' && (
                            <>
                                <Card title="Total Tickets" value={stats.total} color="gray" href={route('tickets.index')} />
                                <Card title="Open Tickets" value={stats.open} color="yellow" href={route('tickets.index', { status: 'pending' })} />
                                <Card title="Completed" value={stats.completed} color="green" href={route('tickets.index', { status: 'completed' })} />
                                <Card title="On Hold" value={stats.onhold} color="purple" href={route('tickets.index', { status: 'onhold' })} />
                                <Card title="Overdue" value={stats.overdue} color="red" href={route('tickets.index', { overdue: 1 })} />
                            </>
                        )}

                    </div>

                    {/* CHART */}
                    <div className="bg-white rounded-2xl shadow-sm border p-6 mb-10">
                        <h3 className="text-lg font-semibold mb-6">
                            Ticket Overview
                        </h3>

                        <div className="w-full h-72">
                            <ResponsiveContainer>
                                <BarChart
                                    data={chartData}
                                    margin={{ top: 10, right: 20, left: -10, bottom: 0 }}
                                    barCategoryGap="35%"
                                >
                                    <XAxis
                                        dataKey="name"
                                        tick={{ fontSize: 12 }}
                                        axisLine={false}
                                        tickLine={false}
                                    />

                                    <YAxis
                                        allowDecimals={false}
                                        axisLine={false}
                                        tickLine={false}
                                    />

                                    <Tooltip
                                        cursor={{ fill: 'transparent' }}
                                        contentStyle={{
                                            borderRadius: '8px',
                                            border: '1px solid #eee',
                                            fontSize: '12px'
                                        }}
                                    />

                                    <Bar dataKey="value" radius={[6, 6, 0, 0]} barSize={45}>
                                        {chartData.map((entry, index) => (
                                            <Cell
                                                key={`cell-${index}`}
                                                fill={chartColors[entry.name]}
                                            />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* RECENT TICKETS */}
                    <div className="bg-white rounded-2xl shadow-sm border p-6">

                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold">
                                Recent Tickets
                            </h3>

                            <Link
                                href={route('tickets.index')}
                                className="text-sm text-blue-600 hover:underline"
                            >
                                View All →
                            </Link>
                        </div>

                        {recentTickets.length === 0 ? (
                            <p className="text-gray-500 text-sm">
                                No recent tickets found.
                            </p>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left">
                                    <thead>
                                        <tr className="text-gray-500 border-b">
                                            <th className="py-2">Title</th>
                                            <th>Status</th>
                                            <th>Priority</th>
                                            <th>Assigned</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {recentTickets.map((ticket) => (
                                            <tr
                                                key={ticket.id}
                                                className="border-b hover:bg-gray-50 cursor-pointer transition"
                                                onClick={() => router.visit(route('tickets.show', ticket.id))}
                                            >
                                                <td className="py-3 font-medium">
                                                    {ticket.title}
                                                </td>

                                                <td>
                                                    <StatusBadge status={ticket.status} />
                                                </td>

                                                <td>
                                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${priorityStyles[ticket.priority]}`}>
                                                        {ticket.priority}
                                                    </span>
                                                </td>

                                                <td>
                                                    {ticket.assigned_user?.name || '—'}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}

/* CARD */
function Card({ title, value, href, color }) {
    const colors = {
        gray: "bg-gray-500",
        yellow: "bg-yellow-500",
        blue: "bg-blue-500",
        green: "bg-green-500",
        red: "bg-red-500",
        purple: "bg-purple-500",
    };

    return (
        <Link href={href || '#'} className="block group">
            <div className="relative bg-white rounded-2xl shadow-sm border hover:shadow-xl transition duration-300 hover:-translate-y-1">
                <div className={`absolute left-0 top-0 h-full w-1.5 rounded-l-2xl ${colors[color]}`} />

                <div className="p-5 pl-6">
                    <p className="text-sm text-gray-500">{title}</p>

                    <div className="flex justify-between items-center mt-2">
                        <p className="text-4xl font-bold">{value ?? 0}</p>
                        <span className="text-gray-300 group-hover:text-gray-600">→</span>
                    </div>

                    <p className="text-xs text-gray-400 mt-2">
                        Click to view
                    </p>
                </div>
            </div>
        </Link>
    );
}

/* STATUS BADGE */
function StatusBadge({ status }) {
    const styles = {
        pending: "bg-yellow-100 text-yellow-700",
        inprogress: "bg-blue-100 text-blue-700",
        completed: "bg-green-100 text-green-700",
        onhold: "bg-purple-100 text-purple-700",
    };

    return (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status]}`}>
            {status}
        </span>
    );
}