import React from 'react';

interface User {
    userId: string;
    userName: string;
    userEmail: string;
    userAvatar?: string;
}

interface UserFilterProps {
    users: User[];
    selectedUserId: string | null;
    onUserChange: (userId: string | null) => void;
}

export const UserFilter: React.FC<UserFilterProps> = ({
    users,
    selectedUserId,
    onUserChange
}) => {
    return (
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">User</label>
            <select
                value={selectedUserId || 'all'}
                onChange={(e) => onUserChange(e.target.value === 'all' ? null : e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
                <option value="all">All Users</option>
                {users.map(user => (
                    <option key={user.userId} value={user.userId}>
                        {user.userName} ({user.userEmail})
                    </option>
                ))}
            </select>
        </div>
    );
};
