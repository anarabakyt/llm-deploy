import React, { useState } from 'react';
import { UserManagement } from './UserManagement';
import { PromptAnalysis } from './PromptAnalysis';
import { PromptControl } from './PromptControl';
import { SecurityDashboard } from './SecurityDashboard';
import { AdminSidebar } from './AdminSidebar';

type AdminTab = 'overview' | 'users' | 'prompts' | 'moderation' | 'security';

export const AdminDashboard: React.FC = () => {
    const [activeTab, setActiveTab] = useState<AdminTab>('overview');

    const renderContent = () => {
        switch (activeTab) {
            case 'overview':
                return <AdminOverview />;
            case 'users':
                return <UserManagement />;
            case 'prompts':
                return <PromptAnalysis />;
            case 'moderation':
                return <PromptControl />;
            case 'security':
                return <SecurityDashboard />;
            default:
                return <AdminOverview />;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="flex">
                <AdminSidebar activeTab={activeTab} onTabChange={setActiveTab} />
                <div className="flex-1 p-6">
                    {renderContent()}
                </div>
            </div>
        </div>
    );
};

const AdminOverview: React.FC = () => {
    return (
        <div className="space-y-6">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
                <p className="text-gray-600">Monitor and manage your LLM platform</p>
            </div>

            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center">
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                            </svg>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Total Users</p>
                            <p className="text-2xl font-semibold text-gray-900">1,247</p>
                            <p className="text-xs text-green-600">+12% from last month</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center">
                        <div className="p-2 bg-green-100 rounded-lg">
                            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Total Prompts</p>
                            <p className="text-2xl font-semibold text-gray-900">45,892</p>
                            <p className="text-xs text-green-600">+8% from last month</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center">
                        <div className="p-2 bg-yellow-100 rounded-lg">
                            <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                            </svg>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Flagged Prompts</p>
                            <p className="text-2xl font-semibold text-gray-900">23</p>
                            <p className="text-xs text-red-600">+3 from yesterday</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center">
                        <div className="p-2 bg-purple-100 rounded-lg">
                            <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">System Health</p>
                            <p className="text-2xl font-semibold text-gray-900">98.5%</p>
                            <p className="text-xs text-green-600">All systems operational</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
                </div>
                <div className="p-6">
                    <div className="space-y-4">
                        <div className="flex items-center space-x-3">
                            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                            <div className="flex-1">
                                <p className="text-sm text-gray-900">New user registered: john.doe@example.com</p>
                                <p className="text-xs text-gray-500">2 minutes ago</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-3">
                            <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                            <div className="flex-1">
                                <p className="text-sm text-gray-900">Prompt flagged for review: "How to hack..."</p>
                                <p className="text-xs text-gray-500">5 minutes ago</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-3">
                            <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                            <div className="flex-1">
                                <p className="text-sm text-gray-900">Model performance updated: GPT-4 quality improved</p>
                                <p className="text-xs text-gray-500">10 minutes ago</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
