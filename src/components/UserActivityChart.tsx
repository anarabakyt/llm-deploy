import React from 'react';

interface UserActivityData {
    date: string;
    userCount: number;
    requestCount: number;
}

interface UserActivityChartProps {
    data: UserActivityData[];
}

export const UserActivityChart: React.FC<UserActivityChartProps> = ({ data }) => {
    const maxRequests = Math.max(...data.map(d => d.requestCount));
    const maxUsers = Math.max(...data.map(d => d.userCount));

    return (
        <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">User Activity Over Time</h3>
            <div className="space-y-4">
                {data.map((item, index) => {
                    const requestPercentage = (item.requestCount / maxRequests) * 100;
                    const userPercentage = (item.userCount / maxUsers) * 100;
                    
                    return (
                        <div key={index} className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="font-medium text-gray-700">{item.date}</span>
                                <div className="flex space-x-4 text-gray-500">
                                    <span>{item.userCount} users</span>
                                    <span>{item.requestCount} requests</span>
                                </div>
                            </div>
                            <div className="space-y-1">
                                <div className="flex items-center space-x-2">
                                    <span className="text-xs text-gray-500 w-12">Users:</span>
                                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                                        <div 
                                            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                                            style={{ width: `${userPercentage}%` }}
                                        />
                                    </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <span className="text-xs text-gray-500 w-12">Requests:</span>
                                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                                        <div 
                                            className="bg-green-500 h-2 rounded-full transition-all duration-300"
                                            style={{ width: `${requestPercentage}%` }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
