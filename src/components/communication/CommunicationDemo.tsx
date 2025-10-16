import React, { useState, useEffect } from 'react';
import { UserMessaging } from './UserMessaging';
import { UserStatusIndicator } from './UserStatusIndicator';
import { NotificationCenter } from './NotificationCenter';
import { UserProfile } from './UserProfile';
import { TeamChat } from './TeamChat';
import { CollaborationWorkspace } from './CollaborationWorkspace';

interface CommunicationUser {
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
    currentActivity?: string;
    isTyping?: boolean;
}

interface Message {
    id: string;
    senderId: string;
    senderName: string;
    senderAvatar?: string;
    content: string;
    timestamp: string;
    isRead: boolean;
    type: 'text' | 'file' | 'system' | 'announcement';
}

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

export const CommunicationDemo: React.FC = () => {
    const [currentView, setCurrentView] = useState<'messaging' | 'team-chat' | 'workspace' | 'profile'>('messaging');
    const [selectedUser, setSelectedUser] = useState<CommunicationUser | null>(null);
    const [notifications, setNotifications] = useState<Notification[]>([]);


    // Mock users data
    const users: CommunicationUser[] = [
        {
            id: '1',
            name: 'John Smith',
            email: 'john@company.com',
            avatar: '👨‍💼',
            status: 'online',
            lastSeen: '2 minutes ago',
            role: 'admin',
            department: 'Engineering',
            joinDate: '2024-01-15',
            totalQueries: 1250,
            avgQuality: 92,
            totalTokens: 45000,
            favoriteModel: 'GPT-4',
            recentActivity: [
                'Used Best mode for analysis',
                'Shared prompt template',
                'Completed model comparison'
            ],
            currentActivity: 'Working on prompt analysis',
            isTyping: false
        },
        {
            id: '2',
            name: 'Sarah Johnson',
            email: 'sarah@company.com',
            avatar: '👩‍💻',
            status: 'away',
            lastSeen: '1 hour ago',
            role: 'member',
            department: 'Marketing',
            joinDate: '2024-02-01',
            totalQueries: 890,
            avgQuality: 88,
            totalTokens: 32000,
            favoriteModel: 'Claude-3',
            recentActivity: [
                'Created customer support prompts',
                'Analyzed user feedback',
                'Updated documentation'
            ],
            currentActivity: 'Typing in team chat',
            isTyping: true
        },
        {
            id: '3',
            name: 'Mike Chen',
            email: 'mike@company.com',
            avatar: '👨‍🔬',
            status: 'offline',
            lastSeen: 'Yesterday',
            role: 'member',
            department: 'Research',
            joinDate: '2024-01-20',
            totalQueries: 650,
            avgQuality: 95,
            totalTokens: 28000,
            favoriteModel: 'GPT-3.5',
            recentActivity: [
                'Tested new model features',
                'Generated research reports',
                'Collaborated on analysis'
            ],
            currentActivity: undefined,
            isTyping: false
        }
    ];

    // Mock notifications
    const mockNotifications: Notification[] = [
        {
            id: '1',
            type: 'mention',
            title: 'You were mentioned',
            message: 'John Smith mentioned you in a team chat',
            timestamp: '5 minutes ago',
            isRead: false,
            senderId: '1',
            senderName: 'John Smith',
            priority: 'medium'
        },
        {
            id: '2',
            type: 'success',
            title: 'Model analysis completed',
            message: 'Your LLM model comparison analysis is ready',
            timestamp: '1 hour ago',
            isRead: true,
            priority: 'low'
        },
        {
            id: '3',
            type: 'info',
            title: 'New user joined',
            message: 'Mike Chen joined the team',
            timestamp: '2 hours ago',
            isRead: true,
            priority: 'low'
        },
        {
            id: '4',
            type: 'warning',
            title: 'Token limit approaching',
            message: 'You\'ve used 80% of your monthly token limit',
            timestamp: '3 hours ago',
            isRead: false,
            priority: 'high'
        }
    ];

    useEffect(() => {
        setNotifications(mockNotifications);
    }, []);

    const handleMessageSend = (message: Message) => {
        console.log('Message sent:', message);
    };

    const handleFileUpload = (file: File) => {
        console.log('File uploaded:', file);
    };

    const handleUserClick = (user: CommunicationUser) => {
        setSelectedUser(user);
        setCurrentView('profile');
    };

    const handleNotificationClick = (notification: Notification) => {
        console.log('Notification clicked:', notification);
        // Mark as read
        setNotifications(prev => 
            prev.map(n => n.id === notification.id ? { ...n, isRead: true } : n)
        );
    };

    const handleMarkAsRead = (notificationId: string) => {
        setNotifications(prev => 
            prev.map(n => n.id === notificationId ? { ...n, isRead: true } : n)
        );
    };

    const handleMarkAllAsRead = () => {
        setNotifications(prev => 
            prev.map(n => ({ ...n, isRead: true }))
        );
    };

    const handleClearAll = () => {
        setNotifications([]);
    };

    const handleReactionAdd = (messageId: string, emoji: string) => {
        console.log('Reaction added:', messageId, emoji);
    };

    const handleReactionRemove = (messageId: string, emoji: string) => {
        console.log('Reaction removed:', messageId, emoji);
    };

    const handleItemSelect = (item: any) => {
        console.log('Item selected:', item);
    };

    const handleItemCreate = (item: any) => {
        console.log('Item created:', item);
    };

    const handleItemShare = (itemId: string, userIds: string[]) => {
        console.log('Item shared:', itemId, userIds);
    };

    const handleItemUpdate = (itemId: string, updates: any) => {
        console.log('Item updated:', itemId, updates);
    };

    const handleEditProfile = (user: CommunicationUser) => {
        console.log('Edit profile:', user);
    };

    const handleSendMessage = (user: CommunicationUser) => {
        setSelectedUser(user);
        setCurrentView('messaging');
    };

    const handleViewActivity = (user: CommunicationUser) => {
        console.log('View activity:', user);
    };

    return (
        <div className="h-screen bg-gray-50 overflow-y-auto flex">
            {/* Debug info */}
            <div className="fixed top-4 right-4 bg-blue-100 text-blue-800 p-2 rounded text-xs z-50">
                Communication Demo - View: {currentView}
            </div>
            {/* Sidebar */}
            <div className="w-64 bg-white shadow-lg border-r border-gray-200 flex flex-col">
                <div className="p-6 border-b border-gray-200">
                    <h1 className="text-xl font-bold text-gray-900 mb-2">Communication</h1>
                    <p className="text-sm text-gray-600">Team collaboration tools</p>
                </div>
                
                <nav className="flex-1 p-4">
                    <ul className="space-y-2">
                        <li>
                            <button
                                onClick={() => setCurrentView('messaging')}
                                className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors ${
                                    currentView === 'messaging'
                                        ? 'bg-blue-100 text-blue-700 border border-blue-200'
                                        : 'text-gray-700 hover:bg-gray-100'
                                }`}
                            >
                                <span className="text-lg mr-3">💬</span>
                                <span className="font-medium">Direct Messages</span>
                            </button>
                        </li>
                        <li>
                            <button
                                onClick={() => setCurrentView('team-chat')}
                                className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors ${
                                    currentView === 'team-chat'
                                        ? 'bg-blue-100 text-blue-700 border border-blue-200'
                                        : 'text-gray-700 hover:bg-gray-100'
                                }`}
                            >
                                <span className="text-lg mr-3">👥</span>
                                <span className="font-medium">Team Chat</span>
                            </button>
                        </li>
                        <li>
                            <button
                                onClick={() => setCurrentView('workspace')}
                                className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors ${
                                    currentView === 'workspace'
                                        ? 'bg-blue-100 text-blue-700 border border-blue-200'
                                        : 'text-gray-700 hover:bg-gray-100'
                                }`}
                            >
                                <span className="text-lg mr-3">📁</span>
                                <span className="font-medium">Workspace</span>
                            </button>
                        </li>
                        <li>
                            <button
                                onClick={() => setCurrentView('profile')}
                                className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors ${
                                    currentView === 'profile'
                                        ? 'bg-blue-100 text-blue-700 border border-blue-200'
                                        : 'text-gray-700 hover:bg-gray-100'
                                }`}
                            >
                                <span className="text-lg mr-3">👤</span>
                                <span className="font-medium">User Profiles</span>
                            </button>
                        </li>
                    </ul>
                </nav>

                {/* User Status */}
                <div className="p-4 border-t border-gray-200">
                    <UserStatusIndicator
                        users={users}
                        onUserClick={handleUserClick}
                        compact={true}
                    />
                </div>

                {/* Notifications */}
                <div className="p-4 border-t border-gray-200">
                    <NotificationCenter
                        notifications={notifications}
                        onNotificationClick={handleNotificationClick}
                        onMarkAsRead={handleMarkAsRead}
                        onMarkAllAsRead={handleMarkAllAsRead}
                        onClearAll={handleClearAll}
                    />
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-hidden">
                {currentView === 'messaging' && (
                    <UserMessaging
                        currentUserId="current-user"
                        onMessageSend={handleMessageSend}
                        onFileUpload={handleFileUpload}
                    />
                )}

                {currentView === 'team-chat' && (
                    <TeamChat
                        currentUserId="current-user"
                        users={users}
                        onMessageSend={handleMessageSend}
                        onFileUpload={handleFileUpload}
                        onReactionAdd={handleReactionAdd}
                        onReactionRemove={handleReactionRemove}
                    />
                )}

                {currentView === 'workspace' && (
                    <CollaborationWorkspace
                        currentUserId="current-user"
                        onItemSelect={handleItemSelect}
                        onItemCreate={handleItemCreate}
                        onItemShare={handleItemShare}
                        onItemUpdate={handleItemUpdate}
                    />
                )}

                {currentView === 'profile' && (
                    <div className="h-full overflow-y-auto p-6">
                        {selectedUser ? (
                            <UserProfile
                                user={selectedUser}
                                onEditProfile={handleEditProfile}
                                onSendMessage={handleSendMessage}
                                onViewActivity={handleViewActivity}
                                isEditable={true}
                            />
                        ) : (
                            <div className="text-center">
                                <div className="text-6xl mb-4">👥</div>
                                <h3 className="text-lg font-medium text-gray-900 mb-2">
                                    Select a user
                                </h3>
                                <p className="text-gray-600">
                                    Choose a user from the sidebar to view their profile
                                </p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};
