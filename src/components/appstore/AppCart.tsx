import React from 'react';
import type { App } from './AppStoreDemo';

interface AppCartProps {
    cart: App[];
    onClose: () => void;
    onRemoveItem: (appId: string) => void;
    onPurchase: (app: App) => void;
}

export const AppCart: React.FC<AppCartProps> = ({ cart, onClose, onRemoveItem, onPurchase }) => {
    const formatPrice = (price: number, currency: string) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency,
        }).format(price);
    };

    const totalPrice = cart.reduce((sum, app) => sum + app.price, 0);

    const handlePurchaseAll = () => {
        cart.forEach(app => onPurchase(app));
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <h2 className="text-2xl font-bold text-gray-900">Shopping Cart</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Cart Items */}
                <div className="p-6">
                    {cart.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="text-6xl mb-4">🛒</div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">Your cart is empty</h3>
                            <p className="text-gray-600">Add some apps to get started!</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {cart.map((app) => (
                                <div key={app.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                                    <div className="text-3xl">{app.icon}</div>
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-gray-900">{app.name}</h3>
                                        <p className="text-sm text-gray-600">{app.developer}</p>
                                        <div className="flex items-center space-x-2 mt-1">
                                            <span className="text-yellow-400">★</span>
                                            <span className="text-sm text-gray-600">{app.rating}</span>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="font-semibold text-gray-900">
                                            {formatPrice(app.price, app.currency)}
                                        </div>
                                        <button
                                            onClick={() => onRemoveItem(app.id)}
                                            className="text-red-500 hover:text-red-700 text-sm transition-colors"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer */}
                {cart.length > 0 && (
                    <div className="border-t border-gray-200 p-6">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-lg font-semibold text-gray-900">Total:</span>
                            <span className="text-2xl font-bold text-gray-900">
                                {formatPrice(totalPrice, 'USD')}
                            </span>
                        </div>
                        <div className="flex space-x-3">
                            <button
                                onClick={onClose}
                                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                Continue Shopping
                            </button>
                            <button
                                onClick={handlePurchaseAll}
                                className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105"
                            >
                                Purchase All
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
