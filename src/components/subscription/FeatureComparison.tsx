import React from 'react';

interface Feature {
    name: string;
    description?: string;
    free: boolean | string;
    pro: boolean | string;
    enterprise: boolean | string;
}

export const FeatureComparison: React.FC = () => {
    const features: Feature[] = [
        {
            name: 'API Requests per day',
            free: '5',
            pro: '100',
            enterprise: 'Unlimited'
        },
        {
            name: 'LLM Models',
            free: 'Basic models only',
            pro: 'All models',
            enterprise: 'All models + custom'
        },
        {
            name: 'Response Time',
            free: 'Standard',
            pro: 'Priority',
            enterprise: 'Highest priority'
        },
        {
            name: 'User Accounts',
            free: '1',
            pro: 'Up to 5',
            enterprise: 'Unlimited'
        },
        {
            name: 'Analytics Dashboard',
            free: 'Basic',
            pro: 'Advanced',
            enterprise: 'Full dashboard + custom reports'
        },
        {
            name: 'API Access',
            free: false,
            pro: true,
            enterprise: true
        },
        {
            name: 'Webhook Support',
            free: false,
            pro: true,
            enterprise: true
        },
        {
            name: 'Custom Integrations',
            free: false,
            pro: 'Limited',
            enterprise: 'Full support'
        },
        {
            name: 'Priority Support',
            free: false,
            pro: true,
            enterprise: '24/7 support'
        },
        {
            name: 'Admin Panel',
            free: false,
            pro: false,
            enterprise: true
        },
        {
            name: 'White-label Options',
            free: false,
            pro: false,
            enterprise: true
        },
        {
            name: 'SLA Guarantee',
            free: false,
            pro: false,
            enterprise: '99.9% uptime'
        },
        {
            name: 'Data Export',
            free: false,
            pro: 'CSV only',
            enterprise: 'All formats + API'
        },
        {
            name: 'Custom Training',
            free: false,
            pro: false,
            enterprise: true
        },
        {
            name: 'Dedicated Support',
            free: false,
            pro: false,
            enterprise: true
        }
    ];

    const renderFeatureValue = (value: boolean | string) => {
        if (typeof value === 'boolean') {
            return value ? (
                <svg className="w-5 h-5 text-green-500 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
            ) : (
                <svg className="w-5 h-5 text-gray-300 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
            );
        }
        return <span className="text-sm text-gray-900">{value}</span>;
    };

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">
                    Feature Comparison
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                    Compare features across all plans
                </p>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-gray-200">
                            <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">
                                Features
                            </th>
                            <th className="px-6 py-4 text-center text-sm font-medium text-gray-900">
                                Free
                            </th>
                            <th className="px-6 py-4 text-center text-sm font-medium text-gray-900 bg-blue-50">
                                Pro
                            </th>
                            <th className="px-6 py-4 text-center text-sm font-medium text-gray-900">
                                Enterprise
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {features.map((feature, index) => (
                            <tr key={index} className="hover:bg-gray-50">
                                <td className="px-6 py-4">
                                    <div>
                                        <div className="text-sm font-medium text-gray-900">
                                            {feature.name}
                                        </div>
                                        {feature.description && (
                                            <div className="text-sm text-gray-500 mt-1">
                                                {feature.description}
                                            </div>
                                        )}
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-center">
                                    {renderFeatureValue(feature.free)}
                                </td>
                                <td className="px-6 py-4 text-center bg-blue-50">
                                    {renderFeatureValue(feature.pro)}
                                </td>
                                <td className="px-6 py-4 text-center">
                                    {renderFeatureValue(feature.enterprise)}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Plan Pricing Summary */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                        <div className="text-2xl font-bold text-gray-900">$0</div>
                        <div className="text-sm text-gray-600">Free</div>
                    </div>
                    <div className="bg-blue-50 rounded-lg p-3">
                        <div className="text-2xl font-bold text-blue-900">$29</div>
                        <div className="text-sm text-blue-700">Pro / month</div>
                    </div>
                    <div>
                        <div className="text-2xl font-bold text-gray-900">$99</div>
                        <div className="text-sm text-gray-600">Enterprise / month</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

