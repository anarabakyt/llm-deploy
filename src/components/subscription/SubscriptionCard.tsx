import React from 'react';

interface SubscriptionCardProps {
    plan: {
        id: string;
        name: string;
        price: number;
        period: 'month' | 'year';
        description: string;
        features: string[];
        popular?: boolean;
        buttonText: string;
        buttonVariant: 'primary' | 'secondary';
    };
    onSelect: (planId: string) => void;
    isSelected?: boolean;
    disabled?: boolean;
}

export const SubscriptionCard: React.FC<SubscriptionCardProps> = ({
    plan,
    onSelect,
    isSelected = false,
    disabled = false
}) => {
    const handleClick = () => {
        if (!disabled) {
            onSelect(plan.id);
        }
    };

    return (
        <div
            className={`relative bg-white rounded-2xl shadow-lg p-8 transition-all duration-200 ${
                plan.popular ? 'ring-2 ring-blue-500 scale-105' : ''
            } ${isSelected ? 'ring-2 ring-green-500' : ''} ${
                disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:shadow-xl'
            }`}
            onClick={handleClick}
        >
            {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="inline-flex items-center px-4 py-1 rounded-full text-sm font-medium bg-blue-500 text-white">
                        Most Popular
                    </span>
                </div>
            )}

            {isSelected && (
                <div className="absolute -top-2 -right-2">
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                    </div>
                </div>
            )}
            
            <div className="text-center">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                <p className="text-gray-600 mb-6">{plan.description}</p>
                
                <div className="mb-6">
                    <span className="text-5xl font-bold text-gray-900">
                        ${plan.price}
                    </span>
                    <span className="text-gray-600 ml-2">
                        /{plan.period === 'month' ? 'month' : 'year'}
                    </span>
                    {plan.period === 'year' && plan.price > 0 && (
                        <div className="mt-2">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                Save 20%
                            </span>
                        </div>
                    )}
                </div>

                <button
                    onClick={handleClick}
                    disabled={disabled}
                    className={`w-full py-3 px-6 rounded-lg font-medium transition-colors ${
                        plan.buttonVariant === 'primary'
                            ? 'bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-400'
                            : 'bg-gray-100 text-gray-900 hover:bg-gray-200 disabled:bg-gray-200'
                    } ${isSelected ? 'bg-green-600 text-white hover:bg-green-700' : ''}`}
                >
                    {isSelected ? 'Selected' : plan.buttonText}
                </button>
            </div>

            <div className="mt-8">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Features</h4>
                <ul className="space-y-3">
                    {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-start">
                            <svg className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            <span className="text-gray-600">{feature}</span>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Additional Info for Enterprise Plan */}
            {plan.id === 'enterprise' && (
                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                    <div className="flex items-start">
                        <svg className="w-5 h-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                        <div>
                            <p className="text-sm font-medium text-blue-900">
                                Custom pricing available
                            </p>
                            <p className="text-sm text-blue-700">
                                Contact our sales team for volume discounts and custom features.
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Free Trial Badge */}
            {plan.price > 0 && (
                <div className="mt-4 text-center">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        14-day free trial
                    </span>
                </div>
            )}
        </div>
    );
};

