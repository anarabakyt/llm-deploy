import React, { useState, useEffect } from 'react';

interface Message {
    id: string;
    senderId: string;
    senderName: string;
    senderAvatar?: string;
    content: string;
    timestamp: string;
    isRead: boolean;
    type: 'text' | 'file' | 'system';
}

interface User {
    id: string;
    name: string;
    email: string;
    avatar?: string;
    status: 'online' | 'away' | 'offline';
    lastSeen?: string;
}

interface UserMessagingProps {
    currentUserId: string;
    onMessageSend: (message: Message) => void;
    onFileUpload: (file: File) => void;
}

export const UserMessaging: React.FC<UserMessagingProps> = ({
    currentUserId,
    onMessageSend,
    onFileUpload
}) => {
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState<Message[]>([]);
    const [isTyping, setIsTyping] = useState(false);

    // Mock users data
    const users: User[] = [
        {
            id: '1',
            name: 'John Smith',
            email: 'john@company.com',
            avatar: '👨‍💼',
            status: 'online',
            lastSeen: '2 minutes ago'
        },
        {
            id: '2',
            name: 'Sarah Johnson',
            email: 'sarah@company.com',
            avatar: '👩‍💻',
            status: 'away',
            lastSeen: '1 hour ago'
        },
        {
            id: '3',
            name: 'Mike Chen',
            email: 'mike@company.com',
            avatar: '👨‍🔬',
            status: 'offline',
            lastSeen: 'Yesterday'
        }
    ];

    // Mock messages data
    const mockMessages: Message[] = [
        {
            id: '1',
            senderId: '1',
            senderName: 'John Smith',
            senderAvatar: '👨‍💼',
            content: 'Hey! How\'s the new LLM model working for you?',
            timestamp: '2 minutes ago',
            isRead: true,
            type: 'text'
        },
        {
            id: '2',
            senderId: currentUserId,
            senderName: 'You',
            senderAvatar: '👤',
            content: 'It\'s great! The context-aware selection is really helpful.',
            timestamp: '1 minute ago',
            isRead: true,
            type: 'text'
        },
        {
            id: '3',
            senderId: '1',
            senderName: 'John Smith',
            senderAvatar: '👨‍💼',
            content: 'Awesome! I\'ve been using the Best mode and it\'s been selecting the perfect models.',
            timestamp: '30 seconds ago',
            isRead: false,
            type: 'text'
        }
    ];

    useEffect(() => {
        if (selectedUser) {
            setMessages(mockMessages.filter(msg => 
                msg.senderId === selectedUser.id || msg.senderId === currentUserId
            ));
        }
    }, [selectedUser, currentUserId]);

    const handleSendMessage = () => {
        if (!message.trim() || !selectedUser) return;

        const newMessage: Message = {
            id: Date.now().toString(),
            senderId: currentUserId,
            senderName: 'You',
            senderAvatar: '👤',
            content: message,
            timestamp: 'Just now',
            isRead: true,
            type: 'text'
        };

        setMessages(prev => [...prev, newMessage]);
        onMessageSend(newMessage);
        setMessage('');
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

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

    return (
        <div className="h-full flex bg-white rounded-lg shadow-sm border border-gray-200">
            {/* Users List */}
            <div className="w-1/3 border-r border-gray-200 flex flex-col">
                <div className="p-4 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900">Team Members</h3>
                    <p className="text-sm text-gray-600">Select a user to start messaging</p>
                </div>
                
                <div className="flex-1 overflow-y-auto">
                    {users.map((user) => (
                        <div
                            key={user.id}
                            onClick={() => setSelectedUser(user)}
                            className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                                selectedUser?.id === user.id ? 'bg-blue-50 border-blue-200' : ''
                            }`}
                        >
                            <div className="flex items-center space-x-3">
                                <div className="relative">
                                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-lg">
                                        {user.avatar}
                                    </div>
                                    <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${getStatusColor(user.status)}`}></div>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between">
                                        <p className="text-sm font-medium text-gray-900 truncate">
                                            {user.name}
                                        </p>
                                        <span className="text-xs text-gray-500">
                                            {getStatusText(user.status)}
                                        </span>
                                    </div>
                                    <p className="text-xs text-gray-500 truncate">
                                        {user.email}
                                    </p>
                                    <p className="text-xs text-gray-400">
                                        Last seen: {user.lastSeen}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 flex flex-col">
                {selectedUser ? (
                    <>
                        {/* Chat Header */}
                        <div className="p-4 border-b border-gray-200 bg-gray-50">
                            <div className="flex items-center space-x-3">
                                <div className="relative">
                                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-lg">
                                        {selectedUser.avatar}
                                    </div>
                                    <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${getStatusColor(selectedUser.status)}`}></div>
                                </div>
                                <div>
                                    <h4 className="text-lg font-medium text-gray-900">
                                        {selectedUser.name}
                                    </h4>
                                    <p className="text-sm text-gray-600">
                                        {getStatusText(selectedUser.status)} • {selectedUser.lastSeen}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            {messages.map((msg) => (
                                <div
                                    key={msg.id}
                                    className={`flex ${msg.senderId === currentUserId ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                                        msg.senderId === currentUserId
                                            ? 'bg-blue-500 text-white'
                                            : 'bg-gray-100 text-gray-900'
                                    }`}>
                                        <div className="flex items-center space-x-2 mb-1">
                                            <span className="text-xs font-medium opacity-75">
                                                {msg.senderName}
                                            </span>
                                            <span className="text-xs opacity-75">
                                                {msg.timestamp}
                                            </span>
                                        </div>
                                        <p className="text-sm">{msg.content}</p>
                                        {!msg.isRead && msg.senderId !== currentUserId && (
                                            <div className="text-xs opacity-75 mt-1">
                                                • Unread
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                            
                            {isTyping && (
                                <div className="flex justify-start">
                                    <div className="bg-gray-100 text-gray-900 px-4 py-2 rounded-lg">
                                        <div className="flex space-x-1">
                                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Message Input */}
                        <div className="p-4 border-t border-gray-200">
                            <div className="flex space-x-2">
                                <input
                                    type="text"
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                    placeholder={`Message ${selectedUser.name}...`}
                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                                <button
                                    onClick={handleSendMessage}
                                    disabled={!message.trim()}
                                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    Send
                                </button>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex items-center justify-center">
                        <div className="text-center">
                            <div className="text-6xl mb-4">💬</div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">
                                Select a team member
                            </h3>
                            <p className="text-gray-600">
                                Choose someone from the list to start messaging
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
