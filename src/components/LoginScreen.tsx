import React from 'react';

interface LoginScreenProps {
    onLogin?: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({onLogin}) => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
            <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        LLMGator
                    </h1>
                    <p className="text-gray-600 mb-8">
                        AI Agent Aggregator for comparing responses from various LLM models
                    </p>
                    <button
                        onClick={onLogin}
                        className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                    >
                        <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                            <path
                                d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                        </svg>
                        Sign In
                    </button>
                </div>
            </div>
        </div>
    );
};
