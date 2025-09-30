import React, {useState} from 'react';

interface ChatInputProps {
    onSendMessage: (message: string) => void;
    disabled?: boolean;
    placeholder?: string;
}

export const ChatInput: React.FC<ChatInputProps> = ({
                                                        onSendMessage,
                                                        disabled = false,
                                                        placeholder = 'Введите сообщение...',
                                                    }) => {
    const [message, setMessage] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (message.trim() && !disabled) {
            onSendMessage(message.trim());
            setMessage('');
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
        }
    };

    return (
        <div className="border-t border-gray-200 bg-white p-4">
            <form onSubmit={handleSubmit} className="flex space-x-2">
                <div className="flex-1">
          <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={placeholder}
              disabled={disabled}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none disabled:bg-gray-100 disabled:cursor-not-allowed"
              rows={4}
              style={{height: '96px'}}
          />
                </div>
                <button
                    type="submit"
                    disabled={!message.trim() || disabled}
                    className="w-12 h-12 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                              d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/>
                    </svg>
                </button>
            </form>
        </div>
    );
};
