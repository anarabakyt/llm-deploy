import React, { useState } from 'react';

interface PromptData {
    id: string;
    prompt: string;
    category: 'technical' | 'creative' | 'business' | 'personal' | 'other';
    qualityScore: number;
    successRate: number;
    avgResponseTime: number;
    tokenUsage: number;
    userSatisfaction: number;
    createdAt: string;
    userId: string;
    userName: string;
}

export const PromptAnalysis: React.FC = () => {
    const [prompts, setPrompts] = useState<PromptData[]>([
        {
            id: '1',
            prompt: 'Explain quantum computing in simple terms',
            category: 'technical',
            qualityScore: 0.87,
            successRate: 0.92,
            avgResponseTime: 1200,
            tokenUsage: 156,
            userSatisfaction: 0.89,
            createdAt: '2024-01-15T10:30:00Z',
            userId: 'user_1',
            userName: 'John Doe'
        },
        {
            id: '2',
            prompt: 'Write a creative story about a robot learning to love',
            category: 'creative',
            qualityScore: 0.91,
            successRate: 0.88,
            avgResponseTime: 1800,
            tokenUsage: 234,
            userSatisfaction: 0.95,
            createdAt: '2024-01-15T09:15:00Z',
            userId: 'user_2',
            userName: 'Jane Smith'
        },
        {
            id: '3',
            prompt: 'How to optimize my business processes for efficiency?',
            category: 'business',
            qualityScore: 0.78,
            successRate: 0.85,
            avgResponseTime: 1500,
            tokenUsage: 189,
            userSatisfaction: 0.82,
            createdAt: '2024-01-15T08:45:00Z',
            userId: 'user_3',
            userName: 'Mike Johnson'
        }
    ]);

    const [filterCategory, setFilterCategory] = useState<string>('all');
    const [sortBy, setSortBy] = useState<string>('qualityScore');

    const filteredPrompts = prompts
        .filter(prompt => filterCategory === 'all' || prompt.category === filterCategory)
        .sort((a, b) => {
            switch (sortBy) {
                case 'qualityScore':
                    return b.qualityScore - a.qualityScore;
                case 'successRate':
                    return b.successRate - a.successRate;
                case 'tokenUsage':
                    return b.tokenUsage - a.tokenUsage;
                case 'userSatisfaction':
                    return b.userSatisfaction - a.userSatisfaction;
                default:
                    return 0;
            }
        });

    const getCategoryBadge = (category: PromptData['category']) => {
        const styles = {
            technical: 'bg-blue-100 text-blue-800',
            creative: 'bg-purple-100 text-purple-800',
            business: 'bg-green-100 text-green-800',
            personal: 'bg-yellow-100 text-yellow-800',
            other: 'bg-gray-100 text-gray-800'
        };
        return (
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${styles[category]}`}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
            </span>
        );
    };

    const getQualityColor = (score: number) => {
        if (score >= 0.8) return 'text-green-600';
        if (score >= 0.6) return 'text-yellow-600';
        return 'text-red-600';
    };

    return (
        <div className="space-y-6">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Prompt Analysis</h1>
                <p className="text-gray-600">Analyze prompt quality, patterns, and effectiveness</p>
            </div>

            {/* Analytics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center">
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Avg Quality Score</p>
                            <p className="text-2xl font-semibold text-gray-900">0.85</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center">
                        <div className="p-2 bg-green-100 rounded-lg">
                            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                            </svg>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Success Rate</p>
                            <p className="text-2xl font-semibold text-gray-900">88%</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center">
                        <div className="p-2 bg-yellow-100 rounded-lg">
                            <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Avg Response Time</p>
                            <p className="text-2xl font-semibold text-gray-900">1.4s</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center">
                        <div className="p-2 bg-purple-100 rounded-lg">
                            <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">User Satisfaction</p>
                            <p className="text-2xl font-semibold text-gray-900">89%</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-lg shadow p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                        <select
                            value={filterCategory}
                            onChange={(e) => setFilterCategory(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="all">All Categories</option>
                            <option value="technical">Technical</option>
                            <option value="creative">Creative</option>
                            <option value="business">Business</option>
                            <option value="personal">Personal</option>
                            <option value="other">Other</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="qualityScore">Quality Score</option>
                            <option value="successRate">Success Rate</option>
                            <option value="tokenUsage">Token Usage</option>
                            <option value="userSatisfaction">User Satisfaction</option>
                        </select>
                    </div>
                    <div className="flex items-end">
                        <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                            Export Analysis
                        </button>
                    </div>
                </div>
            </div>

            {/* Prompts Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-900">Prompt Analysis ({filteredPrompts.length})</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prompt</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quality</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Success Rate</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tokens</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Satisfaction</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredPrompts.map((prompt) => (
                                <tr key={prompt.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4">
                                        <div className="text-sm text-gray-900 max-w-xs truncate" title={prompt.prompt}>
                                            {prompt.prompt}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {getCategoryBadge(prompt.category)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`text-sm font-medium ${getQualityColor(prompt.qualityScore)}`}>
                                            {(prompt.qualityScore * 100).toFixed(1)}%
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {(prompt.successRate * 100).toFixed(1)}%
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {prompt.tokenUsage}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {(prompt.userSatisfaction * 100).toFixed(1)}%
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {prompt.userName}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};
