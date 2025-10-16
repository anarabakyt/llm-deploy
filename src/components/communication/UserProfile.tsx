import React, { useState } from 'react';

interface User {
    id: string;
    name: string;
    email: string;
    avatar?: string;
    status: 'online' | 'away' | 'offline';
    lastSeen?: string;
    role: 'admin' | 'member' | 'viewer';
    department?: string;
    joinDate: string;
    totalQueries: number;
    avgQuality: number;
    totalTokens: number;
    favoriteModel: string;
    recentActivity: string[];
}

interface UserProfileProps {
    user: User;
    onEditProfile: (user: User) => void;
    onSendMessage: (user: User) => void;
    onViewActivity: (user: User) => void;
    isEditable?: boolean;
}

export const UserProfile: React.FC<UserProfileProps> = ({
    user,
    onEditProfile,
    onSendMessage,
    onViewActivity,
    isEditable = false
}) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'online': return 'bg-green-500';
            case 'away': return 'bg-yellow-500';
            case 'offline': return 'bg-gray-400';
            default: return 'bg-gray-400';
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case 'online': return 'Online';
            case 'away': return 'Away';
            case 'offline': return 'Offline';
            default: return 'Unknown';
        }
    };

    const getRoleColor = (role: string) => {
        switch (role) {
            case 'admin': return 'bg-red-100 text-red-800';
            case 'member': return 'bg-blue-100 text-blue-800';
            case 'viewer': return 'bg-gray-100 text-gray-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const formatNumber = (num: number) => {
        if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
        if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
        return num.toString();
    };

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            {/* Header */}
            <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50">
                <div className="flex items-center space-x-4">
                    <div className="relative">
                        <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center text-2xl">
                            {user.avatar || '👤'}
                        </div>
                        <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white ${getStatusColor(user.status)}`}></div>
                    </div>
                    <div className="flex-1">
                        <h2 className="text-2xl font-bold text-gray-900">{user.name}</h2>
                        <p className="text-gray-600">{user.email}</p>
                        <div className="flex items-center space-x-4 mt-2">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                                {user.role}
                            </span>
                            <span className="text-sm text-gray-500">
                                {getStatusText(user.status)} • {user.lastSeen}
                            </span>
                        </div>
                    </div>
                    <div className="flex space-x-2">
                        <button
                            onClick={() => onSendMessage(user)}
                            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                        >
                            Message
                        </button>
                        {isEditable && (
                            <button
                                onClick={() => onEditProfile(user)}
                                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                            >
                                Edit
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Stats */}
            <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Statistics</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">
                            {formatNumber(user.totalQueries)}
                        </div>
                        <div className="text-sm text-gray-600">Total Queries</div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">
                            {user.avgQuality}%
                        </div>
                        <div className="text-sm text-gray-600">Avg Quality</div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl font-bold text-purple-600">
                            {formatNumber(user.totalTokens)}
                        </div>
                        <div className="text-sm text-gray-600">Total Tokens</div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl font-bold text-orange-600">
                            {user.favoriteModel}
                        </div>
                        <div className="text-sm text-gray-600">Favorite Model</div>
                    </div>
                </div>
            </div>

            {/* Details */}
            <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <h4 className="text-sm font-medium text-gray-900 mb-3">Profile Information</h4>
                        <dl className="space-y-2">
                            <div>
                                <dt className="text-sm text-gray-600">Department</dt>
                                <dd className="text-sm text-gray-900">{user.department || 'Not specified'}</dd>
                            </div>
                            <div>
                                <dt className="text-sm text-gray-600">Join Date</dt>
                                <dd className="text-sm text-gray-900">{formatDate(user.joinDate)}</dd>
                            </div>
                            <div>
                                <dt className="text-sm text-gray-600">Role</dt>
                                <dd className="text-sm text-gray-900 capitalize">{user.role}</dd>
                            </div>
                            <div>
                                <dt className="text-sm text-gray-600">Status</dt>
                                <dd className="text-sm text-gray-900">{getStatusText(user.status)}</dd>
                            </div>
                        </dl>
                    </div>
                    
                    <div>
                        <h4 className="text-sm font-medium text-gray-900 mb-3">Recent Activity</h4>
                        <div className="space-y-2">
                            {user.recentActivity.slice(0, 5).map((activity, index) => (
                                <div key={index} className="flex items-center space-x-2 text-sm text-gray-600">
                                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                    <span>{activity}</span>
                                </div>
                            ))}
                            {user.recentActivity.length > 5 && (
                                <button
                                    onClick={() => onViewActivity(user)}
                                    className="text-sm text-blue-600 hover:text-blue-800"
                                >
                                    View all activity →
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Expandable Section */}
            <div className="border-t border-gray-200">
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="w-full px-6 py-4 text-left text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                    <div className="flex items-center justify-between">
                        <span>Detailed Information</span>
                        <svg
                            className={`w-5 h-5 transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </div>
                </button>
                
                {isExpanded && (
                    <div className="px-6 pb-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <h5 className="text-sm font-medium text-gray-900 mb-3">Performance Metrics</h5>
                                <div className="space-y-3">
                                    <div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600">Query Success Rate</span>
                                            <span className="font-medium">94%</span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                                            <div className="bg-green-500 h-2 rounded-full" style={{width: '94%'}}></div>
                                        </div>
                                    </div>
                                    <div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600">Response Time</span>
                                            <span className="font-medium">2.3s avg</span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                                            <div className="bg-blue-500 h-2 rounded-full" style={{width: '76%'}}></div>
                                        </div>
                                    </div>
                                    <div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600">Model Preference</span>
                                            <span className="font-medium">GPT-4 (60%)</span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                                            <div className="bg-purple-500 h-2 rounded-full" style={{width: '60%'}}></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div>
                                <h5 className="text-sm font-medium text-gray-900 mb-3">Usage Patterns</h5>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Peak Usage Time</span>
                                        <span className="text-gray-900">2:00 PM - 4:00 PM</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Most Active Day</span>
                                        <span className="text-gray-900">Tuesday</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Avg Session Length</span>
                                        <span className="text-gray-900">23 minutes</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Last Login</span>
                                        <span className="text-gray-900">{user.lastSeen}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
