import React from "react";
import { router, usePage } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";

export default function Index({ usersByRole, roles, auth }) {
    const [loadingUser, setLoadingUser] = React.useState(null);
    const { flash } = usePage().props;

    const handleRoleChange = (userId, newRole) => {
        setLoadingUser(userId);

        router.patch(
            `/admin/users/${userId}/role`,
            { role: newRole },
            {
                onFinish: () => setLoadingUser(null),
            }
        );
    };

    const roleStyles = {
        admin: "bg-red-100 text-red-600",
        manager: "bg-blue-100 text-blue-600",
        agent: "bg-green-100 text-green-600",
        user: "bg-gray-100 text-gray-600",
        viewer: "bg-yellow-100 text-yellow-600",
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div>
                    <h2 className="text-xl font-semibold">
                        Roles & Permissions
                    </h2>
                    <p className="text-sm text-gray-500">
                        Manage user roles and access levels
                    </p>
                </div>
            }
        >
            <Head title="Roles & Permissions" />

            <div className="p-6">
                
                {/* ✅ SUCCESS MESSAGE */}
                {flash?.success && (
                    <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md shadow-sm">
                        {flash.success}
                    </div>
                )}

                {/* 🔥 STATS BAR */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
                    {roles.map((role) => (
                        <div
                            key={role}
                            className="bg-white border rounded-lg p-4 text-center shadow-sm hover:shadow-md transition"
                        >
                            <p className="text-xs text-gray-500 uppercase tracking-wide">
                                {role}
                            </p>
                            <p className="text-2xl font-bold mt-1">
                                {usersByRole[role]?.length || 0}
                            </p>
                        </div>
                    ))}
                </div>

                {/* 🔥 GRID */}
                <div className="grid md:grid-cols-2 gap-6">
                    {roles.map((role) => {
                        const users = usersByRole[role] || [];

                        return (
                            <div
                                key={role}
                                className="bg-white rounded-xl shadow-sm border hover:shadow-md transition"
                            >
                                {/* HEADER */}
                                <div className="flex items-center justify-between px-5 py-4 border-b">
                                    <div className="flex items-center gap-3">
                                        <span
                                            className={`px-3 py-1 text-xs rounded-full font-semibold uppercase tracking-wide ${roleStyles[role]}`}
                                        >
                                            {role}
                                        </span>

                                        <span className="text-sm text-gray-500">
                                            {users.length} users
                                        </span>
                                    </div>
                                </div>

                                {/* USERS */}
                                <div>
                                    {users.length === 0 ? (
                                        <div className="px-5 py-6 text-sm text-gray-400 text-center">
                                            No users in this role
                                        </div>
                                    ) : (
                                        users.map((user) => (
                                            <div
                                                key={user.id}
                                                className="flex items-center justify-between px-5 py-4 border-b last:border-none hover:bg-gray-50 transition"
                                            >
                                                {/* LEFT */}
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center font-semibold">
                                                        {user.name
                                                            .charAt(0)
                                                            .toUpperCase()}
                                                    </div>

                                                    <div>
                                                        <div className="flex items-center gap-2">
                                                            <p className="font-medium">
                                                                {user.name}
                                                            </p>

                                                            <span
                                                                className={`text-xs px-2 py-1 rounded ${roleStyles[user.role]}`}
                                                            >
                                                                {user.role}
                                                            </span>
                                                        </div>

                                                        <p className="text-sm text-gray-500">
                                                            {user.email}
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* RIGHT */}
                                                <select
                                                    value={user.role}
                                                    onChange={(e) =>
                                                        handleRoleChange(
                                                            user.id,
                                                            e.target.value
                                                        )
                                                    }
                                                    disabled={
                                                        loadingUser === user.id
                                                    }
                                                    className={`min-w-[110px] text-center border rounded-md px-3 py-1 text-sm focus:ring-2 focus:ring-indigo-500 ${
                                                        loadingUser === user.id
                                                            ? "opacity-50 cursor-not-allowed"
                                                            : ""
                                                    }`}
                                                >
                                                    {roles.map((r) => (
                                                        <option key={r} value={r}>
                                                            {r}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}