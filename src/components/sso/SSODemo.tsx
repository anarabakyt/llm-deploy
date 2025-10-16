import React, { useState } from 'react';
import { SSOLoginScreen } from './SSOLoginScreen';
import { CorporateUserManagement } from './CorporateUserManagement';
import { SSOConfigModal } from './SSOConfigModal';

export const SSODemo: React.FC = () => {
    const [currentView, setCurrentView] = useState<'login' | 'management' | 'config'>('login');
    const [selectedProvider, setSelectedProvider] = useState<string | null>(null);

    const handleSSOLogin = (provider: string, domain?: string) => {
        console.log('SSO Login:', { provider, domain });
        setSelectedProvider(provider);
        setCurrentView('management');
    };

    const handleGoogleLogin = () => {
        console.log('Google Login');
        setCurrentView('management');
    };

    const handleBack = () => {
        setCurrentView('login');
        setSelectedProvider(null);
    };

    const handleUserUpdate = (userId: string, updates: any) => {
        console.log('Update user:', userId, updates);
    };

    const handleUserDelete = (userId: string) => {
        console.log('Delete user:', userId);
    };

    const handleBulkAction = (action: string, userIds: string[]) => {
        console.log('Bulk action:', action, userIds);
    };

    const handleConfigOpen = () => {
        setCurrentView('config');
    };

    const handleConfigClose = () => {
        setCurrentView('management');
    };

    if (currentView === 'login') {
        return (
            <SSOLoginScreen
                onSSOLogin={handleSSOLogin}
                onGoogleLogin={handleGoogleLogin}
                onBack={() => window.history.back()}
            />
        );
    }

    if (currentView === 'config') {
        return (
            <SSOConfigModal
                isOpen={true}
                onClose={handleConfigClose}
                provider={selectedProvider || 'google-workspace'}
            />
        );
    }

    return (
        <div className="h-screen bg-gray-50 overflow-y-auto flex">
            {/* Sidebar Navigation */}
            <div className="w-64 bg-white shadow-lg border-r border-gray-200 flex flex-col">
                <div className="p-6 border-b border-gray-200">
                    <h1 className="text-xl font-bold text-gray-900 mb-2">SSO Management</h1>
                    <p className="text-sm text-gray-600">Corporate Authentication</p>
                </div>
                
                <nav className="flex-1 p-4">
                    <ul className="space-y-2">
                        <li>
                            <button
                                onClick={() => setCurrentView('management')}
                                className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors ${
                                    currentView === 'management'
                                        ? 'bg-blue-100 text-blue-700 border border-blue-200'
                                        : 'text-gray-700 hover:bg-gray-100'
                                }`}
                            >
                                <span className="text-lg mr-3">👥</span>
                                <span className="font-medium">User Management</span>
                            </button>
                        </li>
                        <li>
                            <button
                                onClick={handleConfigOpen}
                                className="w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors text-gray-700 hover:bg-gray-100"
                            >
                                <span className="text-lg mr-3">⚙️</span>
                                <span className="font-medium">SSO Configuration</span>
                            </button>
                        </li>
                        <li>
                            <button
                                onClick={handleBack}
                                className="w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors text-gray-700 hover:bg-gray-100"
                            >
                                <span className="text-lg mr-3">🔐</span>
                                <span className="font-medium">Switch Provider</span>
                            </button>
                        </li>
                    </ul>
                </nav>

                {/* Provider Info */}
                {selectedProvider && (
                    <div className="p-4 border-t border-gray-200">
                        <div className="bg-blue-50 rounded-lg p-3">
                            <p className="text-xs text-blue-600 font-medium mb-1">Current Provider</p>
                            <p className="text-sm text-blue-800 capitalize">
                                {selectedProvider.replace('-', ' ')}
                            </p>
                        </div>
                    </div>
                )}

                {/* Back to Main App */}
                <div className="p-4 border-t border-gray-200">
                    <button
                        onClick={() => window.history.back()}
                        className="w-full flex items-center px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Back to Main App
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-y-auto">
                <CorporateUserManagement
                    users={[]}
                    onUserUpdate={handleUserUpdate}
                    onUserDelete={handleUserDelete}
                    onBulkAction={handleBulkAction}
                />
            </div>
        </div>
    );
};
