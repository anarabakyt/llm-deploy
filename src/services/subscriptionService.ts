// Mock subscription service for B2C subscription management
export interface SubscriptionPlan {
    id: string;
    name: string;
    price: number;
    period: 'month' | 'year';
    description: string;
    features: string[];
    popular?: boolean;
    limits: {
        requestsPerDay: number;
        apiCallsPerMonth: number;
        users: number;
        storage: string;
    };
}

export interface UserSubscription {
    id: string;
    userId: string;
    planId: string;
    status: 'active' | 'cancelled' | 'past_due' | 'trialing';
    currentPeriodStart: string;
    currentPeriodEnd: string;
    cancelAtPeriodEnd: boolean;
    trialEnd?: string;
    amount: number;
    currency: string;
    nextBillingDate?: string;
}

export interface PaymentMethod {
    id: string;
    type: 'card' | 'paypal';
    last4?: string;
    brand?: string;
    expiryMonth?: number;
    expiryYear?: number;
    isDefault: boolean;
}

export interface BillingHistoryItem {
    id: string;
    date: string;
    amount: number;
    status: 'paid' | 'pending' | 'failed';
    description: string;
    invoiceUrl?: string;
}

export interface UsageStats {
    requestsUsed: number;
    requestsLimit: number;
    apiCallsUsed: number;
    apiCallsLimit: number;
    storageUsed: number;
    storageLimit: number;
    resetDate: string;
}

// Mock data
const mockPlans: SubscriptionPlan[] = [
    {
        id: 'free',
        name: 'Free',
        price: 0,
        period: 'month',
        description: 'Perfect for getting started',
        features: [
            '5 requests per day',
            'Basic LLM models',
            'Standard support',
            'Basic analytics',
            '1 user account'
        ],
        limits: {
            requestsPerDay: 5,
            apiCallsPerMonth: 150,
            users: 1,
            storage: '100MB'
        }
    },
    {
        id: 'pro',
        name: 'Pro',
        price: 29,
        period: 'month',
        description: 'Best for professionals',
        features: [
            '100 requests per day',
            'All LLM models',
            'Priority support',
            'Advanced analytics',
            'User management',
            'API access',
            'Custom integrations'
        ],
        popular: true,
        limits: {
            requestsPerDay: 100,
            apiCallsPerMonth: 3000,
            users: 5,
            storage: '10GB'
        }
    },
    {
        id: 'enterprise',
        name: 'Enterprise',
        price: 99,
        period: 'month',
        description: 'For teams and organizations',
        features: [
            'Unlimited requests',
            'All LLM models',
            '24/7 support',
            'Full analytics dashboard',
            'Team management',
            'Advanced API access',
            'Custom integrations',
            'Admin panel access',
            'White-label options'
        ],
        limits: {
            requestsPerDay: -1, // Unlimited
            apiCallsPerMonth: -1, // Unlimited
            users: -1, // Unlimited
            storage: '1TB'
        }
    }
];

const mockUserSubscription: UserSubscription = {
    id: 'sub_123456789',
    userId: 'user_123',
    planId: 'pro',
    status: 'active',
    currentPeriodStart: '2024-01-01',
    currentPeriodEnd: '2024-02-01',
    cancelAtPeriodEnd: false,
    amount: 29,
    currency: 'USD',
    nextBillingDate: '2024-02-01'
};

const mockPaymentMethods: PaymentMethod[] = [
    {
        id: 'pm_123',
        type: 'card',
        last4: '4242',
        brand: 'visa',
        expiryMonth: 12,
        expiryYear: 2025,
        isDefault: true
    }
];

const mockBillingHistory: BillingHistoryItem[] = [
    {
        id: 'inv_001',
        date: '2024-01-01',
        amount: 29,
        status: 'paid',
        description: 'Pro Plan - Monthly',
        invoiceUrl: '#'
    },
    {
        id: 'inv_002',
        date: '2023-12-01',
        amount: 29,
        status: 'paid',
        description: 'Pro Plan - Monthly',
        invoiceUrl: '#'
    },
    {
        id: 'inv_003',
        date: '2023-11-01',
        amount: 29,
        status: 'paid',
        description: 'Pro Plan - Monthly',
        invoiceUrl: '#'
    }
];

const mockUsageStats: UsageStats = {
    requestsUsed: 750,
    requestsLimit: 1000,
    apiCallsUsed: 1200,
    apiCallsLimit: 2000,
    storageUsed: 2.5,
    storageLimit: 10,
    resetDate: '2024-02-01'
};

