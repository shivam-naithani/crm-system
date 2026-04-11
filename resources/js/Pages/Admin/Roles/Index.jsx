import React from "react";
import { router } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";

export default function Index({ usersByRole, roles, auth }) {
    const handleRoleChange = (userId, newRole) => {
        router.patch(`/admin/users/${userId}/role`, {
            role: newRole,
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="text-xl font-semibold">Roles & Permissions</h2>}
        >
            <Head title="Roles & Permissions" />

            <div className="p-6">
                {Object.keys(usersByRole).map((role) => (
                    <div key={role} className="mb-8">
                        <h2 className="text-lg font-semibold capitalize mb-3">
                            {role}
                        </h2>

                        <div className="bg-white shadow rounded-lg p-4">
                            {usersByRole[role].map((user) => (
                                <div
                                    key={user.id}
                                    className="flex items-center justify-between border-b py-3"
                                >
                                    <div>
                                        <p className="font-medium">{user.name}</p>
                                        <p className="text-sm text-gray-500">
                                            {user.email}
                                        </p>
                                    </div>

                                    <select
                                        value={user.role}
                                        onChange={(e) =>
                                            handleRoleChange(user.id, e.target.value)
                                        }
                                        className="border rounded px-3 py-1"
                                    >
                                        {roles.map((r) => (
                                            <option key={r} value={r}>
                                                {r}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </AuthenticatedLayout>
    );
}