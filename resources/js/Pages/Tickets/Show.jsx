import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage, useForm } from '@inertiajs/react';

export default function Show() {
    const { ticket } = usePage().props;

    const commentForm = useForm({
        message: ''
    });

    const submitComment = (e) => {
        e.preventDefault();

        commentForm.post(`/tickets/${ticket.id}/comments`, {
            preserveScroll: true,
            onSuccess: () => {
                commentForm.reset();
                commentForm.clearErrors();
            }
        });
    };

    // badge styles
    const statusStyles = {
        pending: "bg-yellow-500 text-white",
        inprogress: "bg-blue-500 text-white",
        completed: "bg-green-600 text-white",
    };

    const priorityStyles = {
        low: "bg-gray-500 text-white",
        medium: "bg-orange-500 text-white",
        high: "bg-red-600 text-white",
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="space-y-1">
                    <h2 className="text-2xl font-semibold text-gray-800">
                        Ticket Details
                    </h2>
                    <p className="text-sm text-gray-500">
                        View and track ticket progress
                    </p>
                </div>
            }
        >
            <Head title={`Ticket #${ticket.id}`} />

            <div className="p-6 space-y-6">

                {/* HEADER CARD */}
                <div className="bg-white p-6 rounded-xl shadow-sm border space-y-5">
                    
                    {/* Title + badges */}
                    <div className="flex items-start justify-between flex-wrap gap-3">
                        <h3 className="text-2xl font-semibold text-gray-900">
                            {ticket.title}
                        </h3>

                        <div className="flex gap-2">
                            <span className={`px-3 py-1 text-xs rounded-full font-semibold ${statusStyles[ticket.status]}`}>
                                {ticket.status}
                            </span>

                            <span className={`px-3 py-1 text-xs rounded-full font-semibold ${priorityStyles[ticket.priority]}`}>
                                {ticket.priority}
                            </span>
                        </div>
                    </div>

                    {/* Description */}
                    <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                        {ticket.description}
                    </p>

                    {/* Divider */}
                    <div className="border-t pt-4"></div>

                    {/* Metadata */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-5 text-sm">
                        <div>
                            <p className="text-gray-500">Assigned</p>
                            <p className="font-medium">
                                {ticket.assigned_user?.name || '—'}
                            </p>
                        </div>

                        <div>
                            <p className="text-gray-500">Created By</p>
                            <p className="font-medium">
                                {ticket.creator?.name}
                            </p>
                        </div>

                        <div>
                            <p className="text-gray-500">Created At</p>
                            <p className="font-medium">
                                {new Date(ticket.created_at).toLocaleString()}
                            </p>
                        </div>

                        <div>
                            <p className="text-gray-500">Due Date</p>
                            <p className="font-medium">
                                {ticket.due_at
                                    ? new Date(ticket.due_at).toLocaleString()
                                    : '—'}
                            </p>
                        </div>
                    </div>
                </div>

                {/* COMMENTS */}
                <div className="bg-white p-6 rounded-xl shadow-sm border space-y-5">
                    <h3 className="text-lg font-semibold text-gray-800">
                        Comments
                    </h3>

                    {/* Add comment */}
                    <form onSubmit={submitComment} className="space-y-3">
                        <textarea
                            className="w-full border rounded-md p-3 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                            placeholder="Write a comment..."
                            value={commentForm.data.message}
                            onChange={e => commentForm.setData('message', e.target.value)}
                        />

                        {commentForm.errors.message && (
                            <div className="text-red-500 text-sm">
                                {commentForm.errors.message}
                            </div>
                        )}

                        <button
                            className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm hover:bg-indigo-700 transition"
                            disabled={commentForm.processing}
                        >
                            {commentForm.processing ? 'Posting...' : 'Post Comment'}
                        </button>
                    </form>

                    {/* Comment list */}
                    <div className="space-y-4">
                        {(ticket.comments || []).length === 0 && (
                            <p className="text-sm text-gray-400">
                                No comments yet.
                            </p>
                        )}

                        {(ticket.comments || []).map(comment => (
                            <div key={comment.id} className="flex gap-3 items-start">
                                
                                {/* Avatar */}
                                <div className="w-9 h-9 rounded-full bg-gray-300 flex items-center justify-center text-sm font-semibold">
                                    {comment.user?.name?.charAt(0).toUpperCase()}
                                </div>

                                {/* Bubble */}
                                <div className="flex-1 bg-gray-100 rounded-lg p-3 shadow-sm">
                                    <div className="text-xs text-gray-500 mb-1">
                                        <strong>{comment.user?.name}</strong> • {new Date(comment.created_at).toLocaleString()}
                                    </div>

                                    <div className="text-sm text-gray-700 whitespace-pre-line">
                                        {comment.message}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ACTIVITY TIMELINE */}
                <div className="bg-white p-6 rounded-xl shadow-sm border space-y-5">
                    <h3 className="text-lg font-semibold text-gray-800">
                        Activity Timeline
                    </h3>

                    {(ticket.activities || []).length === 0 && (
                        <p className="text-sm text-gray-400">
                            No activity yet.
                        </p>
                    )}

                    <div className="space-y-6">
                        {(ticket.activities || []).map(activity => (
                            <div key={activity.id} className="flex gap-4">

                                {/* Timeline */}
                                <div className="flex flex-col items-center">
                                    <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                                    <div className="flex-1 w-[2px] bg-gray-300"></div>
                                </div>

                                {/* Content */}
                                <div className="flex-1 pb-2">
                                    <div className="text-sm text-gray-800">
                                        <strong>{activity.user?.name || 'System'}</strong> {activity.action}
                                    </div>

                                    <div className="text-xs text-gray-500 mb-2">
                                        {new Date(activity.created_at).toLocaleString()}
                                    </div>

                                    {activity.meta && (
                                        <div className="text-xs bg-gray-100 p-2 rounded">
                                            {Object.keys(activity.meta).map(key => (
                                                <div key={key}>
                                                    <span className="font-medium">{key}:</span>{' '}
                                                    {activity.meta[key].old ?? '—'} → {activity.meta[key].new ?? '—'}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </AuthenticatedLayout>
    );
}