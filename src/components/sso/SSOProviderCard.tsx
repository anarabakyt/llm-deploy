import React from 'react';

interface SSOProvider {
    id: string;
    name: string;
    type: 'saml' | 'oauth2' | 'ldap';
    icon: string;
    description: string;
    color: string;
    isEnabled: boolean;
}

interface SSOProviderCardProps {
    provider: SSOProvider;
    isSelected: boolean;
    onSelect: () => void;
}

export const SSOProviderCard: React.FC<SSOProviderCardProps> = ({
    provider,
    isSelected,
    onSelect
}) => {
    const getTypeBadge = (type: string) => {
        switch (type) {
            case 'saml': return 'SAML 2.0';
            case 'oauth2': return 'OAuth 2.0';
            case 'ldap': return 'LDAP/AD';
            default: return type.toUpperCase();
        }
    };

    const getTypeColor = (type: string) => {
        switch (type) {
            case 'saml': return 'bg-purple-100 text-purple-800';
            case 'oauth2': return 'bg-blue-100 text-blue-800';
            case 'ldap': return 'bg-green-100 text-green-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div
            onClick={provider.isEnabled ? onSelect : undefined}
            className={`relative bg-white rounded-xl p-6 shadow-sm border-2 cursor-pointer transition-all duration-200 ${
                isSelected
                    ? 'border-blue-500 shadow-lg scale-105'
                    : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
            } ${!provider.isEnabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
            {/* Provider Icon and Name */}
            <div className="flex items-center mb-4">
                <div className={`w-12 h-12 rounded-lg ${provider.color} flex items-center justify-center text-white text-2xl mr-4`}>
                    {provider.icon}
                </div>
                <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">{provider.name}</h3>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(provider.type)}`}>
                        {getTypeBadge(provider.type)}
                    </span>
                </div>
            </div>

            {/* Description */}
            <p className="text-gray-600 text-sm mb-4">{provider.description}</p>

            {/* Selection Indicator */}
            {isSelected && (
                <div className="absolute top-4 right-4">
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                    </div>
                </div>
            )}

            {/* Disabled State */}
            {!provider.isEnabled && (
                <div className="absolute inset-0 bg-gray-100 bg-opacity-50 rounded-xl flex items-center justify-center">
                    <span className="text-gray-500 text-sm font-medium">Coming Soon</span>
                </div>
            )}
        </div>
    );
};
