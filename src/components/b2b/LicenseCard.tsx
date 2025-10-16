import React from 'react';

interface LicenseCardProps {
    planName: string;
    totalLicenses: number;
    usedLicenses: number;
    pricePerLicense: number;
    billingPeriod: 'month' | 'year';
    nextBillingDate: string;
    onUpgrade?: () => void;
    onManage?: () => void;
}

export const LicenseCard: React.FC<LicenseCardProps> = ({
    planName,
    totalLicenses,
    usedLicenses,
    pricePerLicense,
    billingPeriod,
    nextBillingDate,
    onUpgrade,
    onManage
}) => {
    const availableLicenses = totalLicenses - usedLicenses;
    const usagePercentage = (usedLicenses / totalLicenses) * 100;
    const totalCost = totalLicenses * pricePerLicense;

    const getUsageColor = (percentage: number) => {
        if (percentage >= 90) return 'text-red-600';
        if (percentage >= 75) return 'text-yellow-600';
        return 'text-green-600';
    };

    const getProgressColor = (percentage: number) => {
        if (percentage >= 90) return 'bg-red-500';
        if (percentage >= 75) return 'bg-yellow-500';
        return 'bg-green-500';
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h3 className="text-lg font-semibold text-gray-900">{planName}</h3>
                    <p className="text-sm text-gray-600">${pricePerLicense}/license per {billingPeriod}</p>
                </div>
                <div className="text-right">
                    <p className="text-sm text-gray-600">Next billing</p>
                    <p className="font-medium text-gray-900">{nextBillingDate}</p>
                </div>
            </div>

            {/* Usage Stats */}
            <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="text-center">
                    <p className="text-2xl font-bold text-gray-900">{totalLicenses}</p>
                    <p className="text-xs text-gray-600">Total</p>
                </div>
                <div className="text-center">
                    <p className="text-2xl font-bold text-blue-600">{usedLicenses}</p>
                    <p className="text-xs text-gray-600">Used</p>
                </div>
                <div className="text-center">
                    <p className="text-2xl font-bold text-green-600">{availableLicenses}</p>
                    <p className="text-xs text-gray-600">Available</p>
                </div>
            </div>

            {/* Usage Progress */}
            <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">License Usage</span>
                    <span className={`text-sm font-semibold ${getUsageColor(usagePercentage)}`}>
                        {usagePercentage.toFixed(1)}%
                    </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                        className={`h-2 rounded-full transition-all duration-500 ${getProgressColor(usagePercentage)}`}
                        style={{ width: `${usagePercentage}%` }}
                    ></div>
                </div>
            </div>

            {/* Cost Info */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Monthly Cost</span>
                    <span className="text-lg font-bold text-gray-900">${totalCost.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center mt-1">
                    <span className="text-xs text-gray-500">Based on {totalLicenses} licenses</span>
                    <span className="text-xs text-gray-500">${pricePerLicense} each</span>
                </div>
            </div>

            {/* Actions */}
            <div className="flex space-x-3">
                {onManage && (
                    <button
                        onClick={onManage}
                        className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                        Manage Licenses
                    </button>
                )}
                {onUpgrade && (
                    <button
                        onClick={onUpgrade}
                        className="flex-1 px-4 py-2 bg-gray-100 text-gray-900 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                    >
                        Upgrade Plan
                    </button>
                )}
            </div>
        </div>
    );
};
