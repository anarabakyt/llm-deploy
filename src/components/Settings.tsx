import React, { useState, useEffect } from 'react';
import { UserProfileMenu } from './UserProfileMenu';

interface SettingsProps {
    onNewChat?: () => void;
    onBackToChat?: () => void;
    onProfileClick?: () => void;
}

export const Settings: React.FC<SettingsProps> = ({ onNewChat, onBackToChat, onProfileClick }) => {
    const [activeSection, setActiveSection] = useState('account');
    const [fullName, setFullName] = useState('Anara');
    const [claudeName, setClaudeName] = useState('Anara');
    const [workFunction, setWorkFunction] = useState('');
    const [preferences, setPreferences] = useState('');
    const [notifications, setNotifications] = useState(false);
    const [showUserProfileMenu, setShowUserProfileMenu] = useState(false);

    // Handle keyboard shortcut
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.ctrlKey && event.key === ',') {
                event.preventDefault();
                onBackToChat?.();
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [onBackToChat]);

    const navigationItems = [
        { id: 'general', label: 'General' },
        { id: 'account', label: 'Account' },
        { id: 'privacy', label: 'Privacy' },
        { id: 'billing', label: 'Billing' },
        { id: 'capabilities', label: 'Capabilities' },
        { id: 'connectors', label: 'Connectors' }
    ];

    return (
        <div className="flex h-screen bg-gray-50">
            {/* Left Sidebar - Main App Navigation */}
            <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
                {/* App Header */}
                <div className="p-6 border-b border-gray-200">
                    <h1 className="text-xl font-semibold text-gray-900 mb-4">Ask AI</h1>
                    <button 
                        className="w-full flex items-center justify-center px-4 py-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors border border-blue-200"
                        onClick={onNewChat}
                    >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/>
                        </svg>
                        New chat
                    </button>
                </div>

                {/* Main Navigation */}
                <div className="p-4">
                    <nav className="space-y-2">
                        {/* Navigation items removed */}
                    </nav>
                </div>

                {/* Recents */}
                <div className="flex-1 p-4">
                    <h3 className="text-sm font-medium text-gray-500 mb-3">Recents</h3>
                    <div className="space-y-1">
                        <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors bg-amber-50">
                            Learning Russian language
                        </button>
                        <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors">
                            Untitled
                        </button>
                        <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors">
                            Untitled
                        </button>
                        <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors">
                            Disabled status meaning
                        </button>
                        <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors">
                            Universal LLM interface platform
                        </button>
                        <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors">
                            Design data structures
                        </button>
                        <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors">
                            Develop research methodologies
                        </button>
                    </div>
                </div>

                {/* User Profile - Bottom Left */}
                <div className="p-4 border-t border-gray-200">
                    <button 
                        className="w-full flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors"
                        onClick={() => setShowUserProfileMenu(!showUserProfileMenu)}
                    >
                        <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center">
                            <span className="text-white font-medium text-sm">A</span>
                        </div>
                        <div className="flex-1 text-left">
                            <div className="text-sm font-medium text-gray-900">Anara</div>
                            <div className="text-xs text-gray-500">Free plan</div>
                        </div>
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/>
                        </svg>
                    </button>
                </div>
            </div>

            {/* Settings Content Area */}
            <div className="flex-1 flex">
                {/* Settings Navigation */}
                <div className="w-64 bg-white border-r border-gray-200 p-6">
                    <h1 className="text-xl font-semibold text-gray-900 mb-6">Settings</h1>
                    <nav className="space-y-1">
                        {navigationItems.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => setActiveSection(item.id)}
                                className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                                    activeSection === item.id
                                        ? 'bg-amber-50 text-gray-900'
                                        : 'text-gray-700 hover:bg-gray-100'
                                }`}
                            >
                                {item.label}
                            </button>
                        ))}
                    </nav>
                </div>

                {/* Main Content Area */}
                <div className="flex-1 p-8 overflow-y-auto">
                    {/* Back to Chat Button */}
                    <div className="mb-6">
                        <button
                            onClick={onBackToChat}
                            className="flex items-center px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
                        >
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            Back to Chat
                        </button>
                    </div>
                {activeSection === 'general' && (
                    <div className="max-w-2xl space-y-6">
                        {/* Full name / What should Claude call you? */}
                        <div className="bg-white rounded-lg border border-gray-200 p-6">
                            <div className="grid grid-cols-2 gap-6">
                                {/* Full name */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-900 mb-2">
                                        Full name
                                    </label>
                                    <div className="flex items-center space-x-3">
                                        <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center">
                                            <span className="text-white font-medium text-sm">A</span>
                                        </div>
                                        <input
                                            type="text"
                                            value={fullName}
                                            onChange={(e) => setFullName(e.target.value)}
                                            className="flex-1 px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>
                                </div>

                                {/* What should Claude call you? */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-900 mb-2">
                                        What should Claude call you?
                                    </label>
                                    <input
                                        type="text"
                                        value={claudeName}
                                        onChange={(e) => setClaudeName(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* What best describes your work? */}
                        <div className="bg-white rounded-lg border border-gray-200 p-6">
                            <label className="block text-sm font-medium text-gray-900 mb-2">
                                What best describes your work?
                            </label>
                            <div className="relative">
                                <select
                                    value={workFunction}
                                    onChange={(e) => setWorkFunction(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                                >
                                    <option value="">Select your work function</option>
                                    <option value="developer">Developer</option>
                                    <option value="designer">Designer</option>
                                    <option value="manager">Manager</option>
                                    <option value="researcher">Researcher</option>
                                    <option value="writer">Writer</option>
                                    <option value="other">Other</option>
                                </select>
                                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/>
                                    </svg>
                                </div>
                            </div>
                        </div>

                        {/* Personal preferences */}
                        <div className="bg-white rounded-lg border border-gray-200 p-6">
                            <label className="block text-sm font-medium text-gray-900 mb-2">
                                What personal preferences should Claude consider in responses?
                            </label>
                            <p className="text-xs text-gray-500 mb-3">
                                Your preferences will apply to all conversations, within Anthropic's guidelines.{' '}
                                <a href="#" className="text-blue-600 underline">Learn about preferences</a>
                            </p>
                            <textarea
                                value={preferences}
                                onChange={(e) => setPreferences(e.target.value)}
                                placeholder="e.g. I primarily code in Python (not a coding beginner)"
                                rows={4}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                            />
                        </div>

                        {/* Notifications */}
                        <div className="bg-white rounded-lg border border-gray-200 p-6">
                            <div className="flex items-center justify-between">
                                <div className="flex-1">
                                    <h3 className="text-sm font-medium text-gray-900 mb-1">Notifications</h3>
                                    <h4 className="text-sm font-medium text-gray-900 mb-2">Response completions</h4>
                                    <p className="text-xs text-gray-500">
                                        Get notified when Ask AI has finished a response. Most useful for long-running tasks like tool calls and Research.
                                    </p>
                                </div>
                                <div className="ml-4">
                                    <button
                                        onClick={() => setNotifications(!notifications)}
                                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                            notifications ? 'bg-blue-600' : 'bg-gray-200'
                                        }`}
                                    >
                                        <span
                                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                                notifications ? 'translate-x-6' : 'translate-x-1'
                                            }`}
                                        />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeSection === 'account' && (
                    <div className="max-w-2xl space-y-6">
                        <h2 className="text-lg font-medium text-gray-900 mb-6">Account</h2>
                        
                        {/* Log out of all devices */}
                        <div className="bg-white rounded-lg border border-gray-200 p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-sm font-medium text-gray-900">Log out of all devices</h3>
                                </div>
                                <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors">
                                    Log out
                                </button>
                            </div>
                        </div>

                        {/* Delete your account */}
                        <div className="bg-white rounded-lg border border-gray-200 p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-sm font-medium text-gray-900">Delete your account</h3>
                                </div>
                                <button className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors">
                                    Delete account
                                </button>
                            </div>
                        </div>

                        {/* Organization ID */}
                        <div className="bg-white rounded-lg border border-gray-200 p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-sm font-medium text-gray-900">Organization ID</h3>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <div className="px-3 py-2 bg-gray-100 text-gray-700 rounded-md font-mono text-sm">
                                        86919117-250b-41a0-81f2-069907016666
                                    </div>
                                    <button className="p-2 text-gray-500 hover:text-gray-700 transition-colors">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/>
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeSection === 'privacy' && (
                    <div className="max-w-2xl space-y-6">
                        <div className="flex items-center space-x-3 mb-6">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                                </svg>
                            </div>
                            <h2 className="text-lg font-medium text-gray-900">Privacy</h2>
                        </div>
                        
                        <div className="bg-white rounded-lg border border-gray-200 p-6">
                            <p className="text-sm text-gray-600 mb-4">
                                Ask AI believes in transparent data practices
                            </p>
                            <p className="text-sm text-gray-600 mb-4">
                                Learn how your information is protected when using Ask AI products, and visit our Privacy Center and Privacy Policy for more details.
                            </p>
                            <div className="space-y-2">
                                <a href="#" className="block text-sm text-blue-600 hover:text-blue-800">How we protect your data &gt;</a>
                                <a href="#" className="block text-sm text-blue-600 hover:text-blue-800">How we use your data &gt;</a>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg border border-gray-200 p-6">
                            <h3 className="text-sm font-medium text-gray-900 mb-4">Privacy settings</h3>
                            
                            <div className="space-y-6">
                                {/* Export data */}
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h4 className="text-sm font-medium text-gray-900">Export data</h4>
                                    </div>
                                    <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors">
                                        Export data
                                    </button>
                                </div>

                                {/* Shared chats */}
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h4 className="text-sm font-medium text-gray-900">Shared chats</h4>
                                    </div>
                                    <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors">
                                        Manage
                                    </button>
                                </div>

                                {/* Location metadata */}
                                <div className="flex items-center justify-between">
                                    <div className="flex-1">
                                        <h4 className="text-sm font-medium text-gray-900">Location metadata</h4>
                                        <p className="text-xs text-gray-500 mt-1">
                                            Allow Ask AI to use coarse location metadata (city/region) to improve product experiences. <a href="#" className="text-blue-600 hover:text-blue-800">Learn more</a>
                                        </p>
                                    </div>
                                    <div className="ml-4">
                                        <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-blue-600 transition-colors">
                                            <span className="inline-block h-4 w-4 transform rounded-full bg-white translate-x-6 transition-transform"/>
                                        </button>
                                    </div>
                                </div>

                                {/* Help improve Ask AI */}
                                <div className="flex items-center justify-between">
                                    <div className="flex-1">
                                        <h4 className="text-sm font-medium text-gray-900">Help improve Ask AI</h4>
                                        <p className="text-xs text-gray-500 mt-1">
                                            Allow the use of your chats and coding sessions to train and improve Ask AI models. <a href="#" className="text-blue-600 hover:text-blue-800">Learn more</a>
                                        </p>
                                    </div>
                                    <div className="ml-4">
                                        <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-blue-600 transition-colors">
                                            <span className="inline-block h-4 w-4 transform rounded-full bg-white translate-x-6 transition-transform"/>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeSection === 'billing' && (
                    <div className="max-w-2xl space-y-6">
                        <div className="bg-white rounded-lg border border-gray-200 p-6">
                            <div className="flex items-start justify-between">
                                <div className="flex items-center space-x-3">
                                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                                        <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/>
                                        </svg>
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-semibold text-gray-900">Free plan</h2>
                                        <p className="text-sm text-gray-600">Try Ask AI</p>
                                    </div>
                                </div>
                                <button className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors">
                                    Upgrade plan
                                </button>
                            </div>
                            
                            <div className="mt-6 space-y-3">
                                <div className="flex items-center space-x-3">
                                    <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/>
                                    </svg>
                                    <span className="text-sm text-gray-700">Chat with Ask AI on web, iOS, and Android</span>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/>
                                    </svg>
                                    <span className="text-sm text-gray-700">Write, edit, and create content</span>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/>
                                    </svg>
                                    <span className="text-sm text-gray-700">Analyze text and upload images</span>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/>
                                    </svg>
                                    <span className="text-sm text-gray-700">Generate code and visualize data</span>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/>
                                    </svg>
                                    <span className="text-sm text-gray-700">Get web search results inside chat</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeSection === 'capabilities' && (
                    <div className="max-w-2xl space-y-6">
                        <div>
                            <h2 className="text-lg font-medium text-gray-900 mb-2">Capabilities</h2>
                            <p className="text-sm text-gray-600">Control which capabilities Ask AI uses in your conversations.</p>
                        </div>

                        <div className="bg-white rounded-lg border border-gray-200 p-6">
                            <h3 className="text-sm font-medium text-gray-900 mb-4">Capabilities</h3>
                            
                            <div className="space-y-6">
                                {/* Artifacts */}
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <h4 className="text-sm font-medium text-gray-900">Artifacts</h4>
                                        <p className="text-xs text-gray-500 mt-1">
                                            Ask Ask AI to generate content like code snippets, text documents, or website designs, and Ask AI will create an Artifact that appears in a dedicated window alongside your conversation.
                                        </p>
                                    </div>
                                    <div className="ml-4">
                                        <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-blue-600 transition-colors">
                                            <span className="inline-block h-4 w-4 transform rounded-full bg-white translate-x-6 transition-transform"/>
                                        </button>
                                    </div>
                                </div>

                                {/* AI-powered artifacts */}
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <h4 className="text-sm font-medium text-gray-900">AI-powered artifacts</h4>
                                        <p className="text-xs text-gray-500 mt-1">
                                            Create apps, prototypes, and interactive documents that use Ask AI inside the artifact. Start by saying, "Let's build an AI app..." to access the power of Ask AI API.
                                        </p>
                                    </div>
                                    <div className="ml-4">
                                        <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200 transition-colors">
                                            <span className="inline-block h-4 w-4 transform rounded-full bg-white translate-x-1 transition-transform"/>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg border border-gray-200 p-6">
                            <h3 className="text-sm font-medium text-gray-900 mb-2">Experimental</h3>
                            <p className="text-xs text-gray-500 mb-4">
                                Preview and provide feedback on upcoming enhancements to our platform. Please note: experimental features might influence Ask AI's behavior and some interactions may differ from the standard experience.
                            </p>
                            
                            <div className="flex items-start justify-between">
                                <div className="flex items-start space-x-3 flex-1">
                                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                        <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
                                        </svg>
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="text-sm font-medium text-gray-900">Analysis tool</h4>
                                        <p className="text-xs text-gray-500 mt-1">
                                            Ask AI can write and run code to process data, run analysis, and produce data visualizations in real time.
                                        </p>
                                    </div>
                                </div>
                                <div className="ml-4">
                                    <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200 transition-colors">
                                        <span className="inline-block h-4 w-4 transform rounded-full bg-white translate-x-1 transition-transform"/>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeSection === 'connectors' && (
                    <div className="max-w-2xl space-y-6">
                        <div>
                            <h2 className="text-lg font-medium text-gray-900 mb-2">Connectors</h2>
                            <p className="text-sm text-gray-600">Connect Ask AI to your favorite tools and services.</p>
                        </div>

                        <div className="bg-white rounded-lg border border-gray-200 p-6">
                            <div className="text-center py-8">
                                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"/>
                                    </svg>
                                </div>
                                <h3 className="text-lg font-medium text-gray-900 mb-2">No connectors yet</h3>
                                <p className="text-sm text-gray-500 mb-4">
                                    Connect Ask AI to your favorite tools and services to enhance your workflow.
                                </p>
                                <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                                    Browse connectors
                                </button>
                            </div>
                        </div>
                    </div>
                )}
                </div>
            </div>

            {/* User Profile Menu */}
            <UserProfileMenu 
                isOpen={showUserProfileMenu}
                onClose={() => setShowUserProfileMenu(false)}
                onSettingsClick={onProfileClick}
            />
        </div>
    );
};
