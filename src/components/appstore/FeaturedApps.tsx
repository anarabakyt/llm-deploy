import React from 'react';
import type { App } from './AppStoreDemo';

interface FeaturedAppsProps {
    apps: App[];
    onAppSelect: (app: App) => void;
}

export const FeaturedApps: React.FC<FeaturedAppsProps> = ({ apps, onAppSelect }) => {
    if (apps.length === 0) return null;

    return (
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-3xl font-bold mb-2">⭐ Featured Apps</h2>
                    <p className="text-blue-100">Hand-picked integrations and tools to enhance your experience</p>
                </div>
                <div className="text-6xl opacity-20">🚀</div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {apps.map((app) => (
                    <div
                        key={app.id}
                        onClick={() => onAppSelect(app)}
                        className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-6 hover:bg-opacity-20 transition-all duration-300 cursor-pointer hover:scale-105 border border-white border-opacity-20"
                    >
                        <div className="flex items-start space-x-4">
                            <div className="text-4xl">{app.icon}</div>
                            <div className="flex-1">
                                <h3 className="text-lg font-semibold mb-2">{app.name}</h3>
                                <p className="text-blue-100 text-sm mb-3 line-clamp-2">
                                    {app.shortDescription}
                                </p>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-1">
                                        <span className="text-yellow-300">★</span>
                                        <span className="text-sm font-medium">{app.rating}</span>
                                        <span className="text-blue-200 text-xs">({app.reviewCount})</span>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-lg font-bold">
                                            ${app.price}
                                        </div>
                                        <div className="text-xs text-blue-200">
                                            {app.downloads.toLocaleString()} downloads
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
