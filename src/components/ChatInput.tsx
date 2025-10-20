import React, {useState} from 'react';

interface ChatInputProps {
    onSendMessage: (message: string) => void;
    onFileAttach?: (file: File) => void;
    disabled?: boolean;
    placeholder?: string;
    rightAccessory?: React.ReactNode;
}

export const ChatInput: React.FC<ChatInputProps> = ({
                                                        onSendMessage,
                                                        onFileAttach,
                                                        disabled = false,
                                                        placeholder = 'Введите сообщение...',
                                                        rightAccessory,
                                                    }) => {
    const [message, setMessage] = useState('');
    const [attachedFile, setAttachedFile] = useState<File | null>(null);
    const [showToggleMenu, setShowToggleMenu] = useState(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && onFileAttach) {
            setAttachedFile(file);
            onFileAttach(file);
            setShowToggleMenu(false);
        }
    };

    const handleRemoveFile = () => {
        setAttachedFile(null);
    };

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
            {/* Attached file display */}
            {attachedFile && (
                <div className="mb-3 p-2 bg-blue-50 border border-blue-200 rounded-md flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                        </svg>
                        <span className="text-sm text-blue-800">{attachedFile.name}</span>
                        <span className="text-xs text-blue-600">({(attachedFile.size / 1024).toFixed(1)} KB)</span>
                    </div>
                    <button
                        onClick={handleRemoveFile}
                        className="text-blue-600 hover:text-blue-800"
                        type="button"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
                        </svg>
                    </button>
                </div>
            )}
            
            <form onSubmit={handleSubmit} className="flex space-x-2 items-start">
                <div className="flex-1 relative">
                    <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder={placeholder}
                        disabled={disabled}
                        className="w-full px-3 py-2 pr-12 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none disabled:bg-gray-100 disabled:cursor-not-allowed"
                        rows={4}
                        style={{height: '96px'}}
                    />
                    
                    {/* Toggle menu button positioned inside textarea */}
                    <div className="absolute bottom-2 left-2">
                        <div className="relative">
                            <button
                                type="button"
                                onClick={() => setShowToggleMenu(!showToggleMenu)}
                                disabled={disabled}
                                className={`w-8 h-8 rounded-md border border-gray-800 hover:border-transparent hover:bg-gray-100 flex items-center justify-center bg-white shadow-sm ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                                style={{
                                    outline: 'none',
                                    borderColor: showToggleMenu ? 'transparent' : '#1f2937',
                                    transition: 'all 0.2s ease'
                                }}
                                onFocus={(e) => e.target.style.borderColor = 'transparent'}
                                onBlur={(e) => e.target.style.borderColor = '#1f2937'}
                            >
                                {showToggleMenu ? (
                                    <div style={{color: 'black', fontSize: '16px', fontWeight: 'bold'}}>×</div>
                                ) : (
                                    <div style={{color: 'black', fontSize: '16px', fontWeight: 'bold'}}>+</div>
                                )}
                            </button>
                            
                    {/* Toggle menu dropdown */}
                    {showToggleMenu && (
                        <div className="absolute bottom-full left-0 mb-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-30">
                            <div className="py-1">
                                {/* Attach File */}
                                <div className="relative">
                                    <input
                                        type="file"
                                        id="file-input"
                                        onChange={handleFileChange}
                                        className="hidden"
                                        accept=".txt,.pdf,.doc,.docx,.md,.json,.csv,.xlsx,.xls"
                                        disabled={disabled}
                                    />
                                    <label
                                        htmlFor="file-input"
                                        className={`flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    >
                                        <svg className="w-4 h-4 mr-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"/>
                                        </svg>
                                        Attach File
                                    </label>
                                </div>
                            </div>
                        </div>
                    )}
                        </div>
                    </div>
                </div>
                
                {rightAccessory && (
                    <div className="relative">
                        {rightAccessory}
                    </div>
                )}
                
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
