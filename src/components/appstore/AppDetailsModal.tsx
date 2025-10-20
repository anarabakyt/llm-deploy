import React from 'react';
import type { App } from './AppStoreDemo';

interface AppDetailsModalProps {
    app: App;
    onClose: () => void;
    onAddToCart: (app: App) => void;
    onPurchase: (app: App) => void;
}

export const AppDetailsModal: React.FC<AppDetailsModalProps> = ({ 
    app, 
    onClose, 
    onAddToCart, 
    onPurchase 
}) => {
    const renderStars = (rating: number) => {
        return Array.from({ length: 5 }, (_, i) => (
            <span
                key={i}
                className={`text-xl ${
                    i < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300'
                }`}
            >
                ★
            </span>
        ));
    };

    const formatPrice = (price: number, currency: string) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency,
        }).format(price);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 p-8 text-white rounded-t-2xl">
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-white hover:text-gray-200 transition-colors"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                    
                    <div className="flex items-start space-x-6">
                        <div className="text-8xl">{app.icon}</div>
                        <div className="flex-1">
                            <h1 className="text-3xl font-bold mb-2">{app.name}</h1>
                            <p className="text-blue-100 text-lg mb-4">{app.shortDescription}</p>
                            <div className="flex items-center space-x-6">
                                <div className="flex items-center space-x-2">
                                    <div className="flex">{renderStars(app.rating)}</div>
                                    <span className="text-lg font-semibold">{app.rating}</span>
                                    <span className="text-blue-200">({app.reviewCount} reviews)</span>
                                </div>
                                <div className="text-blue-200">
                                    {app.downloads.toLocaleString()} downloads
                                </div>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="text-3xl font-bold mb-2">
                                {app.isPurchased ? 'Owned' : formatPrice(app.price, app.currency)}
                            </div>
                            <div className="text-blue-200 text-sm">
                                Version {app.version}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="p-8">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Main Content */}
                        <div className="lg:col-span-2 space-y-8">
                            {/* Description */}
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 mb-4">About this app</h2>
                                <p className="text-gray-700 leading-relaxed">{app.description}</p>
                            </div>

                            {/* Features */}
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 mb-4">Features</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {app.features.map((feature, index) => (
                                        <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                                            <span className="text-green-500">✓</span>
                                            <span className="text-gray-700">{feature}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Screenshots */}
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 mb-4">Screenshots</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {app.screenshots.map((screenshot, index) => (
                                        <div key={index} className="bg-gray-200 rounded-lg h-48 flex items-center justify-center">
                                            <span className="text-gray-500">Screenshot {index + 1}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            {/* App Info */}
                            <div className="bg-gray-50 rounded-xl p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">App Information</h3>
                                <div className="space-y-3">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Developer:</span>
                                        <span className="font-medium">{app.developer}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Category:</span>
                                        <span className="font-medium capitalize">{app.category}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Size:</span>
                                        <span className="font-medium">{app.size}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Updated:</span>
                                        <span className="font-medium">{app.lastUpdated}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Requirements */}
                            <div className="bg-gray-50 rounded-xl p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Requirements</h3>
                                <ul className="space-y-2">
                                    {app.requirements.map((requirement, index) => (
                                        <li key={index} className="flex items-center space-x-2">
                                            <span className="text-blue-500">•</span>
                                            <span className="text-gray-700">{requirement}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Tags */}
                            <div className="bg-gray-50 rounded-xl p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Tags</h3>
                                <div className="flex flex-wrap gap-2">
                                    {app.tags.map((tag) => (
                                        <span
                                            key={tag}
                                            className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                                        >
                                            #{tag}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="space-y-3">
                                {!app.isPurchased ? (
                                    <>
                                        <button
                                            onClick={() => onAddToCart(app)}
                                            className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105"
                                        >
                                            Add to Cart - {formatPrice(app.price, app.currency)}
                                        </button>
                                        <button
                                            onClick={() => onPurchase(app)}
                                            className="w-full px-6 py-3 border-2 border-blue-600 text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-colors"
                                        >
                                            Buy Now
                                        </button>
                                    </>
                                ) : (
                                    <div className="w-full px-6 py-3 bg-green-100 text-green-800 font-semibold rounded-lg text-center">
                                        ✓ Already Owned
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
