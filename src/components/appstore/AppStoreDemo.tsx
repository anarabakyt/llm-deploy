import React, { useState, useEffect } from 'react';
import { AppCard } from './AppCard';
import { AppDetailsModal } from './AppDetailsModal';
import { AppCategoryFilter } from './AppCategoryFilter';
import { AppSearchBar } from './AppSearchBar';
import { AppCart } from './AppCart';
import { FeaturedApps } from './FeaturedApps';

export interface App {
    id: string;
    name: string;
    description: string;
    shortDescription: string;
    developer: string;
    category: 'integration' | 'productivity' | 'analytics' | 'security' | 'communication' | 'ai-tools';
    price: number;
    currency: string;
    rating: number;
    reviewCount: number;
    downloads: number;
    version: string;
    lastUpdated: string;
    size: string;
    screenshots: string[];
    features: string[];
    requirements: string[];
    tags: string[];
    isInstalled: boolean;
    isPurchased: boolean;
    isFeatured: boolean;
    icon: string;
    bannerImage?: string;
}

const mockApps: App[] = [
    {
        id: 'slack-integration',
        name: 'Slack Integration Pro',
        description: 'Seamlessly integrate Slack with your LLM workspace. Send messages, create channels, and collaborate with your team directly from the chat interface.',
        shortDescription: 'Connect Slack to your LLM workspace for seamless team collaboration.',
        developer: 'TeamSync Solutions',
        category: 'integration',
        price: 29.99,
        currency: 'USD',
        rating: 4.8,
        reviewCount: 1247,
        downloads: 15600,
        version: '2.1.4',
        lastUpdated: '2024-01-15',
        size: '12.5 MB',
        screenshots: ['/api/placeholder/400/300', '/api/placeholder/400/300'],
        features: ['Real-time messaging', 'Channel management', 'File sharing', 'Bot commands'],
        requirements: ['Slack workspace', 'Admin permissions'],
        tags: ['slack', 'collaboration', 'messaging'],
        isInstalled: false,
        isPurchased: false,
        isFeatured: true,
        icon: '💬'
    },
    {
        id: 'advanced-analytics',
        name: 'Advanced Analytics Dashboard',
        description: 'Get deep insights into your LLM usage patterns, token consumption, and performance metrics with beautiful visualizations.',
        shortDescription: 'Comprehensive analytics and insights for your LLM usage.',
        developer: 'DataViz Inc',
        category: 'analytics',
        price: 49.99,
        currency: 'USD',
        rating: 4.9,
        reviewCount: 892,
        downloads: 8900,
        version: '1.8.2',
        lastUpdated: '2024-01-20',
        size: '8.2 MB',
        screenshots: ['/api/placeholder/400/300', '/api/placeholder/400/300'],
        features: ['Usage analytics', 'Performance metrics', 'Custom dashboards', 'Export reports'],
        requirements: ['Premium subscription'],
        tags: ['analytics', 'dashboard', 'metrics'],
        isInstalled: false,
        isPurchased: false,
        isFeatured: true,
        icon: '📊'
    },
    {
        id: 'security-suite',
        name: 'Enterprise Security Suite',
        description: 'Advanced security features including encryption, audit logs, and compliance reporting for enterprise environments.',
        shortDescription: 'Enterprise-grade security and compliance tools.',
        developer: 'SecureCorp',
        category: 'security',
        price: 199.99,
        currency: 'USD',
        rating: 4.7,
        reviewCount: 456,
        downloads: 3200,
        version: '3.2.1',
        lastUpdated: '2024-01-18',
        size: '25.8 MB',
        screenshots: ['/api/placeholder/400/300', '/api/placeholder/400/300'],
        features: ['End-to-end encryption', 'Audit logging', 'Compliance reports', 'Access controls'],
        requirements: ['Enterprise license'],
        tags: ['security', 'compliance', 'enterprise'],
        isInstalled: false,
        isPurchased: false,
        isFeatured: false,
        icon: '🔒'
    },
    {
        id: 'notion-sync',
        name: 'Notion Sync & Export',
        description: 'Sync your LLM conversations with Notion pages, create automatic summaries, and export content in various formats.',
        shortDescription: 'Sync and export LLM conversations to Notion.',
        developer: 'Productivity Labs',
        category: 'productivity',
        price: 19.99,
        currency: 'USD',
        rating: 4.6,
        reviewCount: 634,
        downloads: 11200,
        version: '1.5.3',
        lastUpdated: '2024-01-12',
        size: '6.1 MB',
        screenshots: ['/api/placeholder/400/300', '/api/placeholder/400/300'],
        features: ['Auto-sync', 'Format conversion', 'Template library', 'Bulk export'],
        requirements: ['Notion account'],
        tags: ['notion', 'productivity', 'export'],
        isInstalled: false,
        isPurchased: false,
        isFeatured: false,
        icon: '📝'
    },
    {
        id: 'voice-assistant',
        name: 'Voice Assistant Pro',
        description: 'Transform your LLM into a voice assistant with natural speech recognition and text-to-speech capabilities.',
        shortDescription: 'Voice-enabled LLM interactions with speech recognition.',
        developer: 'VoiceTech AI',
        category: 'ai-tools',
        price: 39.99,
        currency: 'USD',
        rating: 4.5,
        reviewCount: 789,
        downloads: 6700,
        version: '2.0.1',
        lastUpdated: '2024-01-14',
        size: '18.3 MB',
        screenshots: ['/api/placeholder/400/300', '/api/placeholder/400/300'],
        features: ['Speech recognition', 'Text-to-speech', 'Voice commands', 'Multi-language'],
        requirements: ['Microphone access'],
        tags: ['voice', 'ai', 'speech'],
        isInstalled: false,
        isPurchased: false,
        isFeatured: true,
        icon: '🎤'
    },
    {
        id: 'team-collaboration',
        name: 'Team Collaboration Hub',
        description: 'Advanced team collaboration features including shared workspaces, real-time editing, and project management integration.',
        shortDescription: 'Enhanced team collaboration and project management.',
        developer: 'CollabWorks',
        category: 'communication',
        price: 79.99,
        currency: 'USD',
        rating: 4.8,
        reviewCount: 523,
        downloads: 4500,
        version: '1.9.7',
        lastUpdated: '2024-01-16',
        size: '15.2 MB',
        screenshots: ['/api/placeholder/400/300', '/api/placeholder/400/300'],
        features: ['Shared workspaces', 'Real-time editing', 'Project tracking', 'Team analytics'],
        requirements: ['Team subscription'],
        tags: ['collaboration', 'team', 'project-management'],
        isInstalled: false,
        isPurchased: false,
        isFeatured: false,
        icon: '👥'
    }
];

