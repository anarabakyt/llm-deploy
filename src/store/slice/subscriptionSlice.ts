import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { SubscriptionService } from '../../services/subscriptionService';
import type { SubscriptionPlan, UserSubscription, PaymentMethod, BillingHistoryItem, UsageStats } from '../../services/subscriptionService';

interface SubscriptionState {
    plans: SubscriptionPlan[];
    currentSubscription: UserSubscription | null;
    paymentMethods: PaymentMethod[];
    billingHistory: BillingHistoryItem[];
    usageStats: UsageStats | null;
    selectedPlan: SubscriptionPlan | null;
    loading: {
        plans: boolean;
        subscription: boolean;
        paymentMethods: boolean;
        billingHistory: boolean;
        usageStats: boolean;
        subscribing: boolean;
        cancelling: boolean;
        changingPlan: boolean;
    };
    error: string | null;
}

const initialState: SubscriptionState = {
    plans: [],
    currentSubscription: null,
    paymentMethods: [],
    billingHistory: [],
    usageStats: null,
    selectedPlan: null,
    loading: {
        plans: false,
        subscription: false,
        paymentMethods: false,
        billingHistory: false,
        usageStats: false,
        subscribing: false,
        cancelling: false,
        changingPlan: false,
    },
    error: null,
};

// Async thunks
export const fetchPlans = createAsyncThunk(
    'subscription/fetchPlans',
    async (_, { rejectWithValue }) => {
        try {
            const plans = await SubscriptionService.getPlans();
            return plans;
        } catch (error) {
            return rejectWithValue('Failed to fetch plans');
        }
    }
);

export const fetchUserSubscription = createAsyncThunk(
    'subscription/fetchUserSubscription',
    async (userId: string, { rejectWithValue }) => {
        try {
            const subscription = await SubscriptionService.getUserSubscription(userId);
            return subscription;
        } catch (error) {
            return rejectWithValue('Failed to fetch subscription');
        }
    }
);

export const fetchPaymentMethods = createAsyncThunk(
    'subscription/fetchPaymentMethods',
    async (userId: string, { rejectWithValue }) => {
        try {
            const paymentMethods = await SubscriptionService.getPaymentMethods(userId);
            return paymentMethods;
        } catch (error) {
            return rejectWithValue('Failed to fetch payment methods');
        }
    }
);

export const fetchBillingHistory = createAsyncThunk(
    'subscription/fetchBillingHistory',
    async (userId: string, { rejectWithValue }) => {
        try {
            const billingHistory = await SubscriptionService.getBillingHistory(userId);
            return billingHistory;
        } catch (error) {
            return rejectWithValue('Failed to fetch billing history');
        }
    }
);

export const fetchUsageStats = createAsyncThunk(
    'subscription/fetchUsageStats',
    async (userId: string, { rejectWithValue }) => {
        try {
            const usageStats = await SubscriptionService.getUsageStats(userId);
            return usageStats;
        } catch (error) {
            return rejectWithValue('Failed to fetch usage stats');
        }
    }
);

export const subscribeToPlan = createAsyncThunk(
    'subscription/subscribeToPlan',
    async (
        { userId, planId, paymentMethodId }: { userId: string; planId: string; paymentMethodId: string },
        { rejectWithValue }
    ) => {
        try {
            const result = await SubscriptionService.subscribeToPlan(userId, planId, paymentMethodId);
            if (!result.success) {
                return rejectWithValue(result.error || 'Subscription failed');
            }
            return result.subscription;
        } catch (error) {
            return rejectWithValue('Subscription failed');
        }
    }
);

export const cancelSubscription = createAsyncThunk(
    'subscription/cancelSubscription',
    async (
        { userId, subscriptionId }: { userId: string; subscriptionId: string },
        { rejectWithValue }
    ) => {
        try {
            const result = await SubscriptionService.cancelSubscription(userId, subscriptionId);
            if (!result.success) {
                return rejectWithValue(result.error || 'Cancellation failed');
            }
            return { subscriptionId };
        } catch (error) {
            return rejectWithValue('Cancellation failed');
        }
    }
);

