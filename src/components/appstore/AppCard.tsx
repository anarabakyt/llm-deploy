import React from 'react';
import type { App } from './AppStoreDemo';

interface AppCardProps {
    app: App;
    onSelect: (app: App) => void;
    onAddToCart: (app: App) => void;
}

export const AppCard: React.FC<AppCardProps> = ({ app, onSelect, onAddToCart }) => {
    const renderStars = (rating: number) => {
        return Array.from({ length: 5 }, (_, i) => (
            <span
                key={i}
                className={`text-lg ${
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

    const getCategoryColor = (category: string) => {
        const colors = {
            integration: 'bg-blue-100 text-blue-800',
            productivity: 'bg-green-100 text-green-800',
            analytics: 'bg-purple-100 text-purple-800',
            security: 'bg-red-100 text-red-800',
            communication: 'bg-orange-100 text-orange-800',
            'ai-tools': 'bg-pink-100 text-pink-800',
        };
        return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800';
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden group">
            {/* App Icon and Banner */}
            <div className="relative h-48 bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                <div className="text-6xl">{app.icon}</div>
                {app.isFeatured && (
                    <div className="absolute top-3 right-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                        ⭐ Featured
                    </div>
                )}
                {app.isPurchased && (
                    <div className="absolute top-3 left-3 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                        ✓ Owned
                    </div>
                )}
            </div>

            <div className="p-6">
                {/* App Name and Category */}
                <div className="flex items-start justify-between mb-3">
                    <h3 className="text-lg font-semibold text-gray-900 line-clamp-1 group-hover:text-blue-600 transition-colors">
                        {app.name}
                    </h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(app.category)}`}>
                        {app.category}
                    </span>
                </div>

                {/* Description */}
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {app.shortDescription}
                </p>

                {/* Developer */}
                <p className="text-xs text-gray-500 mb-4">
                    by {app.developer}
                </p>

                {/* Rating and Downloads */}
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                        <div className="flex items-center">
                            {renderStars(app.rating)}
                        </div>
                        <span className="text-sm text-gray-600">
                            {app.rating} ({app.reviewCount})
                        </span>
                    </div>
                    <span className="text-xs text-gray-500">
                        {app.downloads.toLocaleString()} downloads
                    </span>
                </div>

                {/* Price and Actions */}
                <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                        <span className="text-xl font-bold text-gray-900">
                            {app.isPurchased ? 'Owned' : formatPrice(app.price, app.currency)}
                        </span>
                        {!app.isPurchased && (
                            <span className="text-xs text-gray-500">
                                Version {app.version}
                            </span>
                        )}
                    </div>
                    <div className="flex space-x-2">
                        <button
                            onClick={() => onSelect(app)}
                            className="px-3 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                            Details
                        </button>
                        {!app.isPurchased && (
                            <button
                                onClick={() => onAddToCart(app)}
                                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-medium rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105"
                            >
                                Add to Cart
                            </button>
                        )}
                    </div>
                </div>

                {/* Tags */}
                <div className="mt-4 flex flex-wrap gap-1">
                    {app.tags.slice(0, 3).map((tag) => (
                        <span
                            key={tag}
                            className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md"
                        >
                            #{tag}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
};
