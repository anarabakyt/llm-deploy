import React, { useState } from 'react';

interface AdminStats {
    totalOrganizations: number;
    activeSubscriptions: number;
    totalRevenue: number;
    averageLicenseUsage: number;
}

interface Organization {
    id: string;
    name: string;
    plan: string;
    users: number;
    maxUsers: number;
    status: 'active' | 'suspended' | 'trial';
    joinDate: string;
    lastActivity: string;
    revenue: number;
}

export const B2BAdminPanel: React.FC = () => {
    const [selectedTab, setSelectedTab] = useState<'overview' | 'organizations' | 'billing' | 'support'>('overview');

    const adminStats: AdminStats = {
        totalOrganizations: 156,
        activeSubscriptions: 142,
        totalRevenue: 125430.50,
        averageLicenseUsage: 78.5
    };

    const mockOrganizations: Organization[] = [
        {
            id: '1',
            name: 'TechCorp Solutions',
            plan: 'Enterprise',
            users: 45,
            maxUsers: 50,
            status: 'active',
            joinDate: '2024-01-15',
            lastActivity: '2 hours ago',
            revenue: 3200.00
        },
        {
            id: '2',
            name: 'DataFlow Inc',
            plan: 'Professional',
            users: 18,
            maxUsers: 25,
            status: 'active',
            joinDate: '2024-02-01',
            lastActivity: '1 day ago',
            revenue: 216.00
        },
        {
            id: '3',
            name: 'StartupXYZ',
            plan: 'Starter Team',
            users: 8,
            maxUsers: 10,
            status: 'trial',
            joinDate: '2024-03-10',
            lastActivity: '3 days ago',
            revenue: 0.00
        },
        {
            id: '4',
            name: 'GlobalTech Ltd',
            plan: 'Enterprise',
            users: 95,
            maxUsers: 100,
            status: 'active',
            joinDate: '2023-11-20',
            lastActivity: '1 hour ago',
            revenue: 7600.00
        }
    ];

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active': return 'bg-green-100 text-green-800';
            case 'suspended': return 'bg-red-100 text-red-800';
            case 'trial': return 'bg-yellow-100 text-yellow-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getPlanColor = (plan: string) => {
        switch (plan) {
            case 'Enterprise': return 'bg-purple-100 text-purple-800';
            case 'Professional': return 'bg-blue-100 text-blue-800';
            case 'Starter Team': return 'bg-green-100 text-green-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const renderOverview = () => (
        <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                    <div className="flex items-center">
                        <div className="p-3 bg-blue-100 rounded-lg">
                            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Total Organizations</p>
                            <p className="text-2xl font-bold text-gray-900">{adminStats.totalOrganizations}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                    <div className="flex items-center">
                        <div className="p-3 bg-green-100 rounded-lg">
                            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Active Subscriptions</p>
                            <p className="text-2xl font-bold text-gray-900">{adminStats.activeSubscriptions}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                    <div className="flex items-center">
                        <div className="p-3 bg-purple-100 rounded-lg">
                            <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                            </svg>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                            <p className="text-2xl font-bold text-gray-900">${adminStats.totalRevenue.toLocaleString()}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                    <div className="flex items-center">
                        <div className="p-3 bg-orange-100 rounded-lg">
                            <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Avg License Usage</p>
                            <p className="text-2xl font-bold text-gray-900">{adminStats.averageLicenseUsage}%</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
                <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <p className="text-sm text-gray-600">
                            <span className="font-medium">TechCorp Solutions</span> upgraded to Enterprise plan
                        </p>
                        <span className="text-xs text-gray-500 ml-auto">2 hours ago</span>
                    </div>
                    <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <p className="text-sm text-gray-600">
                            <span className="font-medium">DataFlow Inc</span> added 5 new team members
                        </p>
                        <span className="text-xs text-gray-500 ml-auto">4 hours ago</span>
                    </div>
                    <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                        <p className="text-sm text-gray-600">
                            <span className="font-medium">StartupXYZ</span> started free trial
                        </p>
                        <span className="text-xs text-gray-500 ml-auto">1 day ago</span>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderOrganizations = () => (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Organizations ({mockOrganizations.length})</h3>
            </div>
            
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Organization
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Plan
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Users
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Status
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Revenue
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Last Activity
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {mockOrganizations.map((org) => (
                            <tr key={org.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div>
                                        <div className="text-sm font-medium text-gray-900">{org.name}</div>
                                        <div className="text-sm text-gray-500">Joined {new Date(org.joinDate).toLocaleDateString()}</div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPlanColor(org.plan)}`}>
                                        {org.plan}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {org.users}/{org.maxUsers}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(org.status)}`}>
                                        {org.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    ${org.revenue.toFixed(2)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {org.lastActivity}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <div className="flex space-x-2">
                                        <button className="text-blue-600 hover:text-blue-800">View</button>
                                        <button className="text-gray-600 hover:text-gray-800">Edit</button>
                                        <button className="text-red-600 hover:text-red-800">Suspend</button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );

    const renderBilling = () => (
        <div className="space-y-6">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Overview</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center">
                        <p className="text-3xl font-bold text-green-600">${adminStats.totalRevenue.toLocaleString()}</p>
                        <p className="text-sm text-gray-600">Total Revenue</p>
                    </div>
                    <div className="text-center">
                        <p className="text-3xl font-bold text-blue-600">$8,250</p>
                        <p className="text-sm text-gray-600">This Month</p>
                    </div>
                    <div className="text-center">
                        <p className="text-3xl font-bold text-purple-600">+12.5%</p>
                        <p className="text-sm text-gray-600">Growth Rate</p>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Plan Distribution</h3>
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Enterprise</span>
                        <div className="flex items-center space-x-2">
                            <div className="w-32 bg-gray-200 rounded-full h-2">
                                <div className="bg-purple-500 h-2 rounded-full" style={{ width: '45%' }}></div>
                            </div>
                            <span className="text-sm font-medium text-gray-900">45%</span>
                        </div>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Professional</span>
                        <div className="flex items-center space-x-2">
                            <div className="w-32 bg-gray-200 rounded-full h-2">
                                <div className="bg-blue-500 h-2 rounded-full" style={{ width: '35%' }}></div>
                            </div>
                            <span className="text-sm font-medium text-gray-900">35%</span>
                        </div>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Starter Team</span>
                        <div className="flex items-center space-x-2">
                            <div className="w-32 bg-gray-200 rounded-full h-2">
                                <div className="bg-green-500 h-2 rounded-full" style={{ width: '20%' }}></div>
                            </div>
                            <span className="text-sm font-medium text-gray-900">20%</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderSupport = () => (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Support Tickets</h3>
                    <div className="space-y-3">
                        <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Open</span>
                            <span className="text-sm font-medium text-gray-900">12</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-sm text-gray-600">In Progress</span>
                            <span className="text-sm font-medium text-gray-900">8</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Resolved</span>
                            <span className="text-sm font-medium text-gray-900">156</span>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Response Time</h3>
                    <div className="space-y-3">
                        <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Average</span>
                            <span className="text-sm font-medium text-gray-900">2.3h</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-sm text-gray-600">SLA Target</span>
                            <span className="text-sm font-medium text-gray-900">4h</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-sm text-gray-600">SLA Met</span>
                            <span className="text-sm font-medium text-green-600">98%</span>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Satisfaction</h3>
                    <div className="space-y-3">
                        <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Rating</span>
                            <span className="text-sm font-medium text-gray-900">4.8/5</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Reviews</span>
                            <span className="text-sm font-medium text-gray-900">342</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-sm text-gray-600">NPS Score</span>
                            <span className="text-sm font-medium text-green-600">72</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="max-w-7xl mx-auto p-6">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">B2B Admin Panel</h1>
                <p className="text-gray-600">Manage organizations, billing, and support for B2B customers</p>
            </div>

            {/* Navigation Tabs */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
                <div className="border-b border-gray-200">
                    <nav className="flex space-x-8 px-6">
                        {[
                            { id: 'overview', label: 'Overview', icon: '📊' },
                            { id: 'organizations', label: 'Organizations', icon: '🏢' },
                            { id: 'billing', label: 'Billing', icon: '💳' },
                            { id: 'support', label: 'Support', icon: '🎧' }
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setSelectedTab(tab.id as any)}
                                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                                    selectedTab === tab.id
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
            </div>

            {/* Content */}
            <div className="min-h-96">
                {selectedTab === 'overview' && renderOverview()}
                {selectedTab === 'organizations' && renderOrganizations()}
                {selectedTab === 'billing' && renderBilling()}
                {selectedTab === 'support' && renderSupport()}
            </div>
        </div>
    );
};
