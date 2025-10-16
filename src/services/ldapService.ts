import { ssoService } from './ssoService';

interface LDAPConfig {
    server: string;
    port: number;
    baseDN: string;
    bindDN: string;
    bindPassword: string;
    userSearchBase: string;
    userSearchFilter: string;
    groupSearchBase: string;
    groupSearchFilter: string;
    useSSL: boolean;
    useTLS: boolean;
    timeout: number;
}

interface LDAPUser {
    dn: string;
    cn: string;
    sn: string;
    givenName: string;
    mail: string;
    uid: string;
    memberOf: string[];
    department?: string;
    title?: string;
    telephoneNumber?: string;
    isActive: boolean;
}

interface LDAPGroup {
    dn: string;
    cn: string;
    description?: string;
    member: string[];
}

class LDAPService {
    private configs: Map<string, LDAPConfig> = new Map();

    // Initialize LDAP service
    async initialize(providerId: string): Promise<void> {
        try {
            const provider = ssoService.getProvider(providerId);
            if (!provider || provider.type !== 'ldap') {
                throw new Error('Invalid LDAP provider');
            }

            // Load LDAP configuration
            const response = await fetch(`/api/sso/ldap/config/${providerId}`);
            if (response.ok) {
                const config = await response.json();
                this.configs.set(providerId, config);
            }
        } catch (error) {
            console.error('Failed to initialize LDAP service:', error);
            throw error;
        }
    }

    // Authenticate user with LDAP
    async authenticate(providerId: string, username: string, password: string): Promise<LDAPUser | null> {
        try {
            const response = await fetch('/api/sso/ldap/authenticate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    providerId,
                    username,
                    password
                })
            });

            if (!response.ok) {
                return null;
            }

            return await response.json();
        } catch (error) {
            console.error('LDAP authentication failed:', error);
            return null;
        }
    }

    // Search users in LDAP
    async searchUsers(providerId: string, filter?: string, limit?: number): Promise<LDAPUser[]> {
        try {
            const params = new URLSearchParams({
                providerId,
                ...(filter && { filter }),
                ...(limit && { limit: limit.toString() })
            });

            const response = await fetch(`/api/sso/ldap/users?${params}`);
            
            if (!response.ok) {
                throw new Error('Failed to search LDAP users');
            }

            return await response.json();
        } catch (error) {
            console.error('LDAP user search failed:', error);
            return [];
        }
    }

    // Get user by DN
    async getUserByDN(providerId: string, dn: string): Promise<LDAPUser | null> {
        try {
            const response = await fetch(`/api/sso/ldap/users/by-dn`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    providerId,
                    dn
                })
            });

            if (!response.ok) {
                return null;
            }

            return await response.json();
        } catch (error) {
            console.error('LDAP user fetch failed:', error);
            return null;
        }
    }

    // Get user groups
    async getUserGroups(providerId: string, userDN: string): Promise<LDAPGroup[]> {
        try {
            const response = await fetch(`/api/sso/ldap/groups`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    providerId,
                    userDN
                })
            });

            if (!response.ok) {
                throw new Error('Failed to get user groups');
            }

            return await response.json();
        } catch (error) {
            console.error('LDAP group fetch failed:', error);
            return [];
        }
    }

    // Sync users from LDAP
    async syncUsers(providerId: string, domain?: string): Promise<LDAPUser[]> {
        try {
            const response = await fetch('/api/sso/ldap/sync', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    providerId,
                    domain
                })
            });

            if (!response.ok) {
                throw new Error('Failed to sync LDAP users');
            }

            return await response.json();
        } catch (error) {
            console.error('LDAP user sync failed:', error);
            throw error;
        }
    }

    // Test LDAP connection
    async testConnection(providerId: string): Promise<boolean> {
        try {
            const response = await fetch(`/api/sso/ldap/test/${providerId}`, {
                method: 'POST'
            });

            return response.ok;
        } catch (error) {
            console.error('LDAP connection test failed:', error);
            return false;
        }
    }

    // Update LDAP configuration
    async updateConfig(providerId: string, config: Partial<LDAPConfig>): Promise<void> {
        try {
            const response = await fetch(`/api/sso/ldap/config/${providerId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(config)
            });

            if (!response.ok) {
                throw new Error('Failed to update LDAP configuration');
            }

            // Update local config
            const currentConfig = this.configs.get(providerId);
            if (currentConfig) {
                this.configs.set(providerId, { ...currentConfig, ...config });
            }
        } catch (error) {
            console.error('Failed to update LDAP configuration:', error);
            throw error;
        }
    }

    // Get LDAP configuration
    getConfig(providerId: string): LDAPConfig | undefined {
        return this.configs.get(providerId);
    }

    // Map LDAP user to application user
    mapToApplicationUser(ldapUser: LDAPUser): {
        id: string;
        email: string;
        name: string;
        department?: string;
        role: 'admin' | 'member' | 'viewer';
    } {
        return {
            id: ldapUser.uid || ldapUser.mail,
            email: ldapUser.mail,
            name: ldapUser.givenName ? `${ldapUser.givenName} ${ldapUser.sn}` : ldapUser.cn,
            department: ldapUser.department,
            role: this.mapRole(ldapUser.memberOf)
        };
    }

    // Map LDAP groups to application role
    private mapRole(memberOf: string[]): 'admin' | 'member' | 'viewer' {
        if (!memberOf || memberOf.length === 0) {
            return 'member';
        }

        // Check for admin groups
        const adminGroups = ['administrators', 'admins', 'it-admins', 'system-admins'];
        const hasAdminGroup = memberOf.some(group => 
            adminGroups.some(adminGroup => 
                group.toLowerCase().includes(adminGroup)
            )
        );

        if (hasAdminGroup) {
            return 'admin';
        }

        // Check for viewer groups
        const viewerGroups = ['viewers', 'readonly', 'guests'];
        const hasViewerGroup = memberOf.some(group => 
            viewerGroups.some(viewerGroup => 
                group.toLowerCase().includes(viewerGroup)
            )
        );

        if (hasViewerGroup) {
            return 'viewer';
        }

        return 'member';
    }

    // Get supported LDAP attributes
    getSupportedAttributes(): string[] {
        return [
            'cn', 'sn', 'givenName', 'mail', 'uid', 'memberOf',
            'department', 'title', 'telephoneNumber', 'userAccountControl'
        ];
    }
}

// Export singleton instance
export const ldapService = new LDAPService();
