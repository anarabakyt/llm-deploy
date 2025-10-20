import React from 'react';

interface AppCategoryFilterProps {
    selectedCategory: string;
    onCategoryChange: (category: string) => void;
}

const categories = [
    { id: 'all', name: 'All Apps', icon: '📱' },
    { id: 'integration', name: 'Integrations', icon: '🔗' },
    { id: 'productivity', name: 'Productivity', icon: '⚡' },
    { id: 'analytics', name: 'Analytics', icon: '📊' },
    { id: 'security', name: 'Security', icon: '🔒' },
    { id: 'communication', name: 'Communication', icon: '💬' },
    { id: 'ai-tools', name: 'AI Tools', icon: '🤖' },
];

export const AppCategoryFilter: React.FC<AppCategoryFilterProps> = ({ 
    selectedCategory, 
    onCategoryChange 
}) => {
    return (
        <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
                <button
                    key={category.id}
                    onClick={() => onCategoryChange(category.id)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                        selectedCategory === category.id
                            ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg transform scale-105'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:text-gray-900'
                    }`}
                >
                    <span className="mr-2">{category.icon}</span>
                    {category.name}
                </button>
            ))}
        </div>
    );
};