export const AppStoreDemo: React.FC = () => {
    const [apps, setApps] = useState<App[]>(mockApps);
    const [filteredApps, setFilteredApps] = useState<App[]>(mockApps);
    const [selectedApp, setSelectedApp] = useState<App | null>(null);
    const [cart, setCart] = useState<App[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [sortBy, setSortBy] = useState<'name' | 'rating' | 'price' | 'downloads'>('rating');
    const [showCart, setShowCart] = useState(false);

    // Filter and sort apps
    useEffect(() => {
        let filtered = apps;

        // Filter by category
        if (selectedCategory !== 'all') {
            filtered = filtered.filter(app => app.category === selectedCategory);
        }

        // Filter by search query
        if (searchQuery) {
            filtered = filtered.filter(app =>
                app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                app.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                app.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
            );
        }

        // Sort apps
        filtered.sort((a, b) => {
            switch (sortBy) {
                case 'name':
                    return a.name.localeCompare(b.name);
                case 'rating':
                    return b.rating - a.rating;
                case 'price':
                    return a.price - b.price;
                case 'downloads':
                    return b.downloads - a.downloads;
                default:
                    return 0;
            }
        });

        setFilteredApps(filtered);
    }, [apps, searchQuery, selectedCategory, sortBy]);

    const handleAppSelect = (app: App) => {
        setSelectedApp(app);
    };

    const handleAddToCart = (app: App) => {
        if (!cart.find(item => item.id === app.id)) {
            setCart([...cart, app]);
        }
    };

    const handleRemoveFromCart = (appId: string) => {
        setCart(cart.filter(app => app.id !== appId));
    };

    const handlePurchase = (app: App) => {
        // Mock purchase logic
        setApps(prevApps =>
            prevApps.map(a => a.id === app.id ? { ...a, isPurchased: true } : a)
        );
        setCart(cart.filter(a => a.id !== app.id));
    };

    const featuredApps = apps.filter(app => app.isFeatured);

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
            {/* Header */}
            <div className="bg-white shadow-sm border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center">
                            <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                🛍️ App Store
                            </div>
                            <div className="ml-4 text-sm text-gray-500">
                                Enhance your LLM experience
                            </div>
                        </div>
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={() => setShowCart(true)}
                                className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                🛒
                                {cart.length > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                        {cart.length}
                                    </span>
                                )}
                            </button>
                            <button
                                onClick={() => window.history.back()}
                                className="px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                ← Back to App
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Featured Apps */}
                <FeaturedApps apps={featuredApps} onAppSelect={handleAppSelect} />

                {/* Search and Filters */}
                <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-6">
                        <AppSearchBar
                            searchQuery={searchQuery}
                            onSearchChange={setSearchQuery}
                        />
                        <AppCategoryFilter
                            selectedCategory={selectedCategory}
                            onCategoryChange={setSelectedCategory}
                        />
                        <div className="flex items-center space-x-4">
                            <label className="text-sm font-medium text-gray-700">Sort by:</label>
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value as any)}
                                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="rating">Rating</option>
                                <option value="name">Name</option>
                                <option value="price">Price</option>
                                <option value="downloads">Downloads</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Apps Grid */}
                <div className="mt-8">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-gray-900">
                            All Apps ({filteredApps.length})
                        </h2>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredApps.map((app) => (
                            <AppCard
                                key={app.id}
                                app={app}
                                onSelect={handleAppSelect}
                                onAddToCart={handleAddToCart}
                            />
                        ))}
                    </div>

                    {filteredApps.length === 0 && (
                        <div className="text-center py-12">
                            <div className="text-6xl mb-4">🔍</div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">No apps found</h3>
                            <p className="text-gray-600">Try adjusting your search or filter criteria</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Modals */}
            {selectedApp && (
                <AppDetailsModal
                    app={selectedApp}
                    onClose={() => setSelectedApp(null)}
                    onAddToCart={handleAddToCart}
                    onPurchase={handlePurchase}
                />
            )}

            {showCart && (
                <AppCart
                    cart={cart}
                    onClose={() => setShowCart(false)}
                    onRemoveItem={handleRemoveFromCart}
                    onPurchase={handlePurchase}
                />
            )}
        </div>
    );
};
