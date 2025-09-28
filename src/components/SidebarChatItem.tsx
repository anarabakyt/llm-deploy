import React from 'react';
import type {Chat} from '../entities';

interface SidebarChatItemProps {
    chat: Chat;
    isActive: boolean;
    onClick: () => void;
}

export const SidebarChatItem: React.FC<SidebarChatItemProps> = ({
                                                                    chat,
                                                                    isActive,
                                                                    onClick,
                                                                }) => {

    return (
        <div
            className={`flex items-center justify-between p-2 rounded-md cursor-pointer transition-colors ${
                isActive
                    ? 'bg-blue-100 text-blue-800'
                    : 'hover:bg-gray-100 text-gray-700'
            }`}
            onClick={onClick}
        >
            <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">
                    {chat.localId}
                </p>
                <p className="text-xs text-gray-500">
                    {new Date(chat.createdAt).toLocaleDateString()}
                </p>
            </div>
        </div>
    );
};
