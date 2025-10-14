 import type {ModelResponse} from '../entities';

export interface ModelScore {
    quality: number;
    tokenEfficiency: number;
    responseTime: number;
}

export class ModelScoringService {
    /**
     * Calculate quality score based on response characteristics
     * Higher score = better quality
     */
    static calculateQualityScore(response: ModelResponse): number {
        let score = 0;
        
        // Length factor (not too short, not too long)
        const contentLength = response.content.length;
        if (contentLength > 50 && contentLength < 2000) {
            score += 0.3;
        } else if (contentLength >= 2000) {
            score += 0.2; // Slightly lower for very long responses
        }
        
        // Structure factor (presence of paragraphs, lists, etc.)
        const hasParagraphs = response.content.includes('\n\n');
        const hasLists = response.content.includes('\n-') || response.content.includes('\n*') || response.content.includes('\n1.');
        const hasQuestions = response.content.includes('?');
        
        if (hasParagraphs) score += 0.2;
        if (hasLists) score += 0.15;
        if (hasQuestions) score += 0.1;
        
        // Completeness factor (presence of common response patterns)
        const hasExplanation = response.content.toLowerCase().includes('because') || 
                              response.content.toLowerCase().includes('therefore') ||
                              response.content.toLowerCase().includes('however');
        const hasExamples = response.content.toLowerCase().includes('for example') ||
                           response.content.toLowerCase().includes('such as');
        
        if (hasExplanation) score += 0.15;
        if (hasExamples) score += 0.1;
        
        // Clarity factor (avoiding excessive repetition)
        const words = response.content.toLowerCase().split(/\s+/);
        const uniqueWords = new Set(words);
        const repetitionRatio = uniqueWords.size / words.length;
        score += repetitionRatio * 0.1;
        
        return Math.min(1, Math.max(0, score));
    }
    
    /**
     * Calculate token efficiency score
     * Higher score = more efficient (better content per token)
     */
    static calculateTokenEfficiencyScore(response: ModelResponse): number {
        // Estimate tokens (rough approximation: 1 token ≈ 4 characters)
        const estimatedTokens = Math.ceil(response.content.length / 4);
        
        // Calculate content density (meaningful content per token)
        const meaningfulWords = response.content
            .toLowerCase()
            .split(/\s+/)
            .filter(word => word.length > 3 && !this.isStopWord(word));
        
        const contentDensity = meaningfulWords.length / estimatedTokens;
        
        // Factor in response time (faster responses are more efficient)
        const timeEfficiency = Math.max(0, 1 - (response.responseTime / 10000)); // Normalize to 10s max
        
        return Math.min(1, contentDensity * 0.7 + timeEfficiency * 0.3);
    }
    
    /**
     * Calculate overall score for a model response
     */
    static calculateModelScore(response: ModelResponse): ModelScore {
        return {
            quality: this.calculateQualityScore(response),
            tokenEfficiency: this.calculateTokenEfficiencyScore(response),
            responseTime: response.responseTime
        };
    }
    
    /**
     * Check if a word is a common stop word
     */
    private static isStopWord(word: string): boolean {
        const stopWords = new Set([
            'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by',
            'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did',
            'will', 'would', 'could', 'should', 'may', 'might', 'must', 'can', 'this', 'that', 'these', 'those'
        ]);
        return stopWords.has(word);
    }
    
    /**
     * Find the best model based on responses
     */
    static findBestModel(responses: ModelResponse[], mode: 'best_quality' | 'token_efficient'): string | null {
        if (responses.length === 0) return null;
        
        let bestModelId: string | null = null;
        let bestScore = -1;
        
        for (const response of responses) {
            const score = this.calculateModelScore(response);
            let currentScore = 0;
            
            if (mode === 'best_quality') {
                currentScore = score.quality;
            } else if (mode === 'token_efficient') {
                currentScore = score.tokenEfficiency;
            }
            
            if (currentScore > bestScore) {
                bestScore = currentScore;
                bestModelId = response.modelName;
            }
        }
        
        return bestModelId;
    }
}

