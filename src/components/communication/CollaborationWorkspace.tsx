import React, { useState } from 'react';

interface WorkspaceItem {
    id: string;
    name: string;
    type: 'prompt' | 'conversation' | 'analysis' | 'document';
    content: string;
    author: string;
    lastModified: string;
    collaborators: string[];
    isShared: boolean;
    tags: string[];
}

interface CollaborationWorkspaceProps {
    currentUserId: string;
    onItemSelect: (item: WorkspaceItem) => void;
    onItemCreate: (item: Omit<WorkspaceItem, 'id'>) => void;
    onItemShare: (itemId: string, userIds: string[]) => void;
    onItemUpdate: (itemId: string, updates: Partial<WorkspaceItem>) => void;
}

export const CollaborationWorkspace: React.FC<CollaborationWorkspaceProps> = ({
    currentUserId,
    onItemSelect,
    onItemCreate,
    onItemShare,
    onItemUpdate
}) => {
    const [selectedItem, setSelectedItem] = useState<WorkspaceItem | null>(null);
    const [filter, setFilter] = useState<'all' | 'my' | 'shared' | 'recent'>('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [showCreateModal, setShowCreateModal] = useState(false);

    // Mock workspace items
    const workspaceItems: WorkspaceItem[] = [
        {
            id: '1',
            name: 'Customer Support Prompts',
            type: 'prompt',
            content: 'A collection of prompts for customer support scenarios...',
            author: 'John Smith',
            lastModified: '2 hours ago',
            collaborators: ['sarah', 'mike'],
            isShared: true,
            tags: ['customer-support', 'prompts', 'templates']
        },
        {
            id: '2',
            name: 'LLM Model Comparison',
            type: 'analysis',
            content: 'Analysis of different LLM models for our use case...',
            author: 'Sarah Johnson',
            lastModified: '1 day ago',
            collaborators: ['john'],
            isShared: true,
            tags: ['analysis', 'models', 'comparison']
        },
        {
            id: '3',
            name: 'Technical Documentation',
            type: 'document',
            content: 'Technical documentation for the LLM integration...',
            author: 'Mike Chen',
            lastModified: '3 days ago',
            collaborators: ['john', 'sarah'],
            isShared: true,
            tags: ['documentation', 'technical', 'integration']
        },
        {
            id: '4',
            name: 'My Personal Prompts',
            type: 'prompt',
            content: 'Personal collection of prompts for testing...',
            author: 'You',
            lastModified: '1 hour ago',
            collaborators: [],
            isShared: false,
            tags: ['personal', 'testing']
        }
    ];

    const filteredItems = workspaceItems.filter(item => {
        const matchesFilter = filter === 'all' || 
            (filter === 'my' && item.author === 'You') ||
            (filter === 'shared' && item.isShared) ||
            (filter === 'recent' && item.lastModified.includes('hour') || item.lastModified.includes('minute'));
        
        const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
        
        return matchesFilter && matchesSearch;
    });

    const getItemIcon = (type: string) => {
        switch (type) {
            case 'prompt': return '💬';
            case 'conversation': return '🗣️';
            case 'analysis': return '📊';
            case 'document': return '📄';
            default: return '📁';
        }
    };

    const getItemColor = (type: string) => {
        switch (type) {
            case 'prompt': return 'bg-blue-100 text-blue-800';
            case 'conversation': return 'bg-green-100 text-green-800';
            case 'analysis': return 'bg-purple-100 text-purple-800';
            case 'document': return 'bg-gray-100 text-gray-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const handleItemClick = (item: WorkspaceItem) => {
        setSelectedItem(item);
        onItemSelect(item);
    };

    const handleCreateItem = (itemData: Omit<WorkspaceItem, 'id'>) => {
        onItemCreate(itemData);
        setShowCreateModal(false);
    };

    return (
        <div className="h-full flex bg-white rounded-lg shadow-sm border border-gray-200">
            {/* Sidebar */}
            <div className="w-1/3 border-r border-gray-200 flex flex-col">
                {/* Header */}
                <div className="p-4 border-b border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">Workspace</h3>
                        <button
                            onClick={() => setShowCreateModal(true)}
                            className="px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
                        >
                            + New
                        </button>
                    </div>
                    
                    {/* Search */}
                    <div className="relative mb-4">
                        <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <input
                            type="text"
                            placeholder="Search workspace..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                        />
                    </div>

                    {/* Filters */}
                    <div className="flex space-x-1">
                        {[
                            { key: 'all', label: 'All' },
                            { key: 'my', label: 'My' },
                            { key: 'shared', label: 'Shared' },
                            { key: 'recent', label: 'Recent' }
                        ].map((filterOption) => (
                            <button
                                key={filterOption.key}
                                onClick={() => setFilter(filterOption.key as any)}
                                className={`px-3 py-1 text-xs rounded-full transition-colors ${
                                    filter === filterOption.key
                                        ? 'bg-blue-100 text-blue-700'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                            >
                                {filterOption.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Items List */}
                <div className="flex-1 overflow-y-auto">
                    {filteredItems.map((item) => (
                        <div
                            key={item.id}
                            onClick={() => handleItemClick(item)}
                            className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                                selectedItem?.id === item.id ? 'bg-blue-50 border-blue-200' : ''
                            }`}
                        >
                            <div className="flex items-start space-x-3">
                                <div className="text-2xl">{getItemIcon(item.type)}</div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between mb-1">
                                        <h4 className="text-sm font-medium text-gray-900 truncate">
                                            {item.name}
                                        </h4>
                                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getItemColor(item.type)}`}>
                                            {item.type}
                                        </span>
                                    </div>
                                    <p className="text-xs text-gray-600 truncate mb-2">
                                        {item.content}
                                    </p>
                                    <div className="flex items-center justify-between text-xs text-gray-500">
                                        <span>By {item.author}</span>
                                        <span>{item.lastModified}</span>
                                    </div>
                                    {item.tags.length > 0 && (
                                        <div className="flex flex-wrap gap-1 mt-2">
                                            {item.tags.slice(0, 2).map((tag, index) => (
                                                <span key={index} className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">
                                                    {tag}
                                                </span>
                                            ))}
                                            {item.tags.length > 2 && (
                                                <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">
                                                    +{item.tags.length - 2}
                                                </span>
                                            )}
                                        </div>
                                    )}
                                    {item.isShared && (
                                        <div className="flex items-center space-x-1 mt-2">
                                            <svg className="w-3 h-3 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
                                            </svg>
                                            <span className="text-xs text-green-600">
                                                {item.collaborators.length} collaborators
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col">
                {selectedItem ? (
                    <>
                        {/* Item Header */}
                        <div className="p-4 border-b border-gray-200 bg-gray-50">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    <div className="text-2xl">{getItemIcon(selectedItem.type)}</div>
                                    <div>
                                        <h2 className="text-xl font-semibold text-gray-900">
                                            {selectedItem.name}
                                        </h2>
                                        <p className="text-sm text-gray-600">
                                            By {selectedItem.author} • {selectedItem.lastModified}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <button className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm">
                                        Share
                                    </button>
                                    <button className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm">
                                        Edit
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Item Content */}
                        <div className="flex-1 p-4 overflow-y-auto">
                            <div className="prose max-w-none">
                                <h3 className="text-lg font-medium text-gray-900 mb-4">Content</h3>
                                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                                    <p className="text-gray-700 whitespace-pre-wrap">
                                        {selectedItem.content}
                                    </p>
                                </div>

                                <h3 className="text-lg font-medium text-gray-900 mb-4">Tags</h3>
                                <div className="flex flex-wrap gap-2 mb-6">
                                    {selectedItem.tags.map((tag, index) => (
                                        <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                                            {tag}
                                        </span>
                                    ))}
                                </div>

                                <h3 className="text-lg font-medium text-gray-900 mb-4">Collaborators</h3>
                                <div className="flex items-center space-x-2 mb-6">
                                    {selectedItem.collaborators.map((collaborator, index) => (
                                        <div key={index} className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-sm">
                                            {collaborator.charAt(0).toUpperCase()}
                                        </div>
                                    ))}
                                    <button className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-sm hover:bg-gray-200 transition-colors">
                                        +
                                    </button>
                                </div>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex items-center justify-center">
                        <div className="text-center">
                            <div className="text-6xl mb-4">📁</div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">
                                Select an item
                            </h3>
                            <p className="text-gray-600">
                                Choose an item from the sidebar to view its content
                            </p>
                        </div>
                    </div>
                )}
            </div>

            {/* Create Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Create New Item</h3>
                        <form onSubmit={(e) => {
                            e.preventDefault();
                            const formData = new FormData(e.target as HTMLFormElement);
                            handleCreateItem({
                                name: formData.get('name') as string,
                                type: formData.get('type') as any,
                                content: formData.get('content') as string,
                                author: 'You',
                                lastModified: 'Just now',
                                collaborators: [],
                                isShared: false,
                                tags: (formData.get('tags') as string).split(',').map(t => t.trim()).filter(t => t)
                            });
                        }}>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Name
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        required
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Type
                                    </label>
                                    <select
                                        name="type"
                                        required
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    >
                                        <option value="prompt">Prompt</option>
                                        <option value="conversation">Conversation</option>
                                        <option value="analysis">Analysis</option>
                                        <option value="document">Document</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Content
                                    </label>
                                    <textarea
                                        name="content"
                                        rows={4}
                                        required
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Tags (comma-separated)
                                    </label>
                                    <input
                                        type="text"
                                        name="tags"
                                        placeholder="tag1, tag2, tag3"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                            </div>
                            <div className="flex justify-end space-x-3 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setShowCreateModal(false)}
                                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                                >
                                    Create
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};
