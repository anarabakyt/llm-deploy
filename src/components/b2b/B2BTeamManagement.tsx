import React, { useState } from 'react';

interface TeamMember {
    id: string;
    name: string;
    email: string;
    role: 'admin' | 'member' | 'viewer';
    status: 'active' | 'pending' | 'suspended';
    lastActive: string;
    avatar?: string;
    department?: string;
    joinDate: string;
}

export const B2BTeamManagement: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterRole, setFilterRole] = useState<string>('all');
    const [showInviteModal, setShowInviteModal] = useState(false);

    const mockMembers: TeamMember[] = [
        {
            id: '1',
            name: 'John Smith',
            email: 'john.smith@company.com',
            role: 'admin',
            status: 'active',
            lastActive: '2 hours ago',
            avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face',
            department: 'Engineering',
            joinDate: '2024-01-15'
        },
        {
            id: '2',
            name: 'Sarah Johnson',
            email: 'sarah.johnson@company.com',
            role: 'member',
            status: 'active',
            lastActive: '1 day ago',
            avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=32&h=32&fit=crop&crop=face',
            department: 'Marketing',
            joinDate: '2024-02-01'
        },
        {
            id: '3',
            name: 'Mike Chen',
            email: 'mike.chen@company.com',
            role: 'member',
            status: 'pending',
            lastActive: 'Never',
            department: 'Sales',
            joinDate: '2024-03-10'
        },
        {
            id: '4',
            name: 'Emily Davis',
            email: 'emily.davis@company.com',
            role: 'viewer',
            status: 'active',
            lastActive: '3 days ago',
            avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=32&h=32&fit=crop&crop=face',
            department: 'HR',
            joinDate: '2024-01-20'
        }
    ];

    const filteredMembers = mockMembers.filter(member => {
        const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            member.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRole = filterRole === 'all' || member.role === filterRole;
        return matchesSearch && matchesRole;
    });

    const getRoleBadgeColor = (role: string) => {
        switch (role) {
            case 'admin': return 'bg-red-100 text-red-800';
            case 'member': return 'bg-blue-100 text-blue-800';
            case 'viewer': return 'bg-gray-100 text-gray-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusBadgeColor = (status: string) => {
        switch (status) {
            case 'active': return 'bg-green-100 text-green-800';
            case 'pending': return 'bg-yellow-100 text-yellow-800';
            case 'suspended': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="max-w-7xl mx-auto p-6">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Team Management</h1>
                <p className="text-gray-600">Manage your team members, roles, and permissions</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                    <div className="flex items-center">
                        <div className="p-3 bg-blue-100 rounded-lg">
                            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                            </svg>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Total Members</p>
                            <p className="text-2xl font-bold text-gray-900">{mockMembers.length}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                    <div className="flex items-center">
                        <div className="p-3 bg-green-100 rounded-lg">
                            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Active</p>
                            <p className="text-2xl font-bold text-gray-900">{mockMembers.filter(m => m.status === 'active').length}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                    <div className="flex items-center">
                        <div className="p-3 bg-yellow-100 rounded-lg">
                            <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Pending</p>
                            <p className="text-2xl font-bold text-gray-900">{mockMembers.filter(m => m.status === 'pending').length}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                    <div className="flex items-center">
                        <div className="p-3 bg-purple-100 rounded-lg">
                            <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Licenses Used</p>
                            <p className="text-2xl font-bold text-gray-900">4/25</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Controls */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-6">
                <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                    <div className="flex flex-col sm:flex-row gap-4 flex-1">
                        {/* Search */}
                        <div className="relative flex-1 max-w-md">
                            <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            <input
                                type="text"
                                placeholder="Search members..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>

                        {/* Role Filter */}
                        <select
                            value={filterRole}
                            onChange={(e) => setFilterRole(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="all">All Roles</option>
                            <option value="admin">Admins</option>
                            <option value="member">Members</option>
                            <option value="viewer">Viewers</option>
                        </select>
                    </div>

                    {/* Invite Button */}
                    <button
                        onClick={() => setShowInviteModal(true)}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                        <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        Invite Member
                    </button>
                </div>
            </div>

            {/* Members List */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900">Team Members ({filteredMembers.length})</h3>
                </div>
                
                <div className="divide-y divide-gray-200">
                    {filteredMembers.map((member) => (
                        <div key={member.id} className="p-6 hover:bg-gray-50 transition-colors">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                    {/* Avatar */}
                                    <div className="flex-shrink-0">
                                        {member.avatar ? (
                                            <img
                                                className="h-12 w-12 rounded-full"
                                                src={member.avatar}
                                                alt={member.name}
                                            />
                                        ) : (
                                            <div className="h-12 w-12 rounded-full bg-gray-300 flex items-center justify-center">
                                                <span className="text-lg font-medium text-gray-700">
                                                    {member.name.charAt(0)}
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Member Info */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center space-x-2 mb-1">
                                            <h4 className="text-lg font-medium text-gray-900 truncate">
                                                {member.name}
                                            </h4>
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleBadgeColor(member.role)}`}>
                                                {member.role}
                                            </span>
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeColor(member.status)}`}>
                                                {member.status}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-600 truncate">{member.email}</p>
                                        <div className="flex items-center space-x-4 mt-1">
                                            <span className="text-xs text-gray-500">
                                                Last active: {member.lastActive}
                                            </span>
                                            {member.department && (
                                                <span className="text-xs text-gray-500">
                                                    {member.department}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex items-center space-x-2">
                                    <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                    </button>
                                    <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                        </svg>
                                    </button>
                                    <button className="p-2 text-red-400 hover:text-red-600 transition-colors">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Invite Modal Placeholder */}
            {showInviteModal && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Invite Team Member</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                                <input
                                    type="email"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="colleague@company.com"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                                    <option value="member">Member</option>
                                    <option value="viewer">Viewer</option>
                                </select>
                            </div>
                        </div>
                        <div className="flex justify-end space-x-3 mt-6">
                            <button
                                onClick={() => setShowInviteModal(false)}
                                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                            >
                                Cancel
                            </button>
                            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                                Send Invite
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
