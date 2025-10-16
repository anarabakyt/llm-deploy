import { ssoService } from './ssoService';

interface OAuth2Config {
    clientId: string;
    clientSecret: string;
    redirectUri: string;
    authorizationUrl: string;
    tokenUrl: string;
    userInfoUrl: string;
    scopes: string[];
    responseType: 'code' | 'token';
    grantType: 'authorization_code' | 'client_credentials';
}

interface OAuth2Token {
    accessToken: string;
    refreshToken?: string;
    tokenType: string;
    expiresIn: number;
    scope: string;
}

interface OAuth2User {
    id: string;
    email: string;
    name: string;
    picture?: string;
    department?: string;
    role?: string;
    domain?: string;
}

class OAuth2Service {
    private configs: Map<string, OAuth2Config> = new Map();

    // Initialize OAuth2 service
    async initialize(providerId: string): Promise<void> {
        try {
            const provider = ssoService.getProvider(providerId);
            if (!provider || provider.type !== 'oauth2') {
                throw new Error('Invalid OAuth2 provider');
            }

            // Load OAuth2 configuration
            const response = await fetch(`/api/sso/oauth2/config/${providerId}`);
            if (response.ok) {
                const config = await response.json();
                this.configs.set(providerId, config);
            }
        } catch (error) {
            console.error('Failed to initialize OAuth2 service:', error);
            throw error;
        }
    }

    // Generate OAuth2 authorization URL
    generateAuthUrl(providerId: string, state?: string): string {
        const config = this.configs.get(providerId);
        if (!config) {
            throw new Error('OAuth2 configuration not found');
        }

        const params = new URLSearchParams({
            client_id: config.clientId,
            redirect_uri: config.redirectUri,
            response_type: config.responseType,
            scope: config.scopes.join(' '),
            ...(state && { state })
        });

        return `${config.authorizationUrl}?${params.toString()}`;
    }

    // Exchange authorization code for access token
    async exchangeCodeForToken(providerId: string, code: string, state?: string): Promise<OAuth2Token> {
        try {
            const response = await fetch('/api/sso/oauth2/token', {
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
                throw new Error('Failed to exchange code for token');
            }

            return await response.json();
        } catch (error) {
            console.error('OAuth2 token exchange failed:', error);
            throw error;
        }
    }

    // Get user information using access token
    async getUserInfo(providerId: string, accessToken: string): Promise<OAuth2User> {
        try {
            const response = await fetch('/api/sso/oauth2/userinfo', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    providerId,
                    accessToken
                })
            });

            if (!response.ok) {
                throw new Error('Failed to get user info');
            }

            return await response.json();
        } catch (error) {
            console.error('OAuth2 user info fetch failed:', error);
            throw error;
        }
    }

    // Refresh access token
    async refreshToken(providerId: string, refreshToken: string): Promise<OAuth2Token> {
        try {
            const response = await fetch('/api/sso/oauth2/refresh', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    providerId,
                    refreshToken
                })
            });

            if (!response.ok) {
                throw new Error('Failed to refresh token');
            }

            return await response.json();
        } catch (error) {
            console.error('OAuth2 token refresh failed:', error);
            throw error;
        }
    }

    // Revoke access token
    async revokeToken(providerId: string, accessToken: string): Promise<void> {
        try {
            const response = await fetch('/api/sso/oauth2/revoke', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    providerId,
                    accessToken
                })
            });

            if (!response.ok) {
                throw new Error('Failed to revoke token');
            }
        } catch (error) {
            console.error('OAuth2 token revocation failed:', error);
            throw error;
        }
    }

    // Validate access token
    async validateToken(providerId: string, accessToken: string): Promise<boolean> {
        try {
            const response = await fetch('/api/sso/oauth2/validate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    providerId,
                    accessToken
                })
            });

            return response.ok;
        } catch (error) {
            console.error('OAuth2 token validation failed:', error);
            return false;
        }
    }

    // Get supported OAuth2 providers
    getSupportedProviders(): string[] {
        return [
            'google-workspace',
            'microsoft-azure',
            'okta',
            'auth0',
            'generic-oauth2'
        ];
    }

    // Get provider-specific configuration
    getProviderConfig(providerId: string): OAuth2Config | undefined {
        return this.configs.get(providerId);
    }

    // Update OAuth2 configuration
    async updateConfig(providerId: string, config: Partial<OAuth2Config>): Promise<void> {
        try {
            const response = await fetch(`/api/sso/oauth2/config/${providerId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(config)
            });

            if (!response.ok) {
                throw new Error('Failed to update OAuth2 configuration');
            }

            // Update local config
            const currentConfig = this.configs.get(providerId);
            if (currentConfig) {
                this.configs.set(providerId, { ...currentConfig, ...config });
            }
        } catch (error) {
            console.error('Failed to update OAuth2 configuration:', error);
            throw error;
        }
    }

    // Test OAuth2 connection
    async testConnection(providerId: string): Promise<boolean> {
        try {
            const response = await fetch(`/api/sso/oauth2/test/${providerId}`, {
                method: 'POST'
            });

            return response.ok;
        } catch (error) {
            console.error('OAuth2 connection test failed:', error);
            return false;
        }
    }
}

// Export singleton instance
export const oauth2Service = new OAuth2Service();
