import React, { useState } from 'react';

interface BillingItem {
    id: string;
    date: string;
    description: string;
    amount: number;
    status: 'paid' | 'pending' | 'failed';
    invoiceNumber: string;
    type: 'subscription' | 'usage' | 'overage';
}

interface PaymentMethod {
    id: string;
    type: 'card' | 'bank';
    last4: string;
    brand?: string;
    expiryMonth?: number;
    expiryYear?: number;
    isDefault: boolean;
}

export const B2BBillingDashboard: React.FC = () => {
    const [selectedPeriod, setSelectedPeriod] = useState<'current' | 'previous'>('current');

    const currentUsage = {
        baseSubscription: 300.00,
        usageCharges: 125.50,
        overageCharges: 0.00,
        total: 425.50,
        nextBillingDate: '2024-04-15',
        licensesUsed: 18,
        licensesTotal: 25
    };

    const mockBillingHistory: BillingItem[] = [
        {
            id: '1',
            date: '2024-03-15',
            description: 'Professional Plan - 25 licenses',
            amount: 300.00,
            status: 'paid',
            invoiceNumber: 'INV-2024-00315',
            type: 'subscription'
        },
        {
            id: '2',
            date: '2024-03-15',
            description: 'Usage charges - 45,000 tokens',
            amount: 125.50,
            status: 'paid',
            invoiceNumber: 'INV-2024-00315',
            type: 'usage'
        },
        {
            id: '3',
            date: '2024-02-15',
            description: 'Professional Plan - 25 licenses',
            amount: 300.00,
            status: 'paid',
            invoiceNumber: 'INV-2024-00215',
            type: 'subscription'
        },
        {
            id: '4',
            date: '2024-02-15',
            description: 'Usage charges - 38,000 tokens',
            amount: 95.20,
            status: 'paid',
            invoiceNumber: 'INV-2024-00215',
            type: 'usage'
        },
        {
            id: '5',
            date: '2024-01-15',
            description: 'Professional Plan - 25 licenses',
            amount: 300.00,
            status: 'paid',
            invoiceNumber: 'INV-2024-00115',
            type: 'subscription'
        }
    ];

    const paymentMethods: PaymentMethod[] = [
        {
            id: '1',
            type: 'card',
            last4: '4242',
            brand: 'Visa',
            expiryMonth: 12,
            expiryYear: 2025,
            isDefault: true
        },
        {
            id: '2',
            type: 'bank',
            last4: '1234',
            isDefault: false
        }
    ];

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'paid': return 'bg-green-100 text-green-800';
            case 'pending': return 'bg-yellow-100 text-yellow-800';
            case 'failed': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getTypeColor = (type: string) => {
        switch (type) {
            case 'subscription': return 'bg-blue-100 text-blue-800';
            case 'usage': return 'bg-purple-100 text-purple-800';
            case 'overage': return 'bg-orange-100 text-orange-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="max-w-7xl mx-auto p-6">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Billing & Invoices</h1>
                <p className="text-gray-600">Manage your subscription, view invoices, and track usage costs</p>
            </div>

            {/* Current Usage Overview */}
            <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-2xl p-8 text-white mb-8">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-2xl font-bold mb-2">Current Billing Period</h2>
                        <p className="text-green-100">Next billing: {currentUsage.nextBillingDate}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-green-100 text-sm">Current Total</p>
                        <p className="text-4xl font-bold">${currentUsage.total.toFixed(2)}</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="bg-white bg-opacity-20 rounded-xl p-4">
                        <p className="text-green-100 text-sm mb-1">Base Subscription</p>
                        <p className="text-2xl font-bold">${currentUsage.baseSubscription.toFixed(2)}</p>
                    </div>
                    <div className="bg-white bg-opacity-20 rounded-xl p-4">
                        <p className="text-green-100 text-sm mb-1">Usage Charges</p>
                        <p className="text-2xl font-bold">${currentUsage.usageCharges.toFixed(2)}</p>
                    </div>
                    <div className="bg-white bg-opacity-20 rounded-xl p-4">
                        <p className="text-green-100 text-sm mb-1">Overage Charges</p>
                        <p className="text-2xl font-bold">${currentUsage.overageCharges.toFixed(2)}</p>
                    </div>
                    <div className="bg-white bg-opacity-20 rounded-xl p-4">
                        <p className="text-green-100 text-sm mb-1">Licenses Used</p>
                        <p className="text-2xl font-bold">{currentUsage.licensesUsed}/{currentUsage.licensesTotal}</p>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                    <div className="flex items-center mb-4">
                        <div className="p-3 bg-blue-100 rounded-lg">
                            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 ml-3">Download Invoice</h3>
                    </div>
                    <p className="text-gray-600 text-sm mb-4">Get your latest invoice as PDF</p>
                    <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                        Download PDF
                    </button>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                    <div className="flex items-center mb-4">
                        <div className="p-3 bg-green-100 rounded-lg">
                            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 ml-3">Payment Methods</h3>
                    </div>
                    <p className="text-gray-600 text-sm mb-4">Manage your payment methods</p>
                    <button className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                        Manage Cards
                    </button>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                    <div className="flex items-center mb-4">
                        <div className="p-3 bg-purple-100 rounded-lg">
                            <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 ml-3">Usage Alerts</h3>
                    </div>
                    <p className="text-gray-600 text-sm mb-4">Set up usage notifications</p>
                    <button className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                        Configure Alerts
                    </button>
                </div>
            </div>

            {/* Payment Methods */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-8">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-gray-900">Payment Methods</h3>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                        Add Payment Method
                    </button>
                </div>

                <div className="space-y-4">
                    {paymentMethods.map((method) => (
                        <div key={method.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                            <div className="flex items-center space-x-4">
                                <div className="p-2 bg-gray-100 rounded-lg">
                                    {method.type === 'card' ? (
                                        <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                        </svg>
                                    ) : (
                                        <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                        </svg>
                                    )}
                                </div>
                                <div>
                                    <p className="font-medium text-gray-900">
                                        {method.type === 'card' ? `${method.brand} •••• ${method.last4}` : `Bank Account •••• ${method.last4}`}
                                    </p>
                                    {method.type === 'card' && (
                                        <p className="text-sm text-gray-500">
                                            Expires {method.expiryMonth}/{method.expiryYear}
                                        </p>
                                    )}
                                </div>
                                {method.isDefault && (
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                        Default
                                    </span>
                                )}
                            </div>
                            <div className="flex items-center space-x-2">
                                <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                </button>
                                <button className="p-2 text-red-400 hover:text-red-600 transition-colors">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Billing History */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                <div className="px-6 py-4 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-gray-900">Billing History</h3>
                        <div className="flex space-x-2">
                            <button
                                onClick={() => setSelectedPeriod('current')}
                                className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                                    selectedPeriod === 'current'
                                        ? 'bg-blue-100 text-blue-700'
                                        : 'text-gray-500 hover:text-gray-700'
                                }`}
                            >
                                Current Year
                            </button>
                            <button
                                onClick={() => setSelectedPeriod('previous')}
                                className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                                    selectedPeriod === 'previous'
                                        ? 'bg-blue-100 text-blue-700'
                                        : 'text-gray-500 hover:text-gray-700'
                                }`}
                            >
                                Previous Year
                            </button>
                        </div>
                    </div>
                </div>
                
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Date
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Description
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Type
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Amount
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Invoice
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {mockBillingHistory.map((item) => (
                                <tr key={item.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {new Date(item.date).toLocaleDateString('en-US', { 
                                            year: 'numeric',
                                            month: 'short', 
                                            day: 'numeric' 
                                        })}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-900">
                                        {item.description}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(item.type)}`}>
                                            {item.type}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        ${item.amount.toFixed(2)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                                            {item.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        <button className="text-blue-600 hover:text-blue-800 font-medium">
                                            {item.invoiceNumber}
                                        </button>
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
