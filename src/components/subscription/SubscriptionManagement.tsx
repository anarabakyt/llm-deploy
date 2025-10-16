import React, { useState } from 'react';

interface Subscription {
    id: string;
    plan: string;
    status: 'active' | 'cancelled' | 'past_due' | 'trialing';
    currentPeriodStart: string;
    currentPeriodEnd: string;
    cancelAtPeriodEnd: boolean;
    amount: number;
    currency: string;
    nextBillingDate?: string;
}

interface BillingHistoryItem {
    id: string;
    date: string;
    amount: number;
    status: 'paid' | 'pending' | 'failed';
    description: string;
    invoiceUrl?: string;
}

export const SubscriptionManagement: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'overview' | 'billing' | 'usage'>('overview');
    
    // Mock data - in real app, this would come from API
    const subscription: Subscription = {
        id: 'sub_123456789',
        plan: 'Pro',
        status: 'active',
        currentPeriodStart: '2024-01-01',
        currentPeriodEnd: '2024-02-01',
        cancelAtPeriodEnd: false,
        amount: 29,
        currency: 'USD',
        nextBillingDate: '2024-02-01'
    };

    const billingHistory: BillingHistoryItem[] = [
        {
            id: 'inv_001',
            date: '2024-01-01',
            amount: 29,
            status: 'paid',
            description: 'Pro Plan - Monthly',
            invoiceUrl: '#'
        },
        {
            id: 'inv_002',
            date: '2023-12-01',
            amount: 29,
            status: 'paid',
            description: 'Pro Plan - Monthly',
            invoiceUrl: '#'
        },
        {
            id: 'inv_003',
            date: '2023-11-01',
            amount: 29,
            status: 'paid',
            description: 'Pro Plan - Monthly',
            invoiceUrl: '#'
        }
    ];

    const usageStats = {
        requestsUsed: 750,
        requestsLimit: 1000,
        requestsRemaining: 250,
        apiCallsUsed: 1200,
        apiCallsLimit: 2000,
        apiCallsRemaining: 800
    };

    const handleCancelSubscription = () => {
        if (window.confirm('Are you sure you want to cancel your subscription? You will lose access to Pro features at the end of your billing period.')) {
            // Handle cancellation logic
            console.log('Subscription cancelled');
        }
    };

    const handleReactivateSubscription = () => {
        // Handle reactivation logic
        console.log('Subscription reactivated');
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active':
                return 'bg-green-100 text-green-800';
            case 'cancelled':
                return 'bg-red-100 text-red-800';
            case 'past_due':
                return 'bg-yellow-100 text-yellow-800';
            case 'trialing':
                return 'bg-blue-100 text-blue-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    Subscription Management
                </h1>
                <p className="text-gray-600">
                    Manage your subscription, billing, and usage
                </p>
            </div>

            {/* Tab Navigation */}
            <div className="border-b border-gray-200 mb-8">
                <nav className="-mb-px flex space-x-8">
                    {[
                        { id: 'overview', name: 'Overview' },
                        { id: 'billing', name: 'Billing History' },
                        { id: 'usage', name: 'Usage' }
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`py-2 px-1 border-b-2 font-medium text-sm ${
                                activeTab === tab.id
                                    ? 'border-blue-500 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                        >
                            {tab.name}
                        </button>
                    ))}
                </nav>
            </div>

            {/* Overview Tab */}
            {activeTab === 'overview' && (
                <div className="space-y-6">
                    {/* Current Plan Card */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="text-xl font-semibold text-gray-900">
                                    Current Plan
                                </h3>
                                <p className="text-gray-600">
                                    {subscription.plan} Plan
                                </p>
                            </div>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(subscription.status)}`}>
                                {subscription.status.charAt(0).toUpperCase() + subscription.status.slice(1)}
                            </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                            <div>
                                <p className="text-sm text-gray-600">Amount</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    ${subscription.amount}/{subscription.currency}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Billing Period</p>
                                <p className="text-lg font-semibold text-gray-900">
                                    {formatDate(subscription.currentPeriodStart)} - {formatDate(subscription.currentPeriodEnd)}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Next Billing</p>
                                <p className="text-lg font-semibold text-gray-900">
                                    {subscription.nextBillingDate ? formatDate(subscription.nextBillingDate) : 'N/A'}
                                </p>
                            </div>
                        </div>

                        <div className="flex space-x-4">
                            <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                                Change Plan
                            </button>
                            <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors">
                                Update Payment Method
                            </button>
                            {subscription.cancelAtPeriodEnd ? (
                                <button
                                    onClick={handleReactivateSubscription}
                                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                                >
                                    Reactivate
                                </button>
                            ) : (
                                <button
                                    onClick={handleCancelSubscription}
                                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                                >
                                    Cancel Subscription
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <h4 className="text-lg font-semibold text-gray-900 mb-4">
                                Quick Actions
                            </h4>
                            <div className="space-y-3">
                                <button className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-md transition-colors">
                                    Download Invoice
                                </button>
                                <button className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-md transition-colors">
                                    Update Billing Address
                                </button>
                                <button className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-md transition-colors">
                                    View Tax Information
                                </button>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <h4 className="text-lg font-semibold text-gray-900 mb-4">
                                Support
                            </h4>
                            <p className="text-gray-600 mb-4">
                                Need help with your subscription?
                            </p>
                            <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                                Contact Support
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Billing History Tab */}
            {activeTab === 'billing' && (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-900">
                            Billing History
                        </h3>
                    </div>
                    <div className="divide-y divide-gray-200">
                        {billingHistory.map((item) => (
                            <div key={item.id} className="px-6 py-4 flex justify-between items-center">
                                <div>
                                    <p className="font-medium text-gray-900">
                                        {item.description}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        {formatDate(item.date)}
                                    </p>
                                </div>
                                <div className="flex items-center space-x-4">
                                    <span className="text-lg font-semibold text-gray-900">
                                        ${item.amount}
                                    </span>
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                        item.status === 'paid' ? 'bg-green-100 text-green-800' :
                                        item.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                        'bg-red-100 text-red-800'
                                    }`}>
                                        {item.status}
                                    </span>
                                    {item.invoiceUrl && (
                                        <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                                            Download
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Usage Tab */}
            {activeTab === 'usage' && (
                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* API Requests */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <h4 className="text-lg font-semibold text-gray-900 mb-4">
                                API Requests
                            </h4>
                            <div className="mb-4">
                                <div className="flex justify-between text-sm text-gray-600 mb-2">
                                    <span>Used this month</span>
                                    <span>{usageStats.requestsUsed} / {usageStats.requestsLimit}</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div
                                        className="bg-blue-600 h-2 rounded-full"
                                        style={{ width: `${(usageStats.requestsUsed / usageStats.requestsLimit) * 100}%` }}
                                    ></div>
                                </div>
                            </div>
                            <p className="text-sm text-gray-600">
                                {usageStats.requestsRemaining} requests remaining
                            </p>
                        </div>

                        {/* API Calls */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <h4 className="text-lg font-semibold text-gray-900 mb-4">
                                API Calls
                            </h4>
                            <div className="mb-4">
                                <div className="flex justify-between text-sm text-gray-600 mb-2">
                                    <span>Used this month</span>
                                    <span>{usageStats.apiCallsUsed} / {usageStats.apiCallsLimit}</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div
                                        className="bg-green-600 h-2 rounded-full"
                                        style={{ width: `${(usageStats.apiCallsUsed / usageStats.apiCallsLimit) * 100}%` }}
                                    ></div>
                                </div>
                            </div>
                            <p className="text-sm text-gray-600">
                                {usageStats.apiCallsRemaining} calls remaining
                            </p>
                        </div>
                    </div>

                    {/* Usage Details */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <h4 className="text-lg font-semibold text-gray-900 mb-4">
                            Usage Details
                        </h4>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center py-2 border-b border-gray-100">
                                <span className="text-gray-600">Daily average requests</span>
                                <span className="font-semibold text-gray-900">25</span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b border-gray-100">
                                <span className="text-gray-600">Peak usage day</span>
                                <span className="font-semibold text-gray-900">Dec 15, 2024 (45 requests)</span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b border-gray-100">
                                <span className="text-gray-600">Reset date</span>
                                <span className="font-semibold text-gray-900">Feb 1, 2024</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

