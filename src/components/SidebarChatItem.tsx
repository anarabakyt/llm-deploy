import React from 'react';
import type { Chat } from '../entities';

interface SidebarChatItemProps {
  chat: Chat;
  isActive: boolean;
  onClick: () => void;
  onDelete?: () => void;
}

export const SidebarChatItem: React.FC<SidebarChatItemProps> = ({
  chat,
  isActive,
  onClick,
  onDelete,
}) => {
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete?.();
  };

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
      
      {onDelete && (
        <button
          onClick={handleDelete}
          className="ml-2 p-1 text-gray-400 hover:text-red-500 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      )}
    </div>
  );
};
