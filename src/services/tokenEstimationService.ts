import type {Message} from '../entities';

export interface TokenEstimation {
    totalTokens: number;
    contextTokens: number;
    messageTokens: number;
    breakdown: {
        userMessages: number;
        modelResponses: number;
        systemTokens: number;
    };
}

export class TokenEstimationService {
    /**
     * Rough estimation: 1 token ≈ 4 characters for English text
     * This is a simplified approximation - real tokenization varies by model
     */
    private static readonly CHARS_PER_TOKEN = 4;
    
    /**
     * Estimate tokens for a single text
     */
    static estimateTokens(text: string): number {
        // Basic estimation based on character count
        const baseTokens = Math.ceil(text.length / this.CHARS_PER_TOKEN);
        
        // Add some overhead for special tokens, encoding, etc.
        const overhead = Math.ceil(baseTokens * 0.1);
        
        return baseTokens + overhead;
    }
    
    /**
     * Estimate tokens for a message
     */
    static estimateMessageTokens(message: Message): number {
        let tokens = this.estimateTokens(message.content);
        
        // Add tokens for model responses if present
        if (message.modelResponses && message.modelResponses.length > 0) {
            for (const response of message.modelResponses) {
                tokens += this.estimateTokens(response.content);
            }
        }
        
        return tokens;
    }
    
    /**
     * Estimate total tokens for context transfer
     */
    static estimateContextTokens(messages: Message[], includeSystemPrompt: boolean = true): TokenEstimation {
        let userMessages = 0;
        let modelResponses = 0;
        let systemTokens = 0;
        
        // System prompt tokens (estimated)
        if (includeSystemPrompt) {
            systemTokens = 50; // Rough estimate for system prompt
        }
        
        // Calculate tokens for each message
        for (const message of messages) {
            const messageTokens = this.estimateTokens(message.content);
            
            if (message.author === 'user') {
                userMessages += messageTokens;
            } else {
                modelResponses += messageTokens;
            }
            
            // Add tokens for model responses
            if (message.modelResponses && message.modelResponses.length > 0) {
                for (const response of message.modelResponses) {
                    modelResponses += this.estimateTokens(response.content);
                }
            }
        }
        
        const contextTokens = userMessages + modelResponses + systemTokens;
        const messageTokens = 0; // This would be for the new message
        
        return {
            totalTokens: contextTokens + messageTokens,
            contextTokens,
            messageTokens,
            breakdown: {
                userMessages,
                modelResponses,
                systemTokens
            }
        };
    }
    
    /**
     * Format token count for display
     */
    static formatTokenCount(tokens: number): string {
        if (tokens < 1000) {
            return `${tokens} tokens`;
        } else if (tokens < 1000000) {
            return `${(tokens / 1000).toFixed(1)}K tokens`;
        } else {
            return `${(tokens / 1000000).toFixed(1)}M tokens`;
        }
    }
    
    /**
     * Check if context would exceed typical limits
     */
    static isContextTooLarge(tokens: number, maxTokens: number = 32000): boolean {
        return tokens > maxTokens;
    }
    
    /**
     * Suggest context truncation strategy
     */
    static suggestTruncationStrategy(messages: Message[], maxTokens: number = 32000): {
        shouldTruncate: boolean;
        keepRecentMessages: number;
        estimatedTokensAfterTruncation: number;
    } {
        const totalEstimation = this.estimateContextTokens(messages);
        
        if (totalEstimation.totalTokens <= maxTokens) {
            return {
                shouldTruncate: false,
                keepRecentMessages: messages.length,
                estimatedTokensAfterTruncation: totalEstimation.totalTokens
            };
        }
        
        // Try to keep recent messages
        let keepRecentMessages = messages.length;
        let estimatedTokens = totalEstimation.totalTokens;
        
        while (estimatedTokens > maxTokens && keepRecentMessages > 1) {
            keepRecentMessages--;
            const recentMessages = messages.slice(-keepRecentMessages);
            estimatedTokens = this.estimateContextTokens(recentMessages).totalTokens;
        }
        
        return {
            shouldTruncate: true,
            keepRecentMessages: Math.max(1, keepRecentMessages),
            estimatedTokensAfterTruncation: estimatedTokens
        };
    }
}

