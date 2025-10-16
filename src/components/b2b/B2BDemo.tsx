import React, { useState } from 'react';
import { B2BPricingPage } from './B2BPricingPage';
import { B2BTeamManagement } from './B2BTeamManagement';
import { B2BLicenseTracker } from './B2BLicenseTracker';
import { B2BBillingDashboard } from './B2BBillingDashboard';

export const B2BDemo: React.FC = () => {
    const [currentView, setCurrentView] = useState<'pricing' | 'team' | 'licenses' | 'billing'>('pricing');

    const navigationItems = [
        { id: 'pricing', label: 'Pricing Plans', icon: '💰' },
        { id: 'team', label: 'Team Management', icon: '👥' },
        { id: 'licenses', label: 'License Tracking', icon: '📊' },
        { id: 'billing', label: 'Billing & Invoices', icon: '💳' }
    ];

    const renderContent = () => {
        switch (currentView) {
            case 'pricing':
                return <B2BPricingPage />;
            case 'team':
                return <B2BTeamManagement />;
            case 'licenses':
                return <B2BLicenseTracker />;
            case 'billing':
                return <B2BBillingDashboard />;
            default:
                return <B2BPricingPage />;
        }
    };

    return (
        <div className="h-screen bg-gray-50 overflow-y-auto flex">
            {/* Sidebar Navigation */}
            <div className="w-64 bg-white shadow-lg border-r border-gray-200 flex flex-col">
                <div className="p-6 border-b border-gray-200">
                    <h1 className="text-xl font-bold text-gray-900 mb-2">B2B Enterprise</h1>
                    <p className="text-sm text-gray-600">Corporate Solutions</p>
                </div>
                
                <nav className="flex-1 p-4">
                    <ul className="space-y-2">
                        {navigationItems.map((item) => (
                            <li key={item.id}>
                                <button
                                    onClick={() => setCurrentView(item.id as any)}
                                    className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors ${
                                        currentView === item.id
                                            ? 'bg-blue-100 text-blue-700 border border-blue-200'
                                            : 'text-gray-700 hover:bg-gray-100'
                                    }`}
                                >
                                    <span className="text-lg mr-3">{item.icon}</span>
                                    <span className="font-medium">{item.label}</span>
                                </button>
                            </li>
                        ))}
                    </ul>
                </nav>

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
                {renderContent()}
            </div>
        </div>
    );
};
