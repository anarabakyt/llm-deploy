import React from 'react';
import {useAppSelector} from '../config/hooks.ts';
import {selectAutoSelectionMode, selectSelectedModelId} from '../store/selector/selectors.ts';
import type {Chat, Model} from '../entities';
import {SidebarChatItem} from './SidebarChatItem';

interface SidebarModelItemProps {
    model: Model;
    chats: Chat[];
    isExpanded: boolean;
    onToggle: (modelId: string) => void;
    onChatSelect: (modelId: string, chatId: string | null, localId: string | null) => void;
    onNewChat: (modelId: string) => void;
    activeChatId?: string;
}

export const SidebarModelItem: React.FC<SidebarModelItemProps> = ({
                                                                      model,
                                                                      chats,
                                                                      isExpanded,
                                                                      onToggle,
                                                                      onChatSelect,
                                                                      onNewChat,
                                                                      activeChatId,
                                                                  }) => {
    const autoSelectionMode = useAppSelector(selectAutoSelectionMode);
    const selectedModelId = useAppSelector(selectSelectedModelId);
    const isAutoSelected = autoSelectionMode !== 'manual' && selectedModelId === model.id;
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
                    {isAutoSelected && (
                        <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                            Auto
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
                        title="New chat"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/>
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
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/>
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
                            onClick={() => onChatSelect(model.id, chat.id || null, chat.localId || null)}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};
