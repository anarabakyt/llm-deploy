import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../config/hooks';
import { 
    selectLogs, 
    selectLoggingMetrics, 
    selectFilteredLogs, 
    selectModelStatistics,
    selectFilterByModel,
    selectFilterByDateRange,
    selectUniqueUsers,
    selectUserStatistics,
    selectFilterByUser,
    selectFilteredLogsByUser
} from '../store/selector/selectors';
import { 
    setFilterByModel, 
    setFilterByDateRange, 
    setFilterByUser,
    clearFilters,
    setSelectedLogId
} from '../store/slice/loggingSlice.ts';
import { LLMLoggingService } from '../services/llmLoggingService.ts';
import { updateLLMResponseRatingThunk } from '../store/thunk/messageThunks';
import { addLog } from '../store/slice/loggingSlice';
import { UserStats, UserFilter, UserComparison, UserActivityChart } from './index';

export const LoggingDashboard: React.FC = () => {
    const dispatch = useAppDispatch();
    const logs = useAppSelector(selectLogs);
    const metrics = useAppSelector(selectLoggingMetrics);
    const filteredLogs = useAppSelector(selectFilteredLogs);
    const modelStats = useAppSelector(selectModelStatistics);
    const filterByModel = useAppSelector(selectFilterByModel);
    const filterByDateRange = useAppSelector(selectFilterByDateRange);
    const uniqueUsers = useAppSelector(selectUniqueUsers);
    const userStats = useAppSelector(selectUserStatistics);
    const filterByUser = useAppSelector(selectFilterByUser);
    const filteredLogsByUser = useAppSelector(selectFilteredLogsByUser);
    
    const [selectedLogId, setSelectedLogId] = useState<string | null>(null);
    const [showExportModal, setShowExportModal] = useState(false);

    useEffect(() => {
        // Load logs from localStorage on mount
        LLMLoggingService.loadLogsFromStorage();
        
        // Add mock data for demonstration if no logs exist
        if (logs.length === 0) {
            loadMockData();
        }
    }, [logs.length]);

    const loadMockData = () => {
        // Mock users data
        const mockLogs = [
            {
                id: 'mock_log_1',
                userId: 'user_1',
                userName: 'John Doe',
                userEmail: 'john@example.com',
                userAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face',
                prompt: 'Explain quantum computing in simple terms',
                promptTime: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
                responseTime: 1200,
                llmResponse: 'Quantum computing is a revolutionary approach to computation that uses quantum mechanical phenomena...',
                modelName: 'GPT-4',
                tokenCount: 156,
                qualityScore: 0.87,
                userRating: 'like' as const,
                chatId: 'chat_1',
                createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
            },
            {
                id: 'mock_log_2',
                userId: 'user_1',
                userName: 'John Doe',
                userEmail: 'john@example.com',
                userAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face',
                prompt: 'Write a Python function to sort a list',
                promptTime: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
                responseTime: 800,
                llmResponse: 'Here\'s a Python function to sort a list using the built-in sort method...',
                modelName: 'Claude-3',
                tokenCount: 142,
                qualityScore: 0.91,
                userRating: 'like' as const,
                chatId: 'chat_2',
                createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString()
            },
            {
                id: 'mock_log_3',
                userId: 'user_2',
                userName: 'Jane Smith',
                userEmail: 'jane@example.com',
                userAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=32&h=32&fit=crop&crop=face',
                prompt: 'What are the benefits of TypeScript?',
                promptTime: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
                responseTime: 950,
                llmResponse: 'TypeScript offers several key benefits including static typing, better IDE support...',
                modelName: 'GPT-4',
                tokenCount: 128,
                qualityScore: 0.82,
                userRating: null,
                chatId: 'chat_3',
                createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString()
            },
            {
                id: 'mock_log_4',
                userId: 'user_2',
                userName: 'Jane Smith',
                userEmail: 'jane@example.com',
                userAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=32&h=32&fit=crop&crop=face',
                prompt: 'How to optimize React performance?',
                promptTime: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
                responseTime: 1100,
                llmResponse: 'To optimize React performance, you can use techniques like memoization, code splitting...',
                modelName: 'Gemini',
                tokenCount: 134,
                qualityScore: 0.78,
                userRating: 'dislike' as const,
                chatId: 'chat_4',
                createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString()
            },
            {
                id: 'mock_log_5',
                userId: 'user_3',
                userName: 'Mike Johnson',
                userEmail: 'mike@example.com',
                userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face',
                prompt: 'Explain machine learning algorithms',
                promptTime: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
                responseTime: 1400,
                llmResponse: 'Machine learning algorithms are mathematical models that learn patterns from data...',
                modelName: 'GPT-4',
                tokenCount: 189,
                qualityScore: 0.89,
                userRating: 'like' as const,
                chatId: 'chat_5',
                createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString()
            },
            {
                id: 'mock_log_6',
                userId: 'user_3',
                userName: 'Mike Johnson',
                userEmail: 'mike@example.com',
                userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face',
                prompt: 'Best practices for database design',
                promptTime: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
                responseTime: 1000,
                llmResponse: 'Database design best practices include normalization, proper indexing, and relationship modeling...',
                modelName: 'Claude-3',
                tokenCount: 167,
                qualityScore: 0.85,
                userRating: 'like' as const,
                chatId: 'chat_6',
                createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString()
            }
        ];

        // Add mock logs to Redux store
        mockLogs.forEach(log => {
            dispatch(addLog(log));
        });
    };

    const handleModelFilterChange = (modelName: string) => {
        dispatch(setFilterByModel(modelName === 'all' ? null : modelName));
    };

    const handleDateRangeChange = (start: string, end: string) => {
        dispatch(setFilterByDateRange({ 
            start: start || null, 
            end: end || null 
        }));
    };

    const handleUserFilterChange = (userId: string | null) => {
        dispatch(setFilterByUser(userId));
    };

    const handleClearFilters = () => {
        dispatch(clearFilters());
    };

    const handleRatingChange = async (logId: string, rating: 'like' | 'dislike' | null) => {
        try {
            await dispatch(updateLLMResponseRatingThunk({ logId, rating })).unwrap();
        } catch (error) {
            console.error('Error updating rating:', error);
        }
    };

    const handleExportLogs = async (format: 'json' | 'csv') => {
        try {
            const data = LLMLoggingService.exportLogs();
            const blob = new Blob([data], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `llm-logs-${new Date().toISOString().split('T')[0]}.${format}`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Error exporting logs:', error);
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString('ru-RU');
    };

    const formatDuration = (ms: number) => {
        if (ms < 1000) return `${ms}ms`;
        return `${(ms / 1000).toFixed(1)}s`;
    };

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">LLM Request Analytics</h1>
                <p className="text-gray-600">Statistics and logs of all requests to language models</p>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center">
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Total Requests</p>
                            <p className="text-2xl font-semibold text-gray-900">{metrics.totalRequests}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center">
                        <div className="p-2 bg-green-100 rounded-lg">
                            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Average Response Time</p>
                            <p className="text-2xl font-semibold text-gray-900">{formatDuration(metrics.averageResponseTime)}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center">
                        <div className="p-2 bg-purple-100 rounded-lg">
                            <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Average Quality</p>
                            <p className="text-2xl font-semibold text-gray-900">{(metrics.averageQualityScore * 100).toFixed(1)}%</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center">
                        <div className="p-2 bg-yellow-100 rounded-lg">
                            <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">User Satisfaction</p>
                            <p className="text-2xl font-semibold text-gray-900">{metrics.userSatisfactionRate.toFixed(1)}%</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* User Analytics */}
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">User Analytics</h2>
                <UserStats
                    totalUsers={uniqueUsers.length}
                    activeUsers={userStats.filter(user => {
                        const lastActivity = new Date(user.lastActivity);
                        const sevenDaysAgo = new Date();
                        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
                        return lastActivity > sevenDaysAgo;
                    }).length}
                    topUser={{
                        name: userStats[0]?.userName || 'No users',
                        requests: userStats[0]?.totalRequests || 0
                    }}
                    averageSatisfaction={userStats.length > 0 
                        ? userStats.reduce((sum, user) => sum + user.userSatisfactionRate, 0) / userStats.length 
                        : 0
                    }
                />
            </div>

            {/* Filters */}
            <div className="bg-white rounded-lg shadow p-6 mb-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Filters</h2>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Model</label>
                        <select
                            value={filterByModel || 'all'}
                            onChange={(e) => handleModelFilterChange(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="all">All Models</option>
                            {Object.keys(modelStats).map(modelName => (
                                <option key={modelName} value={modelName}>{modelName}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <UserFilter
                            users={uniqueUsers}
                            selectedUserId={filterByUser}
                            onUserChange={handleUserFilterChange}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                        <input
                            type="date"
                            value={filterByDateRange.start || ''}
                            onChange={(e) => handleDateRangeChange(e.target.value, filterByDateRange.end || '')}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                        <input
                            type="date"
                            value={filterByDateRange.end || ''}
                            onChange={(e) => handleDateRangeChange(filterByDateRange.start || '', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>
                <div className="mt-4 flex gap-2">
                    <button
                        onClick={handleClearFilters}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                    >
                        Clear Filters
                    </button>
                    <button
                        onClick={() => setShowExportModal(true)}
                        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                    >
                        Export Logs
                    </button>
                </div>
            </div>

            {/* Model Statistics */}
            <div className="bg-white rounded-lg shadow p-6 mb-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Model Statistics</h2>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Model</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Requests</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Avg Time</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quality</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tokens</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Satisfaction</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {Object.entries(modelStats).map(([modelName, stats]) => (
                                <tr key={modelName} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{modelName}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{stats.count}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDuration(stats.averageResponseTime)}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{(stats.averageQualityScore * 100).toFixed(1)}%</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{stats.totalTokens.toLocaleString()}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{stats.userSatisfactionRate.toFixed(1)}%</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* User Comparison */}
            <div className="mb-6">
                <UserComparison userStats={userStats} />
            </div>

            {/* Logs List */}
            <div className="bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-900">Request Logs ({filteredLogsByUser.length})</h2>
                </div>
                <div className="divide-y divide-gray-200">
                    {filteredLogsByUser.map((log) => (
                        <div key={log.id} className="p-6 hover:bg-gray-50">
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center space-x-4 mb-2">
                                        <div className="flex items-center space-x-2">
                                            {log.userAvatar ? (
                                                <img
                                                    className="h-6 w-6 rounded-full"
                                                    src={log.userAvatar}
                                                    alt={log.userName}
                                                />
                                            ) : (
                                                <div className="h-6 w-6 rounded-full bg-gray-300 flex items-center justify-center">
                                                    <span className="text-xs font-medium text-gray-700">
                                                        {log.userName.charAt(0).toUpperCase()}
                                                    </span>
                                                </div>
                                            )}
                                            <span className="text-sm font-medium text-gray-700">{log.userName}</span>
                                        </div>
                                        <h3 className="text-sm font-medium text-gray-900">{log.modelName}</h3>
                                        <span className="text-xs text-gray-500">{formatDate(log.createdAt)}</span>
                                        <span className="text-xs text-gray-500">{formatDuration(log.responseTime)}</span>
                                        <span className="text-xs text-gray-500">{log.tokenCount} tokens</span>
                                    </div>
                                    <div className="mb-2">
                                        <p className="text-sm text-gray-600 mb-1">
                                            <span className="font-medium">Prompt:</span> {log.prompt}
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            <span className="font-medium">Response:</span> {log.llmResponse.substring(0, 200)}
                                            {log.llmResponse.length > 200 && '...'}
                                        </p>
                                    </div>
                                    <div className="flex items-center space-x-4">
                                        <span className="text-xs text-gray-500">
                                            Quality: {(log.qualityScore * 100).toFixed(1)}%
                                        </span>
                                        <div className="flex space-x-1">
                                            <button
                                                onClick={() => handleRatingChange(log.id, log.userRating === 'like' ? null : 'like')}
                                                className={`p-1 rounded ${
                                                    log.userRating === 'like' 
                                                        ? 'text-green-500 bg-green-50' 
                                                        : 'text-gray-400 hover:text-green-500'
                                                }`}
                                            >
                                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                    <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.834a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z"/>
                                                </svg>
                                            </button>
                                            <button
                                                onClick={() => handleRatingChange(log.id, log.userRating === 'dislike' ? null : 'dislike')}
                                                className={`p-1 rounded ${
                                                    log.userRating === 'dislike' 
                                                        ? 'text-red-500 bg-red-50' 
                                                        : 'text-gray-400 hover:text-red-500'
                                                }`}
                                            >
                                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                    <path d="M18 9.5a1.5 1.5 0 11-3 0v-6a1.5 1.5 0 013 0v6zM14 9.667v-5.834a2 2 0 00-1.106-1.79l-.05-.025A4 4 0 0011.057 2H5.64a2 2 0 00-1.962 1.608l-1.2 6A2 2 0 004.44 12H8v4a2 2 0 002 2 1 1 0 001-1v-.667a4 4 0 01.8-2.4l1.4-1.866a4 4 0 00.8-2.4z"/>
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Export Modal */}
            {showExportModal && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
                    <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                        <div className="mt-3">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Export Logs</h3>
                            <div className="space-y-2">
                                <button
                                    onClick={() => {
                                        handleExportLogs('json');
                                        setShowExportModal(false);
                                    }}
                                    className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                                >
                                    Export to JSON
                                </button>
                                <button
                                    onClick={() => {
                                        handleExportLogs('csv');
                                        setShowExportModal(false);
                                    }}
                                    className="w-full px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700"
                                >
                                    Export to CSV
                                </button>
                            </div>
                            <button
                                onClick={() => setShowExportModal(false)}
                                className="w-full mt-4 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};