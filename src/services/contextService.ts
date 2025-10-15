import type { Message } from '../entities';
import { TokenEstimationService } from './tokenEstimationService';

export interface ConversationContext {
    messages: Message[];
    totalTokens: number;
    estimatedCost: number;
    contextString: string;
}

export class ContextService {
    /**
     * Collects conversation context for LLM switching
     */
    static collectConversationContext(messages: Message[], currentPrompt: string): ConversationContext {
        // Filter out user messages and get all previous conversation
        const conversationMessages = messages.filter(msg => msg.author === 'user' || msg.author === 'model');
        
        // Create context string with conversation history
        const contextString = this.formatContextString(conversationMessages, currentPrompt);
        
        // Calculate token count
        const totalTokens = TokenEstimationService.estimateTokens(contextString);
        
        // Estimate cost (rough calculation: $0.002 per 1K tokens)
        const estimatedCost = (totalTokens / 1000) * 0.002;
        
        return {
            messages: conversationMessages,
            totalTokens,
            estimatedCost,
            contextString
        };
    }

    /**
     * Formats conversation history into a string for LLM consumption
     */
    private static formatContextString(messages: Message[], currentPrompt: string): string {
        let context = "Previous conversation:\n\n";
        
        messages.forEach((message, index) => {
            const role = message.author === 'user' ? 'User' : 'Assistant';
            context += `${role}: ${message.content}\n`;
            
            // Add model responses if available
            if (message.modelResponses && message.modelResponses.length > 0) {
                message.modelResponses.forEach(response => {
                    context += `[${response.modelName}]: ${response.content}\n`;
                });
            }
            context += '\n';
        });
        
        context += `Current prompt: ${currentPrompt}`;
        
        return context;
    }

    /**
     * Calculates token usage for different context modes
     */
    static calculateTokenUsage(
        messages: Message[], 
        currentPrompt: string, 
        mode: 'next-only' | 'entire-conversation'
    ): { tokens: number; cost: number; contextLength: number } {
        if (mode === 'next-only') {
            const tokens = TokenEstimationService.estimateTokens(currentPrompt);
            const cost = (tokens / 1000) * 0.002;
            return { tokens, cost, contextLength: 1 };
        } else {
            const context = this.collectConversationContext(messages, currentPrompt);
            return {
                tokens: context.totalTokens,
                cost: context.estimatedCost,
                contextLength: context.messages.length
            };
        }
    }

    /**
     * Prepares message for sending based on context mode
     */
    static prepareMessageForSending(
        messages: Message[],
        currentPrompt: string,
        mode: 'next-only' | 'entire-conversation'
    ): { content: string; contextInfo?: any } {
        if (mode === 'next-only') {
            return { content: currentPrompt };
        } else {
            const context = this.collectConversationContext(messages, currentPrompt);
            return {
                content: context.contextString,
                contextInfo: {
                    messageCount: context.messages.length,
                    tokenCount: context.totalTokens,
                    estimatedCost: context.estimatedCost
                }
            };
        }
    }
}
