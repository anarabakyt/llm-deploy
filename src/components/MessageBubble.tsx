import React from 'react';
import type { Message } from '../entities';

interface MessageBubbleProps {
  message: Message;
  isUser: boolean;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message, isUser }) => {
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div
        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
          isUser
            ? 'bg-blue-500 text-white'
            : 'bg-gray-200 text-gray-800'
        }`}
      >
        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
        <div className="flex items-center justify-between mt-1">
          <span className={`text-xs ${isUser ? 'text-blue-100' : 'text-gray-500'}`}>
            {new Date(message.createdAt).toLocaleTimeString()}
          </span>
        </div>
      </div>
    </div>
  );
};
