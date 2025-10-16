import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch } from '../../config/store';
import type { RootState } from '../../config/store';
import { 
    fetchPlans, 
    fetchUserSubscription, 
    fetchPaymentMethods, 
    fetchBillingHistory, 
    fetchUsageStats,
    subscribeToPlan,
    setSelectedPlan
} from '../../store/slice/subscriptionSlice';
import { PricingPage } from './PricingPage';
import { PaymentModal } from './PaymentModal';
import { SubscriptionManagement } from './SubscriptionManagement';
import { FeatureComparison } from './FeatureComparison';

export const SubscriptionDemo: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { 
        plans, 
        currentSubscription, 
        paymentMethods, 
        billingHistory, 
        usageStats, 
        selectedPlan,
        loading,
        error 
    } = useSelector((state: RootState) => state.subscription);

    const [currentView, setCurrentView] = useState<'pricing' | 'management' | 'comparison'>('pricing');
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [selectedPlanForPayment, setSelectedPlanForPayment] = useState<any>(null);

    // Mock user ID - in real app, this would come from auth state
    const userId = 'user_123';

    useEffect(() => {
        // Load initial data
        dispatch(fetchPlans());
        dispatch(fetchUserSubscription(userId));
        dispatch(fetchPaymentMethods(userId));
        dispatch(fetchBillingHistory(userId));
        dispatch(fetchUsageStats(userId));
    }, [dispatch]);

    const handlePlanSelect = (planId: string) => {
        const plan = plans.find(p => p.id === planId);
        if (plan) {
            setSelectedPlan(plan);
            setSelectedPlanForPayment(plan);
            setShowPaymentModal(true);
        }
    };

    const handlePaymentSuccess = (paymentData: any) => {
        console.log('Payment successful:', paymentData);
        // In real app, this would trigger subscription creation
        dispatch(subscribeToPlan({
            userId,
            planId: selectedPlanForPayment.id,
            paymentMethodId: 'pm_mock'
        }));
        setShowPaymentModal(false);
        setSelectedPlanForPayment(null);
    };

    const handlePaymentClose = () => {
        setShowPaymentModal(false);
        setSelectedPlanForPayment(null);
    };

    return (
        <div className="h-screen bg-gray-50 overflow-y-auto flex flex-col">
            {/* Navigation */}
            <nav className="bg-white shadow-sm border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center">
                            <h1 className="text-xl font-semibold text-gray-900">
                                Subscription Demo
                            </h1>
                        </div>
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={() => setCurrentView('pricing')}
                                className={`px-3 py-2 rounded-md text-sm font-medium ${
                                    currentView === 'pricing'
                                        ? 'bg-blue-100 text-blue-700'
                                        : 'text-gray-500 hover:text-gray-700'
                                }`}
                            >
                                Pricing
                            </button>
                            <button
                                onClick={() => setCurrentView('management')}
                                className={`px-3 py-2 rounded-md text-sm font-medium ${
                                    currentView === 'management'
                                        ? 'bg-blue-100 text-blue-700'
                                        : 'text-gray-500 hover:text-gray-700'
                                }`}
                            >
                                Management
                            </button>
                            <button
                                onClick={() => setCurrentView('comparison')}
                                className={`px-3 py-2 rounded-md text-sm font-medium ${
                                    currentView === 'comparison'
                                        ? 'bg-blue-100 text-blue-700'
                                        : 'text-gray-500 hover:text-gray-700'
                                }`}
                            >
                                Comparison
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Content */}
            <div className="flex-1 max-w-7xl mx-auto pb-24 overflow-y-auto">
                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-md p-4 m-6">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <h3 className="text-sm font-medium text-red-800">
                                    Error
                                </h3>
                                <div className="mt-2 text-sm text-red-700">
                                    {error}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {currentView === 'pricing' && (
                    <PricingPage />
                )}

                {currentView === 'management' && (
                    <SubscriptionManagement />
                )}

                {currentView === 'comparison' && (
                    <div className="p-6">
                        <FeatureComparison />
                    </div>
                )}

                {/* Payment Modal */}
                {showPaymentModal && selectedPlanForPayment && (
                    <PaymentModal
                        isOpen={showPaymentModal}
                        onClose={handlePaymentClose}
                        plan={selectedPlanForPayment}
                        onPaymentSuccess={handlePaymentSuccess}
                    />
                )}

                {/* Loading Overlay */}
                {(loading.plans || loading.subscription || loading.paymentMethods) && (
                    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-lg p-6 flex items-center space-x-3">
                            <svg className="animate-spin h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <span className="text-gray-700">Loading...</span>
                        </div>
                    </div>
                )}
            </div>

            {/* Debug Info - Moved to top right to avoid covering content */}
            <div className="fixed top-20 right-4 bg-gray-800 text-white p-3 rounded-lg text-xs max-w-sm z-40">
                <h4 className="font-semibold mb-1">Debug Info:</h4>
                <div>Subscription: {currentSubscription?.planId || 'None'}</div>
                <div>Payment Methods: {paymentMethods.length}</div>
                <div>Billing History: {billingHistory.length} items</div>
                <div>Usage Stats: {usageStats ? 'Loaded' : 'Not loaded'}</div>
                <div>Selected Plan: {selectedPlan?.name || 'None'}</div>
            </div>
        </div>
    );
};
