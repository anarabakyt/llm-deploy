import React, { useState } from 'react';

interface User {
    id: string;
    name: string;
    email: string;
    role: 'admin' | 'moderator' | 'user';
    status: 'active' | 'suspended' | 'banned';
    lastActive: string;
    totalRequests: number;
    joinDate: string;
    avatar?: string;
}

export const UserManagement: React.FC = () => {
    const [users, setUsers] = useState<User[]>([
        {
            id: '1',
            name: 'John Doe',
            email: 'john@example.com',
            role: 'user',
            status: 'active',
            lastActive: '2024-01-15T10:30:00Z',
            totalRequests: 156,
            joinDate: '2024-01-01',
            avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face'
        },
        {
            id: '2',
            name: 'Jane Smith',
            email: 'jane@example.com',
            role: 'moderator',
            status: 'active',
            lastActive: '2024-01-15T09:15:00Z',
            totalRequests: 89,
            joinDate: '2023-12-15',
            avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=32&h=32&fit=crop&crop=face'
        },
        {
            id: '3',
            name: 'Mike Johnson',
            email: 'mike@example.com',
            role: 'user',
            status: 'suspended',
            lastActive: '2024-01-10T14:20:00Z',
            totalRequests: 234,
            joinDate: '2023-11-20',
            avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face'
        }
    ]);

    const [searchTerm, setSearchTerm] = useState('');
    const [filterRole, setFilterRole] = useState<string>('all');
    const [filterStatus, setFilterStatus] = useState<string>('all');

    const filteredUsers = users.filter(user => {
        const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            user.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRole = filterRole === 'all' || user.role === filterRole;
        const matchesStatus = filterStatus === 'all' || user.status === filterStatus;
        
        return matchesSearch && matchesRole && matchesStatus;
    });

    const handleStatusChange = (userId: string, newStatus: User['status']) => {
        setUsers(users.map(user => 
            user.id === userId ? { ...user, status: newStatus } : user
        ));
    };

    const handleRoleChange = (userId: string, newRole: User['role']) => {
        setUsers(users.map(user => 
            user.id === userId ? { ...user, role: newRole } : user
        ));
    };

    const getStatusBadge = (status: User['status']) => {
        const styles = {
            active: 'bg-green-100 text-green-800',
            suspended: 'bg-yellow-100 text-yellow-800',
            banned: 'bg-red-100 text-red-800'
        };
        return (
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${styles[status]}`}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
        );
    };

    const getRoleBadge = (role: User['role']) => {
        const styles = {
            admin: 'bg-purple-100 text-purple-800',
            moderator: 'bg-blue-100 text-blue-800',
            user: 'bg-gray-100 text-gray-800'
        };
        return (
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${styles[role]}`}>
                {role.charAt(0).toUpperCase() + role.slice(1)}
            </span>
        );
    };

    return (
        <div className="space-y-6">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
                <p className="text-gray-600">Manage users, roles, and permissions</p>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-lg shadow p-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
                        <input
                            type="text"
                            placeholder="Search users..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                        <select
                            value={filterRole}
                            onChange={(e) => setFilterRole(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="all">All Roles</option>
                            <option value="admin">Admin</option>
                            <option value="moderator">Moderator</option>
                            <option value="user">User</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="all">All Status</option>
                            <option value="active">Active</option>
                            <option value="suspended">Suspended</option>
                            <option value="banned">Banned</option>
                        </select>
                    </div>
                    <div className="flex items-end">
                        <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                            Add User
                        </button>
                    </div>
                </div>
            </div>

            {/* Users Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-900">Users ({filteredUsers.length})</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Requests</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Active</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredUsers.map((user) => (
                                <tr key={user.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            {user.avatar ? (
                                                <img
                                                    className="h-10 w-10 rounded-full"
                                                    src={user.avatar}
                                                    alt={user.name}
                                                />
                                            ) : (
                                                <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                                                    <span className="text-sm font-medium text-gray-700">
                                                        {user.name.charAt(0).toUpperCase()}
                                                    </span>
                                                </div>
                                            )}
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-gray-900">{user.name}</div>
                                                <div className="text-sm text-gray-500">{user.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <select
                                            value={user.role}
                                            onChange={(e) => handleRoleChange(user.id, e.target.value as User['role'])}
                                            className="text-sm border-0 bg-transparent focus:outline-none focus:ring-0"
                                        >
                                            <option value="user">User</option>
                                            <option value="moderator">Moderator</option>
                                            <option value="admin">Admin</option>
                                        </select>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <select
                                            value={user.status}
                                            onChange={(e) => handleStatusChange(user.id, e.target.value as User['status'])}
                                            className="text-sm border-0 bg-transparent focus:outline-none focus:ring-0"
                                        >
                                            <option value="active">Active</option>
                                            <option value="suspended">Suspended</option>
                                            <option value="banned">Banned</option>
                                        </select>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {user.totalRequests.toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {new Date(user.lastActive).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <div className="flex space-x-2">
                                            <button className="text-blue-600 hover:text-blue-900">Edit</button>
                                            <button className="text-red-600 hover:text-red-900">Delete</button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};
