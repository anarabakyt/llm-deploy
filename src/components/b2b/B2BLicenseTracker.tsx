import React, { useState } from 'react';

interface LicenseUsage {
    date: string;
    activeUsers: number;
    totalRequests: number;
    tokensUsed: number;
    cost: number;
}

interface LicensePlan {
    id: string;
    name: string;
    totalLicenses: number;
    usedLicenses: number;
    availableLicenses: number;
    pricePerLicense: number;
    billingPeriod: 'month' | 'year';
    nextBillingDate: string;
}

export const B2BLicenseTracker: React.FC = () => {
    const [selectedPeriod, setSelectedPeriod] = useState<'7d' | '30d' | '90d'>('30d');

    const currentPlan: LicensePlan = {
        id: 'professional',
        name: 'Professional Plan',
        totalLicenses: 25,
        usedLicenses: 18,
        availableLicenses: 7,
        pricePerLicense: 12,
        billingPeriod: 'month',
        nextBillingDate: '2024-04-15'
    };

    const mockUsageData: LicenseUsage[] = [
        { date: '2024-03-01', activeUsers: 15, totalRequests: 1250, tokensUsed: 45000, cost: 180.00 },
        { date: '2024-03-02', activeUsers: 16, totalRequests: 1380, tokensUsed: 52000, cost: 208.00 },
        { date: '2024-03-03', activeUsers: 14, totalRequests: 1100, tokensUsed: 38000, cost: 152.00 },
        { date: '2024-03-04', activeUsers: 17, totalRequests: 1450, tokensUsed: 58000, cost: 232.00 },
        { date: '2024-03-05', activeUsers: 18, totalRequests: 1620, tokensUsed: 65000, cost: 260.00 },
        { date: '2024-03-06', activeUsers: 16, totalRequests: 1320, tokensUsed: 48000, cost: 192.00 },
        { date: '2024-03-07', activeUsers: 19, totalRequests: 1750, tokensUsed: 72000, cost: 288.00 }
    ];

    const totalCost = mockUsageData.reduce((sum, day) => sum + day.cost, 0);
    const averageDailyCost = totalCost / mockUsageData.length;
    const totalRequests = mockUsageData.reduce((sum, day) => sum + day.totalRequests, 0);
    const totalTokens = mockUsageData.reduce((sum, day) => sum + day.tokensUsed, 0);

    const getUsagePercentage = () => {
        return (currentPlan.usedLicenses / currentPlan.totalLicenses) * 100;
    };

    const getUsageColor = (percentage: number) => {
        if (percentage >= 90) return 'text-red-600';
        if (percentage >= 75) return 'text-yellow-600';
        return 'text-green-600';
    };

    return (
        <div className="max-w-7xl mx-auto p-6">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">License Tracking</h1>
                <p className="text-gray-600">Monitor your license usage and optimize your team's AI consumption</p>
            </div>

            {/* Current Plan Overview */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white mb-8">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-2xl font-bold mb-2">{currentPlan.name}</h2>
                        <p className="text-blue-100">${currentPlan.pricePerLicense}/license per {currentPlan.billingPeriod}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-blue-100 text-sm">Next billing</p>
                        <p className="text-xl font-semibold">{currentPlan.nextBillingDate}</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white bg-opacity-20 rounded-xl p-4">
                        <p className="text-blue-100 text-sm mb-1">Total Licenses</p>
                        <p className="text-3xl font-bold">{currentPlan.totalLicenses}</p>
                    </div>
                    <div className="bg-white bg-opacity-20 rounded-xl p-4">
                        <p className="text-blue-100 text-sm mb-1">Used Licenses</p>
                        <p className="text-3xl font-bold">{currentPlan.usedLicenses}</p>
                    </div>
                    <div className="bg-white bg-opacity-20 rounded-xl p-4">
                        <p className="text-blue-100 text-sm mb-1">Available</p>
                        <p className="text-3xl font-bold">{currentPlan.availableLicenses}</p>
                    </div>
                </div>

                {/* Usage Bar */}
                <div className="mt-6">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-blue-100 text-sm">License Usage</span>
                        <span className={`text-sm font-semibold ${getUsageColor(getUsagePercentage())}`}>
                            {getUsagePercentage().toFixed(1)}%
                        </span>
                    </div>
                    <div className="w-full bg-white bg-opacity-20 rounded-full h-3">
                        <div
                            className="bg-white rounded-full h-3 transition-all duration-500"
                            style={{ width: `${getUsagePercentage()}%` }}
                        ></div>
                    </div>
                </div>
            </div>

            {/* Usage Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                    <div className="flex items-center">
                        <div className="p-3 bg-green-100 rounded-lg">
                            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                            </svg>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Total Requests</p>
                            <p className="text-2xl font-bold text-gray-900">{totalRequests.toLocaleString()}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                    <div className="flex items-center">
                        <div className="p-3 bg-blue-100 rounded-lg">
                            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Tokens Used</p>
                            <p className="text-2xl font-bold text-gray-900">{(totalTokens / 1000).toFixed(0)}K</p>
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
                            <p className="text-sm font-medium text-gray-600">Total Cost</p>
                            <p className="text-2xl font-bold text-gray-900">${totalCost.toFixed(2)}</p>
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
                            <p className="text-sm font-medium text-gray-600">Avg Daily Cost</p>
                            <p className="text-2xl font-bold text-gray-900">${averageDailyCost.toFixed(2)}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Usage Chart */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-8">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-gray-900">Usage Over Time</h3>
                    <div className="flex space-x-2">
                        {(['7d', '30d', '90d'] as const).map((period) => (
                            <button
                                key={period}
                                onClick={() => setSelectedPeriod(period)}
                                className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                                    selectedPeriod === period
                                        ? 'bg-blue-100 text-blue-700'
                                        : 'text-gray-500 hover:text-gray-700'
                                }`}
                            >
                                {period}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="h-64 flex items-end space-x-2">
                    {mockUsageData.map((day, index) => {
                        const maxUsers = Math.max(...mockUsageData.map(d => d.activeUsers));
                        const height = (day.activeUsers / maxUsers) * 100;
                        
                        return (
                            <div key={index} className="flex-1 flex flex-col items-center">
                                <div
                                    className="w-full bg-gradient-to-t from-blue-500 to-blue-400 rounded-t-lg transition-all duration-500 hover:from-blue-600 hover:to-blue-500"
                                    style={{ height: `${height}%` }}
                                ></div>
                                <div className="mt-2 text-xs text-gray-500">
                                    {new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                </div>
                                <div className="text-xs font-medium text-gray-700 mt-1">
                                    {day.activeUsers}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Detailed Usage Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900">Daily Usage Details</h3>
                </div>
                
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Date
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Active Users
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Requests
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Tokens
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Cost
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {mockUsageData.map((day, index) => (
                                <tr key={index} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {new Date(day.date).toLocaleDateString('en-US', { 
                                            weekday: 'short', 
                                            month: 'short', 
                                            day: 'numeric' 
                                        })}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                            {day.activeUsers}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {day.totalRequests.toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {(day.tokensUsed / 1000).toFixed(0)}K
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        ${day.cost.toFixed(2)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};