// Service functions
export class SubscriptionService {
    // Get all available plans
    static async getPlans(): Promise<SubscriptionPlan[]> {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));
        return mockPlans;
    }

    // Get user's current subscription
    static async getUserSubscription(userId: string): Promise<UserSubscription | null> {
        await new Promise(resolve => setTimeout(resolve, 300));
        return mockUserSubscription;
    }

    // Get user's payment methods
    static async getPaymentMethods(userId: string): Promise<PaymentMethod[]> {
        await new Promise(resolve => setTimeout(resolve, 300));
        return mockPaymentMethods;
    }

    // Get billing history
    static async getBillingHistory(userId: string): Promise<BillingHistoryItem[]> {
        await new Promise(resolve => setTimeout(resolve, 300));
        return mockBillingHistory;
    }

    // Get usage statistics
    static async getUsageStats(userId: string): Promise<UsageStats> {
        await new Promise(resolve => setTimeout(resolve, 300));
        return mockUsageStats;
    }

    // Subscribe to a plan
    static async subscribeToPlan(
        userId: string,
        planId: string,
        paymentMethodId: string
    ): Promise<{ success: boolean; subscription?: UserSubscription; error?: string }> {
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        const plan = mockPlans.find(p => p.id === planId);
        if (!plan) {
            return { success: false, error: 'Plan not found' };
        }

        const newSubscription: UserSubscription = {
            id: `sub_${Date.now()}`,
            userId,
            planId,
            status: 'active',
            currentPeriodStart: new Date().toISOString(),
            currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            cancelAtPeriodEnd: false,
            amount: plan.price,
            currency: 'USD',
            nextBillingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
        };

        return { success: true, subscription: newSubscription };
    }

    // Cancel subscription
    static async cancelSubscription(
        userId: string,
        subscriptionId: string
    ): Promise<{ success: boolean; error?: string }> {
        await new Promise(resolve => setTimeout(resolve, 1000));
        return { success: true };
    }

    // Reactivate subscription
    static async reactivateSubscription(
        userId: string,
        subscriptionId: string
    ): Promise<{ success: boolean; error?: string }> {
        await new Promise(resolve => setTimeout(resolve, 1000));
        return { success: true };
    }

    // Change subscription plan
    static async changePlan(
        userId: string,
        subscriptionId: string,
        newPlanId: string
    ): Promise<{ success: boolean; subscription?: UserSubscription; error?: string }> {
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        const plan = mockPlans.find(p => p.id === newPlanId);
        if (!plan) {
            return { success: false, error: 'Plan not found' };
        }

        const updatedSubscription: UserSubscription = {
            ...mockUserSubscription,
            planId: newPlanId,
            amount: plan.price
        };

        return { success: true, subscription: updatedSubscription };
    }

    // Add payment method
    static async addPaymentMethod(
        userId: string,
        paymentMethod: Omit<PaymentMethod, 'id'>
    ): Promise<{ success: boolean; paymentMethod?: PaymentMethod; error?: string }> {
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const newPaymentMethod: PaymentMethod = {
            ...paymentMethod,
            id: `pm_${Date.now()}`
        };

        return { success: true, paymentMethod: newPaymentMethod };
    }

    // Update payment method
    static async updatePaymentMethod(
        userId: string,
        paymentMethodId: string,
        updates: Partial<PaymentMethod>
    ): Promise<{ success: boolean; error?: string }> {
        await new Promise(resolve => setTimeout(resolve, 1000));
        return { success: true };
    }

    // Delete payment method
    static async deletePaymentMethod(
        userId: string,
        paymentMethodId: string
    ): Promise<{ success: boolean; error?: string }> {
        await new Promise(resolve => setTimeout(resolve, 1000));
        return { success: true };
    }

    // Check if user has access to feature
    static async checkFeatureAccess(
        userId: string,
        feature: string
    ): Promise<boolean> {
        const subscription = await this.getUserSubscription(userId);
        if (!subscription) return false;

        const plan = mockPlans.find(p => p.id === subscription.planId);
        if (!plan) return false;

        // Check specific feature access based on plan
        switch (feature) {
            case 'api_access':
                return plan.id !== 'free';
            case 'advanced_analytics':
                return plan.id === 'pro' || plan.id === 'enterprise';
            case 'admin_panel':
                return plan.id === 'enterprise';
            case 'unlimited_requests':
                return plan.id === 'enterprise';
            default:
                return true;
        }
    }

    // Check usage limits
    static async checkUsageLimit(
        userId: string,
        limitType: 'requests' | 'api_calls' | 'storage'
    ): Promise<{ withinLimit: boolean; used: number; limit: number }> {
        const usage = await this.getUsageStats(userId);
        const subscription = await this.getUserSubscription(userId);
        
        if (!subscription) {
            return { withinLimit: false, used: 0, limit: 0 };
        }

        const plan = mockPlans.find(p => p.id === subscription.planId);
        if (!plan) {
            return { withinLimit: false, used: 0, limit: 0 };
        }

        switch (limitType) {
            case 'requests':
                const requestLimit = plan.limits.requestsPerDay;
                return {
                    withinLimit: requestLimit === -1 || usage.requestsUsed < requestLimit,
                    used: usage.requestsUsed,
                    limit: requestLimit
                };
            case 'api_calls':
                const apiLimit = plan.limits.apiCallsPerMonth;
                return {
                    withinLimit: apiLimit === -1 || usage.apiCallsUsed < apiLimit,
                    used: usage.apiCallsUsed,
                    limit: apiLimit
                };
            case 'storage':
                const storageLimit = parseFloat(plan.limits.storage.replace('GB', '')) * 1024; // Convert to MB
                return {
                    withinLimit: usage.storageUsed < storageLimit,
                    used: usage.storageUsed,
                    limit: storageLimit
                };
            default:
                return { withinLimit: true, used: 0, limit: 0 };
        }
    }
}