export const reactivateSubscription = createAsyncThunk(
    'subscription/reactivateSubscription',
    async (
        { userId, subscriptionId }: { userId: string; subscriptionId: string },
        { rejectWithValue }
    ) => {
        try {
            const result = await SubscriptionService.reactivateSubscription(userId, subscriptionId);
            if (!result.success) {
                return rejectWithValue(result.error || 'Reactivation failed');
            }
            return { subscriptionId };
        } catch (error) {
            return rejectWithValue('Reactivation failed');
        }
    }
);

export const changePlan = createAsyncThunk(
    'subscription/changePlan',
    async (
        { userId, subscriptionId, newPlanId }: { userId: string; subscriptionId: string; newPlanId: string },
        { rejectWithValue }
    ) => {
        try {
            const result = await SubscriptionService.changePlan(userId, subscriptionId, newPlanId);
            if (!result.success) {
                return rejectWithValue(result.error || 'Plan change failed');
            }
            return result.subscription;
        } catch (error) {
            return rejectWithValue('Plan change failed');
        }
    }
);

export const addPaymentMethod = createAsyncThunk(
    'subscription/addPaymentMethod',
    async (
        { userId, paymentMethod }: { userId: string; paymentMethod: Omit<PaymentMethod, 'id'> },
        { rejectWithValue }
    ) => {
        try {
            const result = await SubscriptionService.addPaymentMethod(userId, paymentMethod);
            if (!result.success) {
                return rejectWithValue(result.error || 'Failed to add payment method');
            }
            return result.paymentMethod;
        } catch (error) {
            return rejectWithValue('Failed to add payment method');
        }
    }
);

export const updatePaymentMethod = createAsyncThunk(
    'subscription/updatePaymentMethod',
    async (
        { userId, paymentMethodId, updates }: { userId: string; paymentMethodId: string; updates: Partial<PaymentMethod> },
        { rejectWithValue }
    ) => {
        try {
            const result = await SubscriptionService.updatePaymentMethod(userId, paymentMethodId, updates);
            if (!result.success) {
                return rejectWithValue(result.error || 'Failed to update payment method');
            }
            return { paymentMethodId, updates };
        } catch (error) {
            return rejectWithValue('Failed to update payment method');
        }
    }
);

export const deletePaymentMethod = createAsyncThunk(
    'subscription/deletePaymentMethod',
    async (
        { userId, paymentMethodId }: { userId: string; paymentMethodId: string },
        { rejectWithValue }
    ) => {
        try {
            const result = await SubscriptionService.deletePaymentMethod(userId, paymentMethodId);
            if (!result.success) {
                return rejectWithValue(result.error || 'Failed to delete payment method');
            }
            return paymentMethodId;
        } catch (error) {
            return rejectWithValue('Failed to delete payment method');
        }
    }
);

