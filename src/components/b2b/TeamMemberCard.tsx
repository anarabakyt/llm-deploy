import React from 'react';

interface TeamMemberCardProps {
    member: {
        id: string;
        name: string;
        email: string;
        role: 'admin' | 'member' | 'viewer';
        status: 'active' | 'pending' | 'suspended';
        lastActive: string;
        avatar?: string;
        department?: string;
        joinDate: string;
    };
    onEdit?: (memberId: string) => void;
    onRemove?: (memberId: string) => void;
    onView?: (memberId: string) => void;
}

export const TeamMemberCard: React.FC<TeamMemberCardProps> = ({
    member,
    onEdit,
    onRemove,
    onView
}) => {
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

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'active': return '🟢';
            case 'pending': return '🟡';
            case 'suspended': return '🔴';
            default: return '⚪';
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
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
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900">{member.name}</h3>
                        <p className="text-sm text-gray-600">{member.email}</p>
                        {member.department && (
                            <p className="text-xs text-gray-500 mt-1">{member.department}</p>
                        )}
                    </div>
                </div>

                {/* Status Indicator */}
                <div className="flex items-center space-x-2">
                    <span className="text-lg">{getStatusIcon(member.status)}</span>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeColor(member.status)}`}>
                        {member.status}
                    </span>
                </div>
            </div>

            {/* Role and Join Date */}
            <div className="flex items-center justify-between mb-4">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleBadgeColor(member.role)}`}>
                    {member.role}
                </span>
                <span className="text-xs text-gray-500">
                    Joined {new Date(member.joinDate).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric',
                        year: 'numeric'
                    })}
                </span>
            </div>

            {/* Last Active */}
            <div className="mb-4">
                <p className="text-sm text-gray-600">
                    Last active: <span className="font-medium text-gray-900">{member.lastActive}</span>
                </p>
            </div>

            {/* Actions */}
            <div className="flex space-x-2">
                {onView && (
                    <button
                        onClick={() => onView(member.id)}
                        className="flex-1 px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                        View Details
                    </button>
                )}
                {onEdit && (
                    <button
                        onClick={() => onEdit(member.id)}
                        className="px-3 py-2 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                    >
                        Edit
                    </button>
                )}
                {onRemove && (
                    <button
                        onClick={() => onRemove(member.id)}
                        className="px-3 py-2 text-sm bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                    >
                        Remove
                    </button>
                )}
            </div>
        </div>
    );
};
