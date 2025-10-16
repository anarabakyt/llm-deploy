import React, { useState } from 'react';
import { SSOLoginScreen } from './sso/SSOLoginScreen';

interface LoginScreenProps {
    onLogin?: () => void;
    onSSOLogin?: (provider: string, domain?: string) => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({onLogin, onSSOLogin}) => {
    const [showSSO, setShowSSO] = useState(false);

    if (showSSO) {
        return (
            <SSOLoginScreen
                onSSOLogin={onSSOLogin || (() => {})}
                onGoogleLogin={onLogin || (() => {})}
                onBack={() => setShowSSO(false)}
            />
        );
    }

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
                    
                    {/* Personal Login */}
                    <button
                        onClick={onLogin}
                        className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors mb-4"
                    >
                        <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                            <path
                                d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                        </svg>
                        Sign In with Google
                    </button>

                    {/* Corporate SSO */}
                    <button
                        onClick={() => setShowSSO(true)}
                        className="w-full flex items-center justify-center px-4 py-3 border border-blue-300 rounded-md shadow-sm bg-blue-50 text-sm font-medium text-blue-700 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                    >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                        Corporate SSO Login
                    </button>

                    <p className="text-xs text-gray-500 mt-4">
                        For organizations with SSO integration
                    </p>
                </div>
            </div>
        </div>
    );
};
