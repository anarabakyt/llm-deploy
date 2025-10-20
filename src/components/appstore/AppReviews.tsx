import React from 'react';

interface AppReviewsProps {
    appId: string;
}

const mockReviews = [
    {
        id: '1',
        user: 'Alex Johnson',
        rating: 5,
        date: '2024-01-15',
        comment: 'Amazing integration! Works perfectly with our workflow. Highly recommended.',
        helpful: 12
    },
    {
        id: '2',
        user: 'Sarah Chen',
        rating: 4,
        date: '2024-01-12',
        comment: 'Great tool, easy to set up. Only minor issue with the UI but overall excellent.',
        helpful: 8
    },
    {
        id: '3',
        user: 'Mike Rodriguez',
        rating: 5,
        date: '2024-01-10',
        comment: 'This has completely transformed how we work. The team loves it!',
        helpful: 15
    }
];

export const AppReviews: React.FC<AppReviewsProps> = ({ appId }) => {
    const renderStars = (rating: number) => {
        return Array.from({ length: 5 }, (_, i) => (
            <span
                key={i}
                className={`text-sm ${
                    i < rating ? 'text-yellow-400' : 'text-gray-300'
                }`}
            >
                ★
            </span>
        ));
    };

    return (
        <div className="space-y-6">
            <h3 className="text-xl font-bold text-gray-900">Reviews</h3>
            <div className="space-y-4">
                {mockReviews.map((review) => (
                    <div key={review.id} className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-start justify-between mb-2">
                            <div>
                                <div className="font-semibold text-gray-900">{review.user}</div>
                                <div className="flex items-center space-x-2">
                                    <div className="flex">{renderStars(review.rating)}</div>
                                    <span className="text-sm text-gray-500">{review.date}</span>
                                </div>
                            </div>
                            <button className="text-gray-400 hover:text-gray-600">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                </svg>
                            </button>
                        </div>
                        <p className="text-gray-700 mb-2">{review.comment}</p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <span>{review.helpful} people found this helpful</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
