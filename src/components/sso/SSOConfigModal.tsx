import React, { useState } from 'react';

interface SSOConfigModalProps {
    isOpen: boolean;
    onClose: () => void;
    provider: string;
}

interface SSOConfig {
    provider: string;
    domain: string;
    clientId: string;
    clientSecret: string;
    redirectUri: string;
    metadataUrl?: string;
    certificate?: string;
    isEnabled: boolean;
}

export const SSOConfigModal: React.FC<SSOConfigModalProps> = ({
    isOpen,
    onClose,
    provider
}) => {
    const [config, setConfig] = useState<SSOConfig>({
        provider,
        domain: '',
        clientId: '',
        clientSecret: '',
        redirectUri: '',
        metadataUrl: '',
        certificate: '',
        isEnabled: false
    });

    const [activeTab, setActiveTab] = useState<'general' | 'security' | 'advanced'>('general');

    const handleSave = () => {
        console.log('Save SSO config:', config);
        onClose();
    };

    const handleTest = () => {
        console.log('Test SSO connection:', config);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">
                                SSO Configuration
                            </h2>
                            <p className="text-gray-600 capitalize">
                                {provider.replace('-', ' ')} Settings
                            </p>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Tabs */}
                <div className="border-b border-gray-200">
                    <nav className="flex space-x-8 px-6">
                        {[
                            { id: 'general', label: 'General', icon: '⚙️' },
                            { id: 'security', label: 'Security', icon: '🔒' },
                            { id: 'advanced', label: 'Advanced', icon: '🔧' }
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as any)}
                                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                                    activeTab === tab.id
                                        ? 'border-blue-500 text-blue-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                            >
                                <span className="mr-2">{tab.icon}</span>
                                {tab.label}
                            </button>
                        ))}
                    </nav>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto max-h-96">
                    {activeTab === 'general' && (
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Domain
                                    </label>
                                    <input
                                        type="text"
                                        value={config.domain}
                                        onChange={(e) => setConfig({...config, domain: e.target.value})}
                                        placeholder="company.com"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Redirect URI
                                    </label>
                                    <input
                                        type="text"
                                        value={config.redirectUri}
                                        onChange={(e) => setConfig({...config, redirectUri: e.target.value})}
                                        placeholder="https://app.llmgator.com/auth/callback"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                            </div>

                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="enabled"
                                    checked={config.isEnabled}
                                    onChange={(e) => setConfig({...config, isEnabled: e.target.checked})}
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                />
                                <label htmlFor="enabled" className="ml-2 text-sm text-gray-700">
                                    Enable SSO for this provider
                                </label>
                            </div>
                        </div>
                    )}

                    {activeTab === 'security' && (
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Client ID
                                    </label>
                                    <input
                                        type="text"
                                        value={config.clientId}
                                        onChange={(e) => setConfig({...config, clientId: e.target.value})}
                                        placeholder="Your OAuth Client ID"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Client Secret
                                    </label>
                                    <input
                                        type="password"
                                        value={config.clientSecret}
                                        onChange={(e) => setConfig({...config, clientSecret: e.target.value})}
                                        placeholder="Your OAuth Client Secret"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                            </div>

                            {provider.includes('saml') && (
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            SAML Metadata URL
                                        </label>
                                        <input
                                            type="url"
                                            value={config.metadataUrl}
                                            onChange={(e) => setConfig({...config, metadataUrl: e.target.value})}
                                            placeholder="https://your-provider.com/saml/metadata"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Certificate
                                        </label>
                                        <textarea
                                            value={config.certificate}
                                            onChange={(e) => setConfig({...config, certificate: e.target.value})}
                                            placeholder="Paste your SAML certificate here..."
                                            rows={4}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'advanced' && (
                        <div className="space-y-6">
                            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                                <div className="flex">
                                    <svg className="w-5 h-5 text-yellow-400 mr-3 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
                                    <div>
                                        <h3 className="text-sm font-medium text-yellow-800">Advanced Configuration</h3>
                                        <p className="text-sm text-yellow-700 mt-1">
                                            These settings should only be modified by experienced administrators.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Token Expiration (minutes)
                                    </label>
                                    <input
                                        type="number"
                                        defaultValue="60"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Session Timeout (hours)
                                    </label>
                                    <input
                                        type="number"
                                        defaultValue="8"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        id="autoSync"
                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                    />
                                    <label htmlFor="autoSync" className="ml-2 text-sm text-gray-700">
                                        Auto-sync users from SSO provider
                                    </label>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
                    <div className="flex justify-between">
                        <button
                            onClick={handleTest}
                            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                        >
                            Test Connection
                        </button>
                        <div className="flex space-x-3">
                            <button
                                onClick={onClose}
                                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                Save Configuration
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
