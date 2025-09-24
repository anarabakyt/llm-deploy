import React from 'react';
import type { Model, Chat } from '../entities';
import { SidebarChatItem } from './SidebarChatItem';

interface SidebarModelItemProps {
  model: Model;
  chats: Chat[];
  isExpanded: boolean;
  onToggle: (modelId: string) => void;
  onChatSelect: (chatId: string) => void;
  onNewChat: (modelId: string) => void;
  onChatDelete?: (chatId: string) => void;
  activeChatId?: string;
}

export const SidebarModelItem: React.FC<SidebarModelItemProps> = ({
  model,
  chats,
  isExpanded,
  onToggle,
  onChatSelect,
  onNewChat,
  onChatDelete,
  activeChatId,
}) => {
  return (
    <div className="mb-2">
      <div
        className="flex items-center justify-between p-2 rounded-md cursor-pointer hover:bg-gray-100 transition-colors"
        onClick={() => onToggle(model.id)}
      >
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-gray-700">
            {model.name}
          </span>
          {model.isFixed && (
            <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
              Фиксированный
            </span>
          )}
        </div>
        
        <div className="flex items-center space-x-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onNewChat(model.id);
            }}
            className="p-1 text-gray-400 hover:text-blue-500 transition-colors"
            title="Новый чат"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
          
          <svg
            className={`w-4 h-4 text-gray-400 transition-transform ${
              isExpanded ? 'rotate-90' : ''
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
      
      {isExpanded && (
        <div className="ml-4 mt-1 space-y-1">
          {chats.map((chat) => (
            <SidebarChatItem
              key={chat.id}
              chat={chat}
              isActive={chat.id === activeChatId}
              onClick={() => onChatSelect(chat.id || '')}
              onDelete={() => onChatDelete?.(chat.id || '')}
            />
          ))}
        </div>
      )}
    </div>
  );
};
