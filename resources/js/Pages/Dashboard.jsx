import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function Dashboard({ role, stats = {} }) {
    if (!role) {
        return <div className="p-6">Loading...</div>;
    }

    const adminRoles = ['admin', 'manager', 'viewer'];

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Dashboard
                </h2>
            }
        >
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">

                        {/* ADMIN / MANAGER / VIEWER */}
                        {adminRoles.includes(role) && (
                            <>
                                <Card title="Total Tickets" value={stats.total} href={route('tickets.index')} />

                                <Card title="Pending" value={stats.pending} href={route('tickets.index', { status: 'pending' })} />

                                <Card title="In Progress" value={stats.inprogress} href={route('tickets.index', { status: 'inprogress' })} />

                                <Card title="Completed" value={stats.completed} href={route('tickets.index', { status: 'completed' })} />

                                <Card title="On Hold" value={stats.onhold} href={route('tickets.index', { status: 'onhold' })} />

                                <Card title="Overdue" value={stats.overdue} href={route('tickets.index', { overdue: 1 })} />
                            </>
                        )}

                        {/* AGENT */}
                        {role === 'agent' && (
                            <>
                                <Card title="Assigned Tickets" value={stats.assigned} href={route('tickets.index')} />

                                <Card title="Pending" value={stats.pending} href={route('tickets.index', { status: 'pending' })} />

                                <Card title="In Progress" value={stats.inprogress} href={route('tickets.index', { status: 'inprogress' })} />

                                <Card title="Completed" value={stats.completed} href={route('tickets.index', { status: 'completed' })} />

                                <Card title="On Hold" value={stats.onhold} href={route('tickets.index', { status: 'onhold' })} />

                                <Card title="Overdue" value={stats.overdue} href={route('tickets.index', { overdue: 1 })} />
                            </>
                        )}

                        {/* USER */}
                        {role === 'user' && (
                            <>
                                <Card title="Total Tickets" value={stats.total} href={route('tickets.index')} />

                                <Card title="Open Tickets" value={stats.open} href={route('tickets.index', { status: 'pending' })} />

                                <Card title="Completed" value={stats.completed} href={route('tickets.index', { status: 'completed' })} />

                                <Card title="On Hold" value={stats.onhold} href={route('tickets.index', { status: 'onhold' })} />

                                <Card title="Overdue" value={stats.overdue} href={route('tickets.index', { overdue: 1 })} />
                            </>
                        )}

                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}

 /* Card is clickable */
 
function Card({ title, value, href }) {
    return (
        <Link href={href || '#'} className="block">
            <div className="bg-white shadow-md rounded-2xl p-5 border hover:shadow-lg transition cursor-pointer hover:scale-[1.02]">
                <h3 className="text-gray-500 text-sm">{title}</h3>
                <p className="text-3xl font-bold mt-2">{value ?? 0}</p>
            </div>
        </Link>
    );
}