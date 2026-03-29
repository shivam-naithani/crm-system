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

    return (
        <AuthenticatedLayout
            header={<h2 className="text-xl font-semibold">Ticket Details</h2>}
        >
            <Head title={`Ticket #${ticket.id}`} />

            <div className="p-6 space-y-6">

                {/* TICKET DETAILS */}
                <div className="bg-white p-5 rounded shadow">
                    <h3 className="text-lg font-semibold mb-2">
                        {ticket.title}
                    </h3>

                    <p className="text-gray-700 mb-4 whitespace-pre-line">
                        {ticket.description}
                    </p>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                        <div><strong>Status:</strong> {ticket.status}</div>
                        <div><strong>Priority:</strong> {ticket.priority}</div>
                        <div><strong>Assigned:</strong> {ticket.assigned_user?.name || '—'}</div>
                        <div><strong>Created By:</strong> {ticket.creator?.name}</div>
                        <div><strong>Created At:</strong> {new Date(ticket.created_at).toLocaleString()}</div>
                        <div><strong>Due:</strong> {ticket.due_at ? new Date(ticket.due_at).toLocaleString() : '—'}</div>
                    </div>
                </div>

                {/* COMMENTS */}
                <div className="bg-white p-5 rounded shadow space-y-4">
                    <h3 className="font-semibold text-lg">Comments</h3>

                    {/* ADD COMMENT */}
                    <form onSubmit={submitComment} className="space-y-2">
                        <textarea
                            className="w-full border rounded p-2 text-sm"
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
                            className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700"
                            disabled={commentForm.processing}
                        >
                            {commentForm.processing ? 'Posting...' : 'Post Comment'}
                        </button>
                    </form>

                    {/* COMMENTS LIST */}
                    <div className="space-y-3">
                        {(ticket.comments || []).length === 0 && (
                            <p className="text-sm text-gray-500">
                                No comments yet.
                            </p>
                        )}

                        {(ticket.comments || []).map(comment => (
                            <div key={comment.id} className="border rounded p-3 bg-gray-50">
                                <div className="text-xs text-gray-500 mb-1">
                                    <strong>{comment.user?.name}</strong> • {new Date(comment.created_at).toLocaleString()}
                                </div>

                                <div className="text-sm whitespace-pre-line">
                                    {comment.message}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ACTIVITY */}
                <div className="bg-white p-5 rounded shadow space-y-4">
                    <h3 className="font-semibold text-lg">Activity Timeline</h3>

                    {(ticket.activities || []).length === 0 && (
                        <p className="text-sm text-gray-500">No activity yet.</p>
                    )}

                    <div className="space-y-3">
                        {(ticket.activities || []).map(activity => (
                            <div key={activity.id} className="border-l-4 border-blue-500 pl-3 py-2">
                                <div className="text-sm">
                                    <strong>{activity.user?.name || 'System'}</strong>{' '}
                                    {activity.action}
                                </div>

                                <div className="text-xs text-gray-500 mb-1">
                                    {new Date(activity.created_at).toLocaleString()}
                                </div>

                                {activity.meta && (
                                    <div className="text-xs bg-gray-50 p-2 rounded mt-1">
                                        {Object.keys(activity.meta).map(key => (
                                            <div key={key}>
                                                <span className="font-medium">{key}:</span>{' '}
                                                {activity.meta[key].old ?? '—'} → {activity.meta[key].new ?? '—'}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </AuthenticatedLayout>
    );
}