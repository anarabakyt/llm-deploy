import type { User } from '../entities';

interface SSOProvider {
    id: string;
    name: string;
    type: 'saml' | 'oauth2' | 'ldap';
    clientId?: string;
    clientSecret?: string;
    redirectUri: string;
    metadataUrl?: string;
    domain: string;
    isEnabled: boolean;
}

interface SSOConfig {
    providers: SSOProvider[];
    defaultProvider?: string;
    autoSyncUsers: boolean;
    tokenExpiration: number;
    sessionTimeout: number;
}

interface SSOUser {
    id: string;
    email: string;
    name: string;
    department?: string;
    role: 'admin' | 'member' | 'viewer';
    ssoProvider: string;
    domain: string;
    lastLogin: string;
    isActive: boolean;
}

class SSOService {
    private config: SSOConfig = {
        providers: [],
        autoSyncUsers: true,
        tokenExpiration: 60,
        sessionTimeout: 8
    };

    // Initialize SSO service
    async initialize(): Promise<void> {
        try {
            // Load SSO configuration from backend
            const response = await fetch('/api/sso/config');
            if (response.ok) {
                const contentType = response.headers.get('content-type');
                if (contentType && contentType.includes('application/json')) {
                    this.config = await response.json();
                } else {
                    console.warn('SSO config endpoint returned non-JSON response');
                }
            }
        } catch (error) {
            console.error('Failed to initialize SSO service:', error);
        }
    }

    // Get available SSO providers
    getProviders(): SSOProvider[] {
        return this.config.providers.filter(p => p.isEnabled);
    }

    // Get SSO provider by ID
    getProvider(providerId: string): SSOProvider | undefined {
        return this.config.providers.find(p => p.id === providerId);
    }

    // Initiate SSO login
    async initiateSSOLogin(providerId: string, domain?: string): Promise<string> {
        const provider = this.getProvider(providerId);
        if (!provider) {
            throw new Error('SSO provider not found');
        }

        try {
            const response = await fetch('/api/sso/initiate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    providerId,
                    domain,
                    redirectUri: provider.redirectUri
                })
            });

            if (!response.ok) {
                throw new Error('Failed to initiate SSO login');
            }

            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
                throw new Error('SSO login endpoint returned non-JSON response');
            }

            const data = await response.json();
            return data.authUrl;
        } catch (error) {
            console.error('SSO login initiation failed:', error);
            throw error;
        }
    }

    // Handle SSO callback
    async handleSSOCallback(providerId: string, code: string, state: string): Promise<User> {
        try {
            const response = await fetch('/api/sso/callback', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    providerId,
                    code,
                    state
                })
            });

            if (!response.ok) {
                throw new Error('SSO callback failed');
            }

            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
                throw new Error('SSO callback endpoint returned non-JSON response');
            }

            const data = await response.json();
            return data.user;
        } catch (error) {
            console.error('SSO callback failed:', error);
            throw error;
        }
    }

    // Get corporate users
    async getCorporateUsers(domain?: string): Promise<SSOUser[]> {
        try {
            const url = domain ? `/api/sso/users?domain=${domain}` : '/api/sso/users';
            const response = await fetch(url);
            
            if (!response.ok) {
                throw new Error('Failed to fetch corporate users');
            }

            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
                console.warn('Corporate users endpoint returned non-JSON response');
                return [];
            }

            return await response.json();
        } catch (error) {
            console.error('Failed to fetch corporate users:', error);
            return [];
        }
    }

    // Sync users from SSO provider
    async syncUsers(providerId: string): Promise<SSOUser[]> {
        try {
            const response = await fetch('/api/sso/sync', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ providerId })
            });

            if (!response.ok) {
                throw new Error('User sync failed');
            }

            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
                throw new Error('User sync endpoint returned non-JSON response');
            }

            return await response.json();
        } catch (error) {
            console.error('User sync failed:', error);
            throw error;
        }
    }

    // Update user role
    async updateUserRole(userId: string, role: 'admin' | 'member' | 'viewer'): Promise<void> {
        try {
            const response = await fetch(`/api/sso/users/${userId}/role`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ role })
            });

            if (!response.ok) {
                throw new Error('Failed to update user role');
            }
        } catch (error) {
            console.error('Failed to update user role:', error);
            throw error;
        }
    }

    // Suspend/activate user
    async updateUserStatus(userId: string, isActive: boolean): Promise<void> {
        try {
            const response = await fetch(`/api/sso/users/${userId}/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ isActive })
            });

            if (!response.ok) {
                throw new Error('Failed to update user status');
            }
        } catch (error) {
            console.error('Failed to update user status:', error);
            throw error;
        }
    }

    // Bulk user actions
    async bulkUserAction(action: string, userIds: string[]): Promise<void> {
        try {
            const response = await fetch('/api/sso/users/bulk', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ action, userIds })
            });

            if (!response.ok) {
                throw new Error('Bulk action failed');
            }
        } catch (error) {
            console.error('Bulk action failed:', error);
            throw error;
        }
    }

    // Test SSO connection
    async testConnection(providerId: string): Promise<boolean> {
        try {
            const response = await fetch(`/api/sso/test/${providerId}`, {
                method: 'POST'
            });

            return response.ok;
        } catch (error) {
            console.error('SSO connection test failed:', error);
            return false;
        }
    }

    // Update SSO configuration
    async updateConfig(providerId: string, config: Partial<SSOProvider>): Promise<void> {
        try {
            const response = await fetch(`/api/sso/config/${providerId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(config)
            });

            if (!response.ok) {
                throw new Error('Failed to update SSO configuration');
            }
        } catch (error) {
            console.error('Failed to update SSO configuration:', error);
            throw error;
        }
    }

    // Get SSO statistics
    async getStatistics(): Promise<{
        totalUsers: number;
        activeUsers: number;
        providers: number;
        lastSync: string;
    }> {
        try {
            const response = await fetch('/api/sso/statistics');
            
            if (!response.ok) {
                throw new Error('Failed to fetch SSO statistics');
            }

            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
                console.warn('SSO statistics endpoint returned non-JSON response');
                return {
                    totalUsers: 0,
                    activeUsers: 0,
                    providers: 0,
                    lastSync: ''
                };
            }

            return await response.json();
        } catch (error) {
            console.error('Failed to fetch SSO statistics:', error);
            return {
                totalUsers: 0,
                activeUsers: 0,
                providers: 0,
                lastSync: ''
            };
        }
    }
}

// Export singleton instance
export const ssoService = new SSOService();
