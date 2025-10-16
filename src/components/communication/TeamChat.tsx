import React, { useState, useEffect, useRef } from 'react';

interface Message {
    id: string;
    senderId: string;
    senderName: string;
    senderAvatar?: string;
    content: string;
    timestamp: string;
    type: 'text' | 'file' | 'system' | 'announcement';
    isRead: boolean;
    reactions?: { emoji: string; users: string[] }[];
    replyTo?: string;
}

interface User {
    id: string;
    name: string;
    email: string;
    avatar?: string;
    status: 'online' | 'away' | 'offline';
}

interface TeamChatProps {
    currentUserId: string;
    users: User[];
    onMessageSend: (message: Message) => void;
    onFileUpload: (file: File) => void;
    onReactionAdd: (messageId: string, emoji: string) => void;
    onReactionRemove: (messageId: string, emoji: string) => void;
}

export const TeamChat: React.FC<TeamChatProps> = ({
    currentUserId,
    users,
    onMessageSend,
    onFileUpload,
    onReactionAdd,
    onReactionRemove
}) => {
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState<Message[]>([]);
    const [isTyping, setIsTyping] = useState(false);
    const [typingUsers, setTypingUsers] = useState<string[]>([]);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [selectedMessage, setSelectedMessage] = useState<string | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Mock messages data
    const mockMessages: Message[] = [
        {
            id: '1',
            senderId: '1',
            senderName: 'John Smith',
            senderAvatar: '👨‍💼',
            content: 'Hey team! I just tried the new context-aware LLM selection and it\'s amazing!',
            timestamp: '10:30 AM',
            type: 'text',
            isRead: true,
            reactions: [
                { emoji: '👍', users: ['2', '3'] },
                { emoji: '🚀', users: ['1'] }
            ]
        },
        {
            id: '2',
            senderId: '2',
            senderName: 'Sarah Johnson',
            senderAvatar: '👩‍💻',
            content: 'I agree! The Best mode has been selecting perfect models for my queries.',
            timestamp: '10:32 AM',
            type: 'text',
            isRead: true,
            replyTo: '1'
        },
        {
            id: '3',
            senderId: 'system',
            senderName: 'System',
            senderAvatar: '🤖',
            content: 'Mike Chen joined the team chat',
            timestamp: '10:35 AM',
            type: 'system',
            isRead: true
        },
        {
            id: '4',
            senderId: '3',
            senderName: 'Mike Chen',
            senderAvatar: '👨‍🔬',
            content: 'Thanks for the invite! I\'m excited to try out the new features.',
            timestamp: '10:36 AM',
            type: 'text',
            isRead: true
        },
        {
            id: '5',
            senderId: '1',
            senderName: 'John Smith',
            senderAvatar: '👨‍💼',
            content: 'Welcome Mike! You should definitely check out the Green mode for token efficiency.',
            timestamp: '10:38 AM',
            type: 'text',
            isRead: true,
            reactions: [
                { emoji: '💚', users: ['2', '3'] }
            ]
        }
    ];

    useEffect(() => {
        setMessages(mockMessages);
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleSendMessage = () => {
        if (!message.trim()) return;

        const newMessage: Message = {
            id: Date.now().toString(),
            senderId: currentUserId,
            senderName: 'You',
            senderAvatar: '👤',
            content: message,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            type: 'text',
            isRead: true,
            reactions: []
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

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            onFileUpload(file);
        }
    };

    const handleReaction = (messageId: string, emoji: string) => {
        const message = messages.find(m => m.id === messageId);
        if (!message) return;

        const existingReaction = message.reactions?.find(r => r.emoji === emoji);
        if (existingReaction) {
            if (existingReaction.users.includes(currentUserId)) {
                onReactionRemove(messageId, emoji);
            } else {
                onReactionAdd(messageId, emoji);
            }
        } else {
            onReactionAdd(messageId, emoji);
        }
    };

    const getMessageStyle = (message: Message) => {
        if (message.type === 'system') {
            return 'text-center text-gray-500 text-sm italic';
        }
        if (message.senderId === currentUserId) {
            return 'flex justify-end';
        }
        return 'flex justify-start';
    };

    const getMessageBubbleStyle = (message: Message) => {
        if (message.type === 'system') {
            return 'text-center text-gray-500 text-sm italic py-2';
        }
        if (message.senderId === currentUserId) {
            return 'bg-blue-500 text-white max-w-xs lg:max-w-md px-4 py-2 rounded-lg';
        }
        return 'bg-gray-100 text-gray-900 max-w-xs lg:max-w-md px-4 py-2 rounded-lg';
    };

    const emojis = ['👍', '👎', '❤️', '😂', '😮', '😢', '😡', '🚀', '💚', '🔥'];

    return (
        <div className="h-full flex flex-col bg-white rounded-lg shadow-sm border border-gray-200">
            {/* Header */}
            <div className="p-4 border-b border-gray-200 bg-gray-50">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900">Team Chat</h3>
                        <p className="text-sm text-gray-600">
                            {users.filter(u => u.status === 'online').length} online • {users.length} total members
                        </p>
                    </div>
                    <div className="flex items-center space-x-2">
                        <div className="flex -space-x-2">
                            {users.slice(0, 3).map((user) => (
                                <div key={user.id} className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-sm border-2 border-white">
                                    {user.avatar}
                                </div>
                            ))}
                            {users.length > 3 && (
                                <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-sm border-2 border-white">
                                    +{users.length - 3}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                    <div key={message.id} className={getMessageStyle(message)}>
                        {message.type === 'system' ? (
                            <div className={getMessageBubbleStyle(message)}>
                                {message.content}
                            </div>
                        ) : (
                            <div className="max-w-xs lg:max-w-md">
                                {message.replyTo && (
                                    <div className="text-xs text-gray-500 mb-1">
                                        Replying to {messages.find(m => m.id === message.replyTo)?.senderName}
                                    </div>
                                )}
                                <div className="flex items-start space-x-2">
                                    {message.senderId !== currentUserId && (
                                        <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-sm flex-shrink-0">
                                            {message.senderAvatar}
                                        </div>
                                    )}
                                    <div className="flex-1">
                                        <div className="flex items-center space-x-2 mb-1">
                                            <span className="text-xs font-medium text-gray-700">
                                                {message.senderName}
                                            </span>
                                            <span className="text-xs text-gray-500">
                                                {message.timestamp}
                                            </span>
                                        </div>
                                        <div className={getMessageBubbleStyle(message)}>
                                            {message.content}
                                        </div>
                                        {message.reactions && message.reactions.length > 0 && (
                                            <div className="flex flex-wrap gap-1 mt-2">
                                                {message.reactions.map((reaction, index) => (
                                                    <button
                                                        key={index}
                                                        onClick={() => handleReaction(message.id, reaction.emoji)}
                                                        className={`px-2 py-1 text-xs rounded-full border transition-colors ${
                                                            reaction.users.includes(currentUserId)
                                                                ? 'bg-blue-100 border-blue-300 text-blue-700'
                                                                : 'bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200'
                                                        }`}
                                                    >
                                                        {reaction.emoji} {reaction.users.length}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
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
                <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-gray-200">
                <div className="flex space-x-2">
                    <input
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Type a message..."
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <button
                        onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                        className="px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        😊
                    </button>
                    <label className="px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer">
                        📎
                        <input
                            type="file"
                            onChange={handleFileUpload}
                            className="hidden"
                        />
                    </label>
                    <button
                        onClick={handleSendMessage}
                        disabled={!message.trim()}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        Send
                    </button>
                </div>

                {/* Emoji Picker */}
                {showEmojiPicker && (
                    <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                        <div className="flex flex-wrap gap-2">
                            {emojis.map((emoji) => (
                                <button
                                    key={emoji}
                                    onClick={() => {
                                        setMessage(prev => prev + emoji);
                                        setShowEmojiPicker(false);
                                    }}
                                    className="w-8 h-8 text-lg hover:bg-gray-200 rounded transition-colors"
                                >
                                    {emoji}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
