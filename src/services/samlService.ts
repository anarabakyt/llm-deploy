import { ssoService } from './ssoService';

interface SAMLConfig {
    entityId: string;
    ssoUrl: string;
    sloUrl?: string;
    certificate: string;
    privateKey?: string;
    metadataUrl?: string;
    nameIdFormat: string;
    attributeMapping: Record<string, string>;
}

interface SAMLAssertion {
    nameId: string;
    attributes: Record<string, string>;
    sessionIndex?: string;
    issuer: string;
    audience: string;
    notBefore: string;
    notOnOrAfter: string;
}

class SAMLService {
    private config: SAMLConfig | null = null;

    // Initialize SAML service
    async initialize(providerId: string): Promise<void> {
        try {
            const provider = ssoService.getProvider(providerId);
            if (!provider || provider.type !== 'saml') {
                throw new Error('Invalid SAML provider');
            }

            // Load SAML configuration
            const response = await fetch(`/api/sso/saml/config/${providerId}`);
            if (response.ok) {
                const contentType = response.headers.get('content-type');
                if (contentType && contentType.includes('application/json')) {
                    this.config = await response.json();
                } else {
                    console.warn('SAML config endpoint returned non-JSON response');
                }
            }
        } catch (error) {
            console.error('Failed to initialize SAML service:', error);
            throw error;
        }
    }

    // Generate SAML authentication request
    async generateAuthRequest(providerId: string, relayState?: string): Promise<string> {
        try {
            const response = await fetch('/api/sso/saml/auth-request', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    providerId,
                    relayState
                })
            });

            if (!response.ok) {
                throw new Error('Failed to generate SAML auth request');
            }

            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
                throw new Error('SAML auth request endpoint returned non-JSON response');
            }

            const data = await response.json();
            return data.authUrl;
        } catch (error) {
            console.error('SAML auth request generation failed:', error);
            throw error;
        }
    }

    // Process SAML response
    async processResponse(providerId: string, samlResponse: string, relayState?: string): Promise<SAMLAssertion> {
        try {
            const response = await fetch('/api/sso/saml/process-response', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    providerId,
                    samlResponse,
                    relayState
                })
            });

            if (!response.ok) {
                throw new Error('Failed to process SAML response');
            }

            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
                throw new Error('SAML response processing endpoint returned non-JSON response');
            }

            return await response.json();
        } catch (error) {
            console.error('SAML response processing failed:', error);
            throw error;
        }
    }

    // Generate SAML logout request
    async generateLogoutRequest(providerId: string, sessionIndex?: string): Promise<string> {
        try {
            const response = await fetch('/api/sso/saml/logout-request', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    providerId,
                    sessionIndex
                })
            });

            if (!response.ok) {
                throw new Error('Failed to generate SAML logout request');
            }

            const data = await response.json();
            return data.logoutUrl;
        } catch (error) {
            console.error('SAML logout request generation failed:', error);
            throw error;
        }
    }

    // Validate SAML assertion
    validateAssertion(assertion: SAMLAssertion): boolean {
        if (!this.config) {
            return false;
        }

        const now = new Date();
        const notBefore = new Date(assertion.notBefore);
        const notOnOrAfter = new Date(assertion.notOnOrAfter);

        // Check time validity
        if (now < notBefore || now > notOnOrAfter) {
            return false;
        }

        // Check audience
        if (assertion.audience !== this.config.entityId) {
            return false;
        }

        // Check issuer
        if (assertion.issuer !== this.config.entityId) {
            return false;
        }

        return true;
    }

    // Extract user information from SAML assertion
    extractUserInfo(assertion: SAMLAssertion): {
        id: string;
        email: string;
        name: string;
        department?: string;
        role: 'admin' | 'member' | 'viewer';
    } {
        const attributes = assertion.attributes;
        
        return {
            id: assertion.nameId,
            email: attributes.email || attributes['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'] || '',
            name: attributes.name || attributes['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'] || '',
            department: attributes.department || attributes['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/department'],
            role: this.mapRole(attributes.role || attributes['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/role'])
        };
    }

    // Map SAML role to application role
    private mapRole(samlRole?: string): 'admin' | 'member' | 'viewer' {
        if (!samlRole) return 'member';
        
        const role = samlRole.toLowerCase();
        if (role.includes('admin') || role.includes('administrator')) {
            return 'admin';
        } else if (role.includes('viewer') || role.includes('readonly')) {
            return 'viewer';
        } else {
            return 'member';
        }
    }

    // Get SAML metadata
    async getMetadata(providerId: string): Promise<string> {
        try {
            const response = await fetch(`/api/sso/saml/metadata/${providerId}`);
            
            if (!response.ok) {
                throw new Error('Failed to get SAML metadata');
            }

            return await response.text();
        } catch (error) {
            console.error('Failed to get SAML metadata:', error);
            throw error;
        }
    }

    // Update SAML configuration
    async updateConfig(providerId: string, config: Partial<SAMLConfig>): Promise<void> {
        try {
            const response = await fetch(`/api/sso/saml/config/${providerId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(config)
            });

            if (!response.ok) {
                throw new Error('Failed to update SAML configuration');
            }
        } catch (error) {
            console.error('Failed to update SAML configuration:', error);
            throw error;
        }
    }
}

// Export singleton instance
export const samlService = new SAMLService();
