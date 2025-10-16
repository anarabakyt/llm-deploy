import React, { useState } from 'react';

interface B2BPlan {
    id: string;
    name: string;
    description: string;
    minUsers: number;
    maxUsers: number;
    pricePerUser: number;
    period: 'month' | 'year';
    features: string[];
    popular?: boolean;
    buttonText: string;
    buttonVariant: 'primary' | 'secondary';
    savings?: string;
}

export const B2BPricingPage: React.FC = () => {
    const [billingPeriod, setBillingPeriod] = useState<'month' | 'year'>('month');
    const [selectedUsers, setSelectedUsers] = useState(25);

    const plans: B2BPlan[] = [
        {
            id: 'starter-team',
            name: 'Starter Team',
            description: 'Perfect for small teams getting started',
            minUsers: 5,
            maxUsers: 25,
            pricePerUser: billingPeriod === 'month' ? 15 : 150,
            period: billingPeriod,
            features: [
                '5-25 user licenses',
                'Basic LLM models',
                'Team collaboration',
                'Standard support',
                'Basic analytics',
                'API access',
                '1 admin account'
            ],
            buttonText: 'Start Free Trial',
            buttonVariant: 'secondary'
        },
        {
            id: 'professional',
            name: 'Professional',
            description: 'Best for growing companies',
            minUsers: 10,
            maxUsers: 100,
            pricePerUser: billingPeriod === 'month' ? 12 : 120,
            period: billingPeriod,
            features: [
                '10-100 user licenses',
                'All LLM models',
                'Advanced team features',
                'Priority support',
                'Advanced analytics',
                'Full API access',
                'Admin panel access',
                'Custom integrations',
                'SSO integration'
            ],
            popular: true,
            buttonText: 'Start Free Trial',
            buttonVariant: 'primary',
            savings: 'Save 20%'
        },
        {
            id: 'enterprise',
            name: 'Enterprise',
            description: 'For large organizations',
            minUsers: 50,
            maxUsers: 1000,
            pricePerUser: billingPeriod === 'month' ? 8 : 80,
            period: billingPeriod,
            features: [
                '50-1000+ user licenses',
                'All LLM models',
                'Enterprise features',
                '24/7 dedicated support',
                'Full analytics dashboard',
                'Advanced API access',
                'Custom admin controls',
                'White-label options',
                'Advanced SSO',
                'Compliance tools',
                'Custom SLA'
            ],
            buttonText: 'Contact Sales',
            buttonVariant: 'secondary',
            savings: 'Save 33%'
        }
    ];

    const calculateTotalPrice = (plan: B2BPlan) => {
        const users = Math.max(plan.minUsers, Math.min(plan.maxUsers, selectedUsers));
        return users * plan.pricePerUser;
    };

    const handlePlanSelect = (planId: string) => {
        console.log('Selected B2B plan:', planId, 'Users:', selectedUsers);
        // Handle plan selection logic
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-12 pb-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-16">
                    <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-100 text-blue-800 text-sm font-medium mb-6">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                        Enterprise Solutions
                    </div>
                    
                    <h1 className="text-5xl font-bold text-gray-900 mb-6">
                        Scale Your Team with
                        <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> AI Power</span>
                    </h1>
                    <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                        Choose the perfect plan for your organization. Pay only for the users you need with flexible licensing options.
                    </p>
                    
                    {/* Billing Toggle */}
                    <div className="flex items-center justify-center space-x-4 mb-8">
                        <span className={`text-sm font-medium ${billingPeriod === 'month' ? 'text-gray-900' : 'text-gray-500'}`}>
                            Monthly
                        </span>
                        <button
                            onClick={() => setBillingPeriod(billingPeriod === 'month' ? 'year' : 'month')}
                            className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        >
                            <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                    billingPeriod === 'year' ? 'translate-x-6' : 'translate-x-1'
                                }`}
                            />
                        </button>
                        <span className={`text-sm font-medium ${billingPeriod === 'year' ? 'text-gray-900' : 'text-gray-500'}`}>
                            Yearly
                        </span>
                        {billingPeriod === 'year' && (
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                                Save up to 33%
                            </span>
                        )}
                    </div>

                    {/* User Count Selector */}
                    <div className="bg-white rounded-2xl p-6 shadow-lg max-w-md mx-auto">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">How many users do you need?</h3>
                        <div className="flex items-center space-x-4">
                            <input
                                type="range"
                                min="5"
                                max="100"
                                value={selectedUsers}
                                onChange={(e) => setSelectedUsers(parseInt(e.target.value))}
                                className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                            />
                            <div className="text-center">
                                <div className="text-2xl font-bold text-blue-600">{selectedUsers}</div>
                                <div className="text-sm text-gray-500">users</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Pricing Cards */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
                    {plans.map((plan) => (
                        <div
                            key={plan.id}
                            className={`relative bg-white rounded-3xl shadow-xl p-8 h-full flex flex-col transform transition-all duration-300 hover:scale-105 ${
                                plan.popular ? 'ring-4 ring-blue-500 ring-opacity-50 scale-105' : ''
                            }`}
                        >
                            {plan.popular && (
                                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                                    <span className="inline-flex items-center px-6 py-2 rounded-full text-sm font-bold bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg">
                                        Most Popular
                                    </span>
                                </div>
                            )}
                            
                            {plan.savings && (
                                <div className="absolute -top-2 -right-2">
                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-green-500 text-white">
                                        {plan.savings}
                                    </span>
                                </div>
                            )}

                            <div className="text-center mb-8">
                                <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                                <p className="text-gray-600 mb-6">{plan.description}</p>
                                
                                <div className="mb-6">
                                    <div className="text-4xl font-bold text-gray-900 mb-2">
                                        ${plan.pricePerUser}
                                        <span className="text-lg text-gray-500">/user</span>
                                    </div>
                                    <div className="text-sm text-gray-500">
                                        per {plan.period === 'month' ? 'month' : 'year'}
                                    </div>
                                    <div className="text-lg font-semibold text-blue-600 mt-2">
                                        Total: ${calculateTotalPrice(plan).toLocaleString()}
                                        <span className="text-sm text-gray-500">/month</span>
                                    </div>
                                </div>

                                <button
                                    onClick={() => handlePlanSelect(plan.id)}
                                    className={`w-full py-4 px-6 rounded-xl font-bold text-lg transition-all duration-300 ${
                                        plan.buttonVariant === 'primary'
                                            ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl'
                                            : 'bg-gray-100 text-gray-900 hover:bg-gray-200 border-2 border-gray-200 hover:border-gray-300'
                                    }`}
                                >
                                    {plan.buttonText}
                                </button>
                            </div>

                            <div className="flex-1">
                                <h4 className="text-lg font-semibold text-gray-900 mb-4">What's included:</h4>
                                <ul className="space-y-3">
                                    {plan.features.map((feature, index) => (
                                        <li key={index} className="flex items-start">
                                            <svg className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                            <span className="text-gray-700">{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Enterprise CTA */}
                <div className="bg-gradient-to-r from-gray-900 to-blue-900 rounded-3xl p-12 text-center text-white">
                    <h2 className="text-4xl font-bold mb-4">Need a Custom Solution?</h2>
                    <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                        We offer custom enterprise plans with unlimited users, dedicated support, and tailored features for your organization.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button className="px-8 py-4 bg-white text-gray-900 rounded-xl font-bold text-lg hover:bg-gray-100 transition-colors">
                            Contact Sales
                        </button>
                        <button className="px-8 py-4 border-2 border-white text-white rounded-xl font-bold text-lg hover:bg-white hover:text-gray-900 transition-colors">
                            Schedule Demo
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
