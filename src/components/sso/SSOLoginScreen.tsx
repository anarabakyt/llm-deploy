import React, { useState } from 'react';
import { SSOProviderCard } from './SSOProviderCard';
import { DomainInput } from './DomainInput';

interface SSOProvider {
    id: string;
    name: string;
    type: 'saml' | 'oauth2' | 'ldap';
    icon: string;
    description: string;
    color: string;
    isEnabled: boolean;
}

interface SSOLoginScreenProps {
    onSSOLogin: (provider: string, domain?: string) => void;
    onGoogleLogin: () => void;
    onBack: () => void;
}

export const SSOLoginScreen: React.FC<SSOLoginScreenProps> = ({
    onSSOLogin,
    onGoogleLogin,
    onBack
}) => {
    const [selectedProvider, setSelectedProvider] = useState<string | null>(null);
    const [domain, setDomain] = useState('');
    const [showDomainInput, setShowDomainInput] = useState(false);

    const ssoProviders: SSOProvider[] = [
        {
            id: 'google-workspace',
            name: 'Google Workspace',
            type: 'oauth2',
            icon: '🔐',
            description: 'Sign in with your Google Workspace account',
            color: 'bg-blue-500',
            isEnabled: true
        },
        {
            id: 'microsoft-azure',
            name: 'Microsoft Azure AD',
            type: 'oauth2',
            icon: '🏢',
            description: 'Sign in with your Microsoft Azure AD account',
            color: 'bg-blue-600',
            isEnabled: true
        },
        {
            id: 'okta',
            name: 'Okta',
            type: 'saml',
            icon: '🔑',
            description: 'Sign in with your Okta SSO',
            color: 'bg-purple-500',
            isEnabled: true
        },
        {
            id: 'active-directory',
            name: 'Active Directory',
            type: 'ldap',
            icon: '🏛️',
            description: 'Sign in with your Active Directory credentials',
            color: 'bg-green-600',
            isEnabled: true
        },
        {
            id: 'saml-generic',
            name: 'SAML 2.0',
            type: 'saml',
            icon: '🛡️',
            description: 'Sign in with your SAML 2.0 identity provider',
            color: 'bg-gray-600',
            isEnabled: true
        }
    ];

    const handleProviderSelect = (providerId: string) => {
        setSelectedProvider(providerId);
        const provider = ssoProviders.find(p => p.id === providerId);
        
        if (provider?.type === 'saml' || provider?.type === 'ldap') {
            setShowDomainInput(true);
        } else {
            setShowDomainInput(false);
            setDomain('');
        }
    };

    const handleSSOLogin = () => {
        if (selectedProvider) {
            onSSOLogin(selectedProvider, domain || undefined);
        }
    };

    const handleBack = () => {
        setSelectedProvider(null);
        setShowDomainInput(false);
        setDomain('');
        onBack();
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
            <div className="max-w-4xl w-full">
                {/* Header */}
                <div className="text-center mb-8">
                    <button
                        onClick={onBack}
                        className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6 transition-colors"
                    >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Back to Login
                    </button>
                    
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">
                        Corporate SSO Login
                    </h1>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Choose your organization's single sign-on provider to access LLMGator
                    </p>
                </div>

                {/* SSO Providers Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    {ssoProviders.map((provider) => (
                        <SSOProviderCard
                            key={provider.id}
                            provider={provider}
                            isSelected={selectedProvider === provider.id}
                            onSelect={() => handleProviderSelect(provider.id)}
                        />
                    ))}
                </div>

                {/* Domain Input for SAML/LDAP */}
                {showDomainInput && (
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-6">
                        <DomainInput
                            value={domain}
                            onChange={setDomain}
                            placeholder="Enter your corporate domain (e.g., company.com)"
                            label="Corporate Domain"
                        />
                    </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    {selectedProvider ? (
                        <button
                            onClick={handleSSOLogin}
                            disabled={showDomainInput && !domain.trim()}
                            className="px-8 py-4 bg-blue-600 text-white rounded-xl font-semibold text-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            Continue with SSO
                        </button>
                    ) : (
                        <div className="text-center">
                            <p className="text-gray-600 mb-4">Or continue with personal account</p>
                            <button
                                onClick={onGoogleLogin}
                                className="px-8 py-4 bg-white text-gray-700 rounded-xl font-semibold text-lg border-2 border-gray-300 hover:bg-gray-50 transition-colors"
                            >
                                <svg className="w-5 h-5 inline mr-2" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                                </svg>
                                Continue with Google
                            </button>
                        </div>
                    )}
                </div>

                {/* Help Text */}
                <div className="text-center mt-8">
                    <p className="text-sm text-gray-500">
                        Need help? Contact your IT administrator or{' '}
                        <a href="#" className="text-blue-600 hover:text-blue-800 underline">
                            support team
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
};