const subscriptionSlice = createSlice({
    name: 'subscription',
    initialState,
    reducers: {
        setSelectedPlan: (state, action: PayloadAction<SubscriptionPlan | null>) => {
            state.selectedPlan = action.payload;
        },
        clearError: (state) => {
            state.error = null;
        },
        resetSubscriptionState: (state) => {
            return initialState;
        },
    },
    extraReducers: (builder) => {
        // Fetch plans
        builder
            .addCase(fetchPlans.pending, (state) => {
                state.loading.plans = true;
                state.error = null;
            })
            .addCase(fetchPlans.fulfilled, (state, action) => {
                state.loading.plans = false;
                state.plans = action.payload;
            })
            .addCase(fetchPlans.rejected, (state, action) => {
                state.loading.plans = false;
                state.error = action.payload as string;
            });

        // Fetch user subscription
        builder
            .addCase(fetchUserSubscription.pending, (state) => {
                state.loading.subscription = true;
                state.error = null;
            })
            .addCase(fetchUserSubscription.fulfilled, (state, action) => {
                state.loading.subscription = false;
                state.currentSubscription = action.payload;
            })
            .addCase(fetchUserSubscription.rejected, (state, action) => {
                state.loading.subscription = false;
                state.error = action.payload as string;
            });

        // Fetch payment methods
        builder
            .addCase(fetchPaymentMethods.pending, (state) => {
                state.loading.paymentMethods = true;
                state.error = null;
            })
            .addCase(fetchPaymentMethods.fulfilled, (state, action) => {
                state.loading.paymentMethods = false;
                state.paymentMethods = action.payload;
            })
            .addCase(fetchPaymentMethods.rejected, (state, action) => {
                state.loading.paymentMethods = false;
                state.error = action.payload as string;
            });

        // Fetch billing history
        builder
            .addCase(fetchBillingHistory.pending, (state) => {
                state.loading.billingHistory = true;
                state.error = null;
            })
            .addCase(fetchBillingHistory.fulfilled, (state, action) => {
                state.loading.billingHistory = false;
                state.billingHistory = action.payload;
            })
            .addCase(fetchBillingHistory.rejected, (state, action) => {
                state.loading.billingHistory = false;
                state.error = action.payload as string;
            });

        // Fetch usage stats
        builder
            .addCase(fetchUsageStats.pending, (state) => {
                state.loading.usageStats = true;
                state.error = null;
            })
            .addCase(fetchUsageStats.fulfilled, (state, action) => {
                state.loading.usageStats = false;
                state.usageStats = action.payload;
            })
            .addCase(fetchUsageStats.rejected, (state, action) => {
                state.loading.usageStats = false;
                state.error = action.payload as string;
            });

        // Subscribe to plan
        builder
            .addCase(subscribeToPlan.pending, (state) => {
                state.loading.subscribing = true;
                state.error = null;
            })
            .addCase(subscribeToPlan.fulfilled, (state, action) => {
                state.loading.subscribing = false;
                state.currentSubscription = action.payload || null;
                state.selectedPlan = null;
            })
            .addCase(subscribeToPlan.rejected, (state, action) => {
                state.loading.subscribing = false;
                state.error = action.payload as string;
            });

        // Cancel subscription
        builder
            .addCase(cancelSubscription.pending, (state) => {
                state.loading.cancelling = true;
                state.error = null;
            })
            .addCase(cancelSubscription.fulfilled, (state, action) => {
                state.loading.cancelling = false;
                if (state.currentSubscription?.id === action.payload.subscriptionId) {
                    state.currentSubscription = {
                        ...state.currentSubscription,
                        cancelAtPeriodEnd: true
                    };
                }
            })
            .addCase(cancelSubscription.rejected, (state, action) => {
                state.loading.cancelling = false;
                state.error = action.payload as string;
            });

        // Reactivate subscription
        builder
            .addCase(reactivateSubscription.fulfilled, (state, action) => {
                if (state.currentSubscription?.id === action.payload.subscriptionId) {
                    state.currentSubscription = {
                        ...state.currentSubscription,
                        cancelAtPeriodEnd: false
                    };
                }
            });

        // Change plan
        builder
            .addCase(changePlan.pending, (state) => {
                state.loading.changingPlan = true;
                state.error = null;
            })
            .addCase(changePlan.fulfilled, (state, action) => {
                state.loading.changingPlan = false;
                state.currentSubscription = action.payload || null;
            })
            .addCase(changePlan.rejected, (state, action) => {
                state.loading.changingPlan = false;
                state.error = action.payload as string;
            });

        // Add payment method
        builder
            .addCase(addPaymentMethod.fulfilled, (state, action) => {
                if (action.payload) {
                    state.paymentMethods.push(action.payload);
                }
            });

        // Update payment method
        builder
            .addCase(updatePaymentMethod.fulfilled, (state, action) => {
                const index = state.paymentMethods.findIndex(pm => pm.id === action.payload.paymentMethodId);
                if (index !== -1) {
                    state.paymentMethods[index] = { ...state.paymentMethods[index], ...action.payload.updates };
                }
            });

        // Delete payment method
        builder
            .addCase(deletePaymentMethod.fulfilled, (state, action) => {
                state.paymentMethods = state.paymentMethods.filter(pm => pm.id !== action.payload);
            });
    },
});

export const { setSelectedPlan, clearError, resetSubscriptionState } = subscriptionSlice.actions;
export default subscriptionSlice.reducer;
