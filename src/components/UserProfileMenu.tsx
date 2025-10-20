import React, { useState } from 'react';

interface UserProfileMenuProps {
    isOpen: boolean;
    onClose: () => void;
    onSettingsClick?: () => void;
    user?: {
        email: string;
        name: string;
        avatar?: string;
        plan: string;
    };
}

export const UserProfileMenu: React.FC<UserProfileMenuProps> = ({
    isOpen,
    onClose,
    onSettingsClick,
    user = {
        email: 'anara.akmatalieva@plus8soft.com',
        name: 'Anara',
        plan: 'Free plan'
    }
}) => {
    const [showLanguageMenu, setShowLanguageMenu] = useState(false);
    const [showLearnMoreMenu, setShowLearnMoreMenu] = useState(false);
    const [showFAQMenu, setShowFAQMenu] = useState(false);

    const referralLink = `askai.com/ref/${user.name.toLowerCase()}123`;

    const handleCopyReferralLink = () => {
        navigator.clipboard.writeText(`https://${referralLink}`);
        // Можно добавить уведомление об успешном копировании
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50" onClick={onClose}>
            <div className="absolute bottom-4 left-4 w-64 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
                {/* Account Information */}
                <div className="p-4 border-b border-gray-200">
                    <div className="text-xs text-gray-500 mb-3">{user.email}</div>
                    
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center">
                                <span className="text-white font-medium text-sm">
                                    {user.name.charAt(0).toUpperCase()}
                                </span>
                            </div>
                            <div>
                                <div className="text-xs text-gray-900">Personal</div>
                                <div className="text-xs text-gray-500">{user.plan}</div>
                            </div>
                        </div>
                        <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/>
                            </svg>
                        </div>
                    </div>
                </div>

                {/* Referral Program Banner */}
                <div className="p-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white">
                    <div className="flex items-center space-x-3 mb-2">
                        <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"/>
                            </svg>
                        </div>
                        <div>
                            <div className="text-sm font-semibold">Earn Money</div>
                            <div className="text-xs text-green-100">Referral Program</div>
                        </div>
                    </div>
                    <div className="text-xs text-green-100 mb-3">
                        Invite friends and earn 10% tokens from their payments
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="text-xs">
                            <span className="text-green-200">Your link:</span>
                            <div className="font-mono text-xs bg-white bg-opacity-20 px-2 py-1 rounded mt-1">
                                {referralLink}
                            </div>
                        </div>
                        <button 
                            onClick={(e) => {
                                e.stopPropagation();
                                handleCopyReferralLink();
                            }}
                            className="px-3 py-1 bg-white bg-opacity-20 hover:bg-opacity-30 rounded text-xs font-medium transition-colors"
                        >
                            Copy
                        </button>
                    </div>
                </div>

                {/* Navigation Links */}
                <div className="py-1">
                    {/* Settings */}
                    <button 
                        className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-gray-50 transition-colors"
                        onClick={() => {
                            onSettingsClick?.();
                            onClose();
                        }}
                    >
                        <span className="text-xs text-gray-900">Settings</span>
                        <span className="text-xs text-gray-500">↑+Ctrl+,</span>
                    </button>

                    {/* Language */}
                    <div className="relative">
                        <button 
                            className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-gray-50 transition-colors"
                            onMouseEnter={() => setShowLanguageMenu(true)}
                            onMouseLeave={() => setShowLanguageMenu(false)}
                        >
                            <span className="text-xs text-gray-900">Language</span>
                            <svg className={`w-4 h-4 text-gray-500 transition-transform ${showLanguageMenu ? 'rotate-90' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/>
                            </svg>
                        </button>
                        
                        {showLanguageMenu && (
                            <div 
                                className="fixed left-56 top-auto w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50"
                                onMouseEnter={() => setShowLanguageMenu(true)}
                                onMouseLeave={() => setShowLanguageMenu(false)}
                            >
                                <div className="py-1">
                                    <button 
                                        className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        English
                                    </button>
                                    <button 
                                        className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        Русский
                                    </button>
                                    <button 
                                        className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        Español
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Get help */}
                    <button className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-gray-50 transition-colors">
                            <span className="text-xs text-gray-900">Get help</span>
                    </button>

                    {/* FAQ */}
                    <div className="relative">
                        <button 
                            className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-gray-50 transition-colors"
                            onMouseEnter={() => setShowFAQMenu(true)}
                            onMouseLeave={() => setShowFAQMenu(false)}
                        >
                            <span className="text-xs text-gray-900">FAQ</span>
                            <svg className={`w-4 h-4 text-gray-500 transition-transform ${showFAQMenu ? 'rotate-90' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/>
                            </svg>
                        </button>
                        
                        {showFAQMenu && (
                            <div 
                                className="fixed left-56 top-auto w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50"
                                onMouseEnter={() => setShowFAQMenu(true)}
                                onMouseLeave={() => setShowFAQMenu(false)}
                            >
                                <div className="py-1">
                                    <button 
                                        className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        Getting Started
                                    </button>
                                    <button 
                                        className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        Account & Billing
                                    </button>
                                    <button 
                                        className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        Technical Issues
                                    </button>
                                    <button 
                                        className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        Privacy & Security
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="border-t border-gray-200 my-1"></div>

                    {/* Upgrade plan */}
                    <button className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-gray-50 transition-colors">
                            <span className="text-xs text-gray-900">Upgrade plan</span>
                    </button>

                    {/* Learn more */}
                    <div className="relative">
                        <button 
                            className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-gray-50 transition-colors"
                            onMouseEnter={() => setShowLearnMoreMenu(true)}
                            onMouseLeave={() => setShowLearnMoreMenu(false)}
                        >
                            <span className="text-xs text-gray-900">Learn more</span>
                            <svg className={`w-4 h-4 text-gray-500 transition-transform ${showLearnMoreMenu ? 'rotate-90' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/>
                            </svg>
                        </button>
                        
                        {showLearnMoreMenu && (
                            <div 
                                className="fixed left-56 top-auto w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50"
                                onMouseEnter={() => setShowLearnMoreMenu(true)}
                                onMouseLeave={() => setShowLearnMoreMenu(false)}
                            >
                                <div className="py-1">
                                    <button 
                                        className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        Documentation
                                    </button>
                                    <button 
                                        className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        Tutorials
                                    </button>
                                    <button 
                                        className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        Community
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="border-t border-gray-200 my-1"></div>

                    {/* Log out */}
                    <button className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-gray-50 transition-colors text-red-600">
                        <span className="text-xs text-red-600">Log out</span>
                    </button>
                </div>

                {/* Account Switcher Footer */}
                <div className="bg-gray-50 border-t border-gray-200 p-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center">
                                <span className="text-white font-medium text-sm">
                                    {user.name.charAt(0).toUpperCase()}
                                </span>
                            </div>
                            <div>
                                <div className="text-xs text-gray-900">{user.name}</div>
                                <div className="text-xs text-gray-500">{user.plan}</div>
                            </div>
                        </div>
                        <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/>
                        </svg>
                    </div>
                </div>
            </div>
        </div>
    );
};
