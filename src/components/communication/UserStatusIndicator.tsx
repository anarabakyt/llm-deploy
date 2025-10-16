import React, { useState, useEffect } from 'react';

interface User {
    id: string;
    name: string;
    email: string;
    avatar?: string;
    status: 'online' | 'away' | 'offline';
    lastSeen?: string;
    currentActivity?: string;
    isTyping?: boolean;
    role: 'admin' | 'member' | 'viewer';
    department?: string;
    joinDate: string;
    totalQueries: number;
    avgQuality: number;
    totalTokens: number;
    favoriteModel: string;
    recentActivity: string[];
}

interface UserStatusIndicatorProps {
    users: User[];
    onUserClick?: (user: User) => void;
    showActivity?: boolean;
    compact?: boolean;
}

export const UserStatusIndicator: React.FC<UserStatusIndicatorProps> = ({
    users,
    onUserClick,
    showActivity = true,
    compact = false
}) => {
    const [onlineUsers, setOnlineUsers] = useState<User[]>([]);
    const [awayUsers, setAwayUsers] = useState<User[]>([]);
    const [offlineUsers, setOfflineUsers] = useState<User[]>([]);

    useEffect(() => {
        const online = users.filter(user => user.status === 'online');
        const away = users.filter(user => user.status === 'away');
        const offline = users.filter(user => user.status === 'offline');
        
        setOnlineUsers(online);
        setAwayUsers(away);
        setOfflineUsers(offline);
    }, [users]);

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

    const getActivityIcon = (activity?: string) => {
        if (!activity) return null;
        
        if (activity.includes('typing')) return '✍️';
        if (activity.includes('chat')) return '💬';
        if (activity.includes('model')) return '🤖';
        if (activity.includes('analytics')) return '📊';
        return '🔄';
    };

    const UserCard: React.FC<{ user: User }> = ({ user }) => (
        <div
            onClick={() => onUserClick?.(user)}
            className={`flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer ${
                compact ? 'p-2' : 'p-3'
            }`}
        >
            <div className="relative">
                <div className={`w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-sm ${
                    compact ? 'w-6 h-6 text-xs' : 'w-8 h-8 text-sm'
                }`}>
                    {user.avatar}
                </div>
                <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${getStatusColor(user.status)} ${
                    compact ? 'w-2 h-2' : 'w-3 h-3'
                }`}></div>
            </div>
            
            {!compact && (
                <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-gray-900 truncate">
                            {user.name}
                        </p>
                        <div className="flex items-center space-x-2">
                            {user.isTyping && (
                                <div className="flex space-x-1">
                                    <div className="w-1 h-1 bg-blue-500 rounded-full animate-bounce"></div>
                                    <div className="w-1 h-1 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                                    <div className="w-1 h-1 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                                </div>
                            )}
                            {showActivity && user.currentActivity && (
                                <span className="text-xs" title={user.currentActivity}>
                                    {getActivityIcon(user.currentActivity)}
                                </span>
                            )}
                        </div>
                    </div>
                    <p className="text-xs text-gray-500 truncate">
                        {user.email}
                    </p>
                    {showActivity && user.currentActivity && (
                        <p className="text-xs text-blue-600 truncate">
                            {user.currentActivity}
                        </p>
                    )}
                </div>
            )}
        </div>
    );

    if (compact) {
        return (
            <div className="flex items-center space-x-2">
                <div className="flex -space-x-2">
                    {onlineUsers.slice(0, 3).map((user) => (
                        <div key={user.id} className="relative">
                            <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center text-xs border-2 border-white">
                                {user.avatar}
                            </div>
                            <div className={`absolute -bottom-1 -right-1 w-2 h-2 rounded-full border border-white ${getStatusColor(user.status)}`}></div>
                        </div>
                    ))}
                    {users.length > 3 && (
                        <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center text-xs border-2 border-white">
                            +{users.length - 3}
                        </div>
                    )}
                </div>
                <span className="text-sm text-gray-600">
                    {onlineUsers.length} online
                </span>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Online Users */}
            {onlineUsers.length > 0 && (
                <div>
                    <div className="flex items-center space-x-2 mb-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <h4 className="text-sm font-medium text-gray-900">
                            Online ({onlineUsers.length})
                        </h4>
                    </div>
                    <div className="space-y-1">
                        {onlineUsers.map((user) => (
                            <UserCard key={user.id} user={user} />
                        ))}
                    </div>
                </div>
            )}

            {/* Away Users */}
            {awayUsers.length > 0 && (
                <div>
                    <div className="flex items-center space-x-2 mb-2">
                        <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                        <h4 className="text-sm font-medium text-gray-900">
                            Away ({awayUsers.length})
                        </h4>
                    </div>
                    <div className="space-y-1">
                        {awayUsers.map((user) => (
                            <UserCard key={user.id} user={user} />
                        ))}
                    </div>
                </div>
            )}

            {/* Offline Users */}
            {offlineUsers.length > 0 && (
                <div>
                    <div className="flex items-center space-x-2 mb-2">
                        <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                        <h4 className="text-sm font-medium text-gray-900">
                            Offline ({offlineUsers.length})
                        </h4>
                    </div>
                    <div className="space-y-1">
                        {offlineUsers.map((user) => (
                            <UserCard key={user.id} user={user} />
                        ))}
                    </div>
                </div>
            )}

            {/* Summary */}
            <div className="pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>Total: {users.length} users</span>
                    <div className="flex items-center space-x-4">
                        <span className="flex items-center space-x-1">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span>{onlineUsers.length}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                            <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                            <span>{awayUsers.length}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                            <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                            <span>{offlineUsers.length}</span>
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};
