import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../config/hooks.ts';
import type { User } from '../entities';

interface InviteUsersModalProps {
    isOpen: boolean;
    onClose: () => void;
    onInvite: (userIds: string[]) => void;
    currentChatId: string | null;
}

export const InviteUsersModal: React.FC<InviteUsersModalProps> = ({
    isOpen,
    onClose,
    onInvite,
    currentChatId
}) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<User[]>([]);
    const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
    const [isSearching, setIsSearching] = useState(false);

    // Mock user search - replace with real API call
    const searchUsers = async (query: string) => {
        if (query.length < 2) {
            setSearchResults([]);
            return;
        }

        setIsSearching(true);
        // Simulate API call
        setTimeout(() => {
            const mockUsers: User[] = [
                {
                    id: 'user1',
                    email: 'john@example.com',
                    name: 'John Doe',
                    avatarUrl: 'https://via.placeholder.com/40'
                },
                {
                    id: 'user2',
                    email: 'jane@example.com',
                    name: 'Jane Smith',
                    avatarUrl: 'https://via.placeholder.com/40'
                },
                {
                    id: 'user3',
                    email: 'bob@example.com',
                    name: 'Bob Johnson',
                    avatarUrl: 'https://via.placeholder.com/40'
                }
            ].filter(user => 
                user.name.toLowerCase().includes(query.toLowerCase()) ||
                user.email.toLowerCase().includes(query.toLowerCase())
            );
            setSearchResults(mockUsers);
            setIsSearching(false);
        }, 500);
    };

    useEffect(() => {
        if (isOpen) {
            setSearchQuery('');
            setSearchResults([]);
            setSelectedUsers([]);
        }
    }, [isOpen]);

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            searchUsers(searchQuery);
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [searchQuery]);

    const handleUserSelect = (user: User) => {
        if (!selectedUsers.find(u => u.id === user.id)) {
            setSelectedUsers([...selectedUsers, user]);
        }
    };

    const handleUserRemove = (userId: string) => {
        setSelectedUsers(selectedUsers.filter(u => u.id !== userId));
    };

    const handleInvite = () => {
        if (selectedUsers.length > 0) {
            onInvite(selectedUsers.map(u => u.id));
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[80vh] flex flex-col">
                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-gray-900">Invite Users to Chat</h3>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
                        </svg>
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-hidden flex flex-col">
                    {/* Search */}
                    <div className="p-6 border-b border-gray-200">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search users by name or email..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            {isSearching && (
                                <div className="absolute right-3 top-2.5">
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Search Results */}
                    <div className="flex-1 overflow-y-auto p-6">
                        {searchQuery.length >= 2 && (
                            <div className="space-y-2">
                                <h4 className="text-sm font-medium text-gray-700 mb-3">Search Results</h4>
                                {searchResults.length > 0 ? (
                                    searchResults.map((user) => (
                                        <div
                                            key={user.id}
                                            onClick={() => handleUserSelect(user)}
                                            className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-blue-50 transition-colors"
                                        >
                                            <img
                                                src={user.avatarUrl || 'https://via.placeholder.com/40'}
                                                alt={user.name}
                                                className="w-10 h-10 rounded-full mr-3"
                                            />
                                            <div className="flex-1">
                                                <p className="font-medium text-gray-900">{user.name}</p>
                                                <p className="text-sm text-gray-500">{user.email}</p>
                                            </div>
                                            <button className="text-blue-500 hover:text-blue-700">
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
                                                </svg>
                                            </button>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-gray-500 text-center py-4">No users found</p>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Selected Users */}
                    {selectedUsers.length > 0 && (
                        <div className="p-6 border-t border-gray-200">
                            <h4 className="text-sm font-medium text-gray-700 mb-3">Selected Users</h4>
                            <div className="space-y-2">
                                {selectedUsers.map((user) => (
                                    <div
                                        key={user.id}
                                        className="flex items-center p-2 bg-blue-50 border border-blue-200 rounded-lg"
                                    >
                                        <img
                                            src={user.avatarUrl || 'https://via.placeholder.com/32'}
                                            alt={user.name}
                                            className="w-8 h-8 rounded-full mr-3"
                                        />
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-gray-900">{user.name}</p>
                                            <p className="text-xs text-gray-500">{user.email}</p>
                                        </div>
                                        <button
                                            onClick={() => handleUserRemove(user.id)}
                                            className="text-red-500 hover:text-red-700"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
                                            </svg>
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleInvite}
                        disabled={selectedUsers.length === 0}
                        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                    >
                        Invite {selectedUsers.length > 0 ? `(${selectedUsers.length})` : ''}
                    </button>
                </div>
            </div>
        </div>
    );
};
