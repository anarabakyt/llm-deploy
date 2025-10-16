import React, { useState, useEffect } from 'react';

interface Notification {
    id: string;
    type: 'info' | 'success' | 'warning' | 'error' | 'mention';
    title: string;
    message: string;
    timestamp: string;
    isRead: boolean;
    senderId?: string;
    senderName?: string;
    actionUrl?: string;
    priority: 'low' | 'medium' | 'high';
}

interface NotificationCenterProps {
    notifications: Notification[];
    onNotificationClick: (notification: Notification) => void;
    onMarkAsRead: (notificationId: string) => void;
    onMarkAllAsRead: () => void;
    onClearAll: () => void;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({
    notifications,
    onNotificationClick,
    onMarkAsRead,
    onMarkAllAsRead,
    onClearAll
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [filter, setFilter] = useState<'all' | 'unread' | 'mentions'>('all');
    const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'priority'>('newest');

    const unreadCount = notifications.filter(n => !n.isRead).length;
    const mentionCount = notifications.filter(n => n.type === 'mention' && !n.isRead).length;

    const filteredNotifications = notifications.filter(notification => {
        if (filter === 'unread') return !notification.isRead;
        if (filter === 'mentions') return notification.type === 'mention';
        return true;
    });

    const sortedNotifications = [...filteredNotifications].sort((a, b) => {
        if (sortBy === 'newest') return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
        if (sortBy === 'oldest') return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
        if (sortBy === 'priority') {
            const priorityOrder = { high: 3, medium: 2, low: 1 };
            return priorityOrder[b.priority] - priorityOrder[a.priority];
        }
        return 0;
    });

    const getNotificationIcon = (type: string) => {
        switch (type) {
            case 'info': return 'ℹ️';
            case 'success': return '✅';
            case 'warning': return '⚠️';
            case 'error': return '❌';
            case 'mention': return '👤';
            default: return '📢';
        }
    };

    const getNotificationColor = (type: string) => {
        switch (type) {
            case 'info': return 'text-blue-600 bg-blue-50 border-blue-200';
            case 'success': return 'text-green-600 bg-green-50 border-green-200';
            case 'warning': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
            case 'error': return 'text-red-600 bg-red-50 border-red-200';
            case 'mention': return 'text-purple-600 bg-purple-50 border-purple-200';
            default: return 'text-gray-600 bg-gray-50 border-gray-200';
        }
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'high': return 'border-l-red-500';
            case 'medium': return 'border-l-yellow-500';
            case 'low': return 'border-l-gray-300';
            default: return 'border-l-gray-300';
        }
    };

    const formatTimestamp = (timestamp: string) => {
        const now = new Date();
        const notificationTime = new Date(timestamp);
        const diffInMinutes = Math.floor((now.getTime() - notificationTime.getTime()) / (1000 * 60));
        
        if (diffInMinutes < 1) return 'Just now';
        if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
        if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
        return notificationTime.toLocaleDateString();
    };

    return (
        <div className="relative">
            {/* Notification Bell */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5-5 5-5h-5m-6 0H4l5 5-5 5h5m6-10v10" />
                </svg>
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                        {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                )}
            </button>

            {/* Notification Panel */}
            {isOpen && (
                <div className="absolute right-0 top-full mt-2 w-96 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                    {/* Header */}
                    <div className="p-4 border-b border-gray-200">
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="text-lg font-semibold text-gray-900">
                                Notifications
                            </h3>
                            <div className="flex items-center space-x-2">
                                {unreadCount > 0 && (
                                    <button
                                        onClick={onMarkAllAsRead}
                                        className="text-sm text-blue-600 hover:text-blue-800"
                                    >
                                        Mark all read
                                    </button>
                                )}
                                <button
                                    onClick={onClearAll}
                                    className="text-sm text-gray-600 hover:text-gray-800"
                                >
                                    Clear all
                                </button>
                            </div>
                        </div>

                        {/* Filters */}
                        <div className="flex space-x-2 mb-3">
                            {[
                                { key: 'all', label: 'All', count: notifications.length },
                                { key: 'unread', label: 'Unread', count: unreadCount },
                                { key: 'mentions', label: 'Mentions', count: mentionCount }
                            ].map((filterOption) => (
                                <button
                                    key={filterOption.key}
                                    onClick={() => setFilter(filterOption.key as any)}
                                    className={`px-3 py-1 text-xs rounded-full transition-colors ${
                                        filter === filterOption.key
                                            ? 'bg-blue-100 text-blue-700'
                                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                                >
                                    {filterOption.label} ({filterOption.count})
                                </button>
                            ))}
                        </div>

                        {/* Sort */}
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value as any)}
                            className="w-full px-3 py-1 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="newest">Newest first</option>
                            <option value="oldest">Oldest first</option>
                            <option value="priority">Priority</option>
                        </select>
                    </div>

                    {/* Notifications List */}
                    <div className="max-h-96 overflow-y-auto">
                        {sortedNotifications.length === 0 ? (
                            <div className="p-8 text-center">
                                <div className="text-4xl mb-2">🔔</div>
                                <p className="text-gray-600">No notifications</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-gray-100">
                                {sortedNotifications.map((notification) => (
                                    <div
                                        key={notification.id}
                                        onClick={() => {
                                            onNotificationClick(notification);
                                            if (!notification.isRead) {
                                                onMarkAsRead(notification.id);
                                            }
                                        }}
                                        className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors border-l-4 ${getPriorityColor(notification.priority)} ${
                                            !notification.isRead ? 'bg-blue-50' : ''
                                        }`}
                                    >
                                        <div className="flex items-start space-x-3">
                                            <div className="flex-shrink-0">
                                                <span className="text-lg">
                                                    {getNotificationIcon(notification.type)}
                                                </span>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center justify-between">
                                                    <p className={`text-sm font-medium ${getNotificationColor(notification.type).split(' ')[0]}`}>
                                                        {notification.title}
                                                    </p>
                                                    <div className="flex items-center space-x-2">
                                                        {!notification.isRead && (
                                                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                                        )}
                                                        <span className="text-xs text-gray-500">
                                                            {formatTimestamp(notification.timestamp)}
                                                        </span>
                                                    </div>
                                                </div>
                                                <p className="text-sm text-gray-600 mt-1">
                                                    {notification.message}
                                                </p>
                                                {notification.senderName && (
                                                    <p className="text-xs text-gray-500 mt-1">
                                                        From: {notification.senderName}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="p-4 border-t border-gray-200 bg-gray-50">
                        <div className="flex items-center justify-between text-sm text-gray-600">
                            <span>
                                {unreadCount} unread of {notifications.length} total
                            </span>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="text-blue-600 hover:text-blue-800"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
