import React, { useState } from 'react';

interface FlaggedPrompt {
    id: string;
    prompt: string;
    reason: 'inappropriate' | 'spam' | 'harmful' | 'copyright' | 'other';
    severity: 'low' | 'medium' | 'high' | 'critical';
    flaggedBy: string;
    flaggedAt: string;
    userId: string;
    userName: string;
    status: 'pending' | 'approved' | 'rejected' | 'escalated';
    response?: string;
    modelName: string;
}

export const PromptControl: React.FC = () => {
    const [prompts, setPrompts] = useState<FlaggedPrompt[]>([
        {
            id: '1',
            prompt: 'How to hack into someone\'s computer?',
            reason: 'harmful',
            severity: 'high',
            flaggedBy: 'Auto-Moderation',
            flaggedAt: '2024-01-15T10:30:00Z',
            userId: 'user_1',
            userName: 'John Doe',
            status: 'pending',
            modelName: 'GPT-4'
        },
        {
            id: '2',
            prompt: 'Write a story about a character who commits suicide',
            reason: 'harmful',
            severity: 'medium',
            flaggedBy: 'Auto-Moderation',
            flaggedAt: '2024-01-15T09:15:00Z',
            userId: 'user_2',
            userName: 'Jane Smith',
            status: 'pending',
            modelName: 'Claude-3'
        },
        {
            id: '3',
            prompt: 'Generate fake news about the election',
            reason: 'inappropriate',
            severity: 'critical',
            flaggedBy: 'User Report',
            flaggedAt: '2024-01-15T08:45:00Z',
            userId: 'user_3',
            userName: 'Mike Johnson',
            status: 'escalated',
            modelName: 'GPT-4'
        }
    ]);

    const [filterStatus, setFilterStatus] = useState<string>('all');
    const [filterSeverity, setFilterSeverity] = useState<string>('all');
    const [selectedPrompt, setSelectedPrompt] = useState<FlaggedPrompt | null>(null);

    const filteredPrompts = prompts.filter(prompt => {
        const matchesStatus = filterStatus === 'all' || prompt.status === filterStatus;
        const matchesSeverity = filterSeverity === 'all' || prompt.severity === filterSeverity;
        return matchesStatus && matchesSeverity;
    });

    const handleStatusChange = (promptId: string, newStatus: FlaggedPrompt['status']) => {
        setPrompts(prompts.map(prompt => 
            prompt.id === promptId ? { ...prompt, status: newStatus } : prompt
        ));
    };

    const getSeverityBadge = (severity: FlaggedPrompt['severity']) => {
        const styles = {
            low: 'bg-green-100 text-green-800',
            medium: 'bg-yellow-100 text-yellow-800',
            high: 'bg-orange-100 text-orange-800',
            critical: 'bg-red-100 text-red-800'
        };
        return (
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${styles[severity]}`}>
                {severity.charAt(0).toUpperCase() + severity.slice(1)}
            </span>
        );
    };

    const getStatusBadge = (status: FlaggedPrompt['status']) => {
        const styles = {
            pending: 'bg-yellow-100 text-yellow-800',
            approved: 'bg-green-100 text-green-800',
            rejected: 'bg-red-100 text-red-800',
            escalated: 'bg-purple-100 text-purple-800'
        };
        return (
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${styles[status]}`}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
        );
    };

    const getReasonBadge = (reason: FlaggedPrompt['reason']) => {
        const styles = {
            inappropriate: 'bg-red-100 text-red-800',
            spam: 'bg-yellow-100 text-yellow-800',
            harmful: 'bg-orange-100 text-orange-800',
            copyright: 'bg-blue-100 text-blue-800',
            other: 'bg-gray-100 text-gray-800'
        };
        return (
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${styles[reason]}`}>
                {reason.charAt(0).toUpperCase() + reason.slice(1)}
            </span>
        );
    };

    return (
        <div className="space-y-6">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Content Moderation</h1>
                <p className="text-gray-600">Review and moderate flagged prompts</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center">
                        <div className="p-2 bg-yellow-100 rounded-lg">
                            <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                            </svg>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Pending Review</p>
                            <p className="text-2xl font-semibold text-gray-900">
                                {prompts.filter(p => p.status === 'pending').length}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center">
                        <div className="p-2 bg-red-100 rounded-lg">
                            <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                            </svg>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Critical Issues</p>
                            <p className="text-2xl font-semibold text-gray-900">
                                {prompts.filter(p => p.severity === 'critical').length}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center">
                        <div className="p-2 bg-green-100 rounded-lg">
                            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Approved Today</p>
                            <p className="text-2xl font-semibold text-gray-900">12</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center">
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                            </svg>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Escalated</p>
                            <p className="text-2xl font-semibold text-gray-900">
                                {prompts.filter(p => p.status === 'escalated').length}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-lg shadow p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="all">All Status</option>
                            <option value="pending">Pending</option>
                            <option value="approved">Approved</option>
                            <option value="rejected">Rejected</option>
                            <option value="escalated">Escalated</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Severity</label>
                        <select
                            value={filterSeverity}
                            onChange={(e) => setFilterSeverity(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="all">All Severity</option>
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                            <option value="critical">Critical</option>
                        </select>
                    </div>
                    <div className="flex items-end">
                        <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                            Bulk Actions
                        </button>
                    </div>
                </div>
            </div>

            {/* Prompts Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-900">Flagged Prompts ({filteredPrompts.length})</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prompt</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reason</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Severity</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Flagged At</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
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
                                        {getReasonBadge(prompt.reason)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {getSeverityBadge(prompt.severity)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {getStatusBadge(prompt.status)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {prompt.userName}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {new Date(prompt.flaggedAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <div className="flex space-x-2">
                                            <button 
                                                onClick={() => setSelectedPrompt(prompt)}
                                                className="text-blue-600 hover:text-blue-900"
                                            >
                                                Review
                                            </button>
                                            <button 
                                                onClick={() => handleStatusChange(prompt.id, 'approved')}
                                                className="text-green-600 hover:text-green-900"
                                            >
                                                Approve
                                            </button>
                                            <button 
                                                onClick={() => handleStatusChange(prompt.id, 'rejected')}
                                                className="text-red-600 hover:text-red-900"
                                            >
                                                Reject
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Review Modal */}
            {selectedPrompt && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
                    <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-2xl shadow-lg rounded-md bg-white">
                        <div className="mt-3">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Review Flagged Prompt</h3>
                            
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Prompt</label>
                                    <div className="p-3 bg-gray-50 rounded-md text-sm text-gray-900">
                                        {selectedPrompt.prompt}
                                    </div>
                                </div>
                                
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Reason</label>
                                        <div className="p-2 bg-gray-50 rounded-md text-sm">
                                            {getReasonBadge(selectedPrompt.reason)}
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Severity</label>
                                        <div className="p-2 bg-gray-50 rounded-md text-sm">
                                            {getSeverityBadge(selectedPrompt.severity)}
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Response</label>
                                    <textarea
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        rows={3}
                                        placeholder="Add your response or notes..."
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end space-x-3 mt-6">
                                <button
                                    onClick={() => setSelectedPrompt(null)}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => {
                                        handleStatusChange(selectedPrompt.id, 'rejected');
                                        setSelectedPrompt(null);
                                    }}
                                    className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
                                >
                                    Reject
                                </button>
                                <button
                                    onClick={() => {
                                        handleStatusChange(selectedPrompt.id, 'approved');
                                        setSelectedPrompt(null);
                                    }}
                                    className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700"
                                >
                                    Approve
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
