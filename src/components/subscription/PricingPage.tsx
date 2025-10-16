import React, { useState } from 'react';

interface PricingPlan {
    id: string;
    name: string;
    price: number;
    period: 'month' | 'year';
    description: string;
    features: string[];
    popular?: boolean;
    buttonText: string;
    buttonVariant: 'primary' | 'secondary';
}

export const PricingPage: React.FC = () => {
    const [billingPeriod, setBillingPeriod] = useState<'month' | 'year'>('month');

    const plans: PricingPlan[] = [
        {
            id: 'free',
            name: 'Free',
            price: 0,
            period: 'month',
            description: 'Perfect for getting started',
            features: [
                '5 requests per day',
                'Basic LLM models',
                'Standard support',
                'Basic analytics',
                '1 user account'
            ],
            buttonText: 'Get Started',
            buttonVariant: 'secondary'
        },
        {
            id: 'pro',
            name: 'Pro',
            price: billingPeriod === 'month' ? 29 : 290,
            period: billingPeriod,
            description: 'Best for professionals',
            features: [
                '100 requests per day',
                'All LLM models',
                'Priority support',
                'Advanced analytics',
                'User management',
                'API access',
                'Custom integrations'
            ],
            popular: true,
            buttonText: 'Start Pro',
            buttonVariant: 'primary'
        },
        {
            id: 'enterprise',
            name: 'Enterprise',
            price: billingPeriod === 'month' ? 99 : 990,
            period: billingPeriod,
            description: 'For teams and organizations',
            features: [
                'Unlimited requests',
                'All LLM models',
                '24/7 support',
                'Full analytics dashboard',
                'Team management',
                'Advanced API access',
                'Custom integrations',
                'Admin panel access',
                'White-label options'
            ],
            buttonText: 'Contact Sales',
            buttonVariant: 'secondary'
        }
    ];

    const handlePlanSelect = (planId: string) => {
        console.log('Selected plan:', planId);
        // Handle plan selection logic
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12 pb-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-16">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">
                        Choose Your Plan
                    </h1>
                    <p className="text-xl text-gray-600 mb-8">
                        Select the perfect plan for your needs
                    </p>
                    
                    {/* Billing Toggle */}
                    <div className="flex items-center justify-center space-x-4">
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
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                Save 20%
                            </span>
                        )}
                    </div>
                </div>

                {/* Pricing Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                    {plans.map((plan) => (
                        <div
                            key={plan.id}
                            className={`relative bg-white rounded-xl shadow-lg p-6 h-full flex flex-col ${
                                plan.popular ? 'ring-2 ring-blue-500 scale-105' : ''
                            }`}
                        >
                            {plan.popular && (
                                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                                    <span className="inline-flex items-center px-4 py-1 rounded-full text-sm font-medium bg-blue-500 text-white">
                                        Most Popular
                                    </span>
                                </div>
                            )}
                            
                            <div className="text-center">
                                <h3 className="text-xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                                <p className="text-gray-600 mb-4">{plan.description}</p>
                                
                                <div className="mb-4">
                                    <span className="text-4xl font-bold text-gray-900">
                                        ${plan.price}
                                    </span>
                                    <span className="text-gray-600 ml-2">
                                        /{plan.period === 'month' ? 'month' : 'year'}
                                    </span>
                                </div>

                                <button
                                    onClick={() => handlePlanSelect(plan.id)}
                                    className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
                                        plan.buttonVariant === 'primary'
                                            ? 'bg-blue-600 text-white hover:bg-blue-700'
                                            : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                                    }`}
                                >
                                    {plan.buttonText}
                                </button>
                            </div>

                            <div className="mt-6 flex-1">
                                <h4 className="text-base font-semibold text-gray-900 mb-3">Features</h4>
                                <ul className="space-y-2">
                                    {plan.features.map((feature, index) => (
                                        <li key={index} className="flex items-start">
                                            <svg className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                            <span className="text-sm text-gray-600">{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    ))}
                </div>

                {/* FAQ Section */}
                <div className="mt-20 mb-8">
                    <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
                        Frequently Asked Questions
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                Can I change my plan anytime?
                            </h3>
                            <p className="text-gray-600">
                                Yes, you can upgrade or downgrade your plan at any time. Changes will be reflected in your next billing cycle.
                            </p>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                What payment methods do you accept?
                            </h3>
                            <p className="text-gray-600">
                                We accept all major credit cards, PayPal, and bank transfers for Enterprise plans.
                            </p>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                Is there a free trial?
                            </h3>
                            <p className="text-gray-600">
                                Yes, all paid plans come with a 14-day free trial. No credit card required to start.
                            </p>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                Can I cancel anytime?
                            </h3>
                            <p className="text-gray-600">
                                Absolutely. You can cancel your subscription at any time with no cancellation fees.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

