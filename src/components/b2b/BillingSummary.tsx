import React from 'react';

interface BillingSummaryProps {
    currentPeriod: {
        baseSubscription: number;
        usageCharges: number;
        overageCharges: number;
        total: number;
        nextBillingDate: string;
    };
    usage: {
        licensesUsed: number;
        licensesTotal: number;
        requestsThisMonth: number;
        tokensUsed: number;
    };
    onViewDetails?: () => void;
    onDownloadInvoice?: () => void;
}

export const BillingSummary: React.FC<BillingSummaryProps> = ({
    currentPeriod,
    usage,
    onViewDetails,
    onDownloadInvoice
}) => {
    const licenseUsagePercentage = (usage.licensesUsed / usage.licensesTotal) * 100;

    return (
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 text-white">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-2xl font-bold mb-1">Current Billing Period</h2>
                    <p className="text-blue-100">Next billing: {currentPeriod.nextBillingDate}</p>
                </div>
                <div className="text-right">
                    <p className="text-blue-100 text-sm">Current Total</p>
                    <p className="text-3xl font-bold">${currentPeriod.total.toFixed(2)}</p>
                </div>
            </div>

            {/* Cost Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-white bg-opacity-20 rounded-xl p-4">
                    <p className="text-blue-100 text-sm mb-1">Base Subscription</p>
                    <p className="text-xl font-bold">${currentPeriod.baseSubscription.toFixed(2)}</p>
                </div>
                <div className="bg-white bg-opacity-20 rounded-xl p-4">
                    <p className="text-blue-100 text-sm mb-1">Usage Charges</p>
                    <p className="text-xl font-bold">${currentPeriod.usageCharges.toFixed(2)}</p>
                </div>
                <div className="bg-white bg-opacity-20 rounded-xl p-4">
                    <p className="text-blue-100 text-sm mb-1">Overage Charges</p>
                    <p className="text-xl font-bold">${currentPeriod.overageCharges.toFixed(2)}</p>
                </div>
                <div className="bg-white bg-opacity-20 rounded-xl p-4">
                    <p className="text-blue-100 text-sm mb-1">Licenses Used</p>
                    <p className="text-xl font-bold">{usage.licensesUsed}/{usage.licensesTotal}</p>
                </div>
            </div>

            {/* Usage Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-white bg-opacity-10 rounded-lg p-3">
                    <p className="text-blue-100 text-xs mb-1">Requests This Month</p>
                    <p className="text-lg font-semibold">{usage.requestsThisMonth.toLocaleString()}</p>
                </div>
                <div className="bg-white bg-opacity-10 rounded-lg p-3">
                    <p className="text-blue-100 text-xs mb-1">Tokens Used</p>
                    <p className="text-lg font-semibold">{(usage.tokensUsed / 1000).toFixed(0)}K</p>
                </div>
                <div className="bg-white bg-opacity-10 rounded-lg p-3">
                    <p className="text-blue-100 text-xs mb-1">License Usage</p>
                    <p className="text-lg font-semibold">{licenseUsagePercentage.toFixed(1)}%</p>
                </div>
            </div>

            {/* License Usage Bar */}
            <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                    <span className="text-blue-100 text-sm">License Usage</span>
                    <span className="text-sm font-semibold">
                        {usage.licensesUsed} of {usage.licensesTotal} licenses
                    </span>
                </div>
                <div className="w-full bg-white bg-opacity-20 rounded-full h-2">
                    <div
                        className="bg-white rounded-full h-2 transition-all duration-500"
                        style={{ width: `${Math.min(licenseUsagePercentage, 100)}%` }}
                    ></div>
                </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3">
                {onViewDetails && (
                    <button
                        onClick={onViewDetails}
                        className="flex-1 px-4 py-2 bg-white bg-opacity-20 text-white rounded-lg hover:bg-opacity-30 transition-colors font-medium"
                    >
                        View Detailed Billing
                    </button>
                )}
                {onDownloadInvoice && (
                    <button
                        onClick={onDownloadInvoice}
                        className="flex-1 px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-gray-100 transition-colors font-medium"
                    >
                        Download Invoice
                    </button>
                )}
            </div>
        </div>
    );
};
