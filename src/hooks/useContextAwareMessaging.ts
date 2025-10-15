import { useState, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../config/hooks';
import { selectMessagesByChat } from '../store/selector/selectors';
import { sendMessageThunk } from '../store/thunk/messageThunks';
import { ContextService } from '../services/contextService';
import type { Chat } from '../entities';

export const useContextAwareMessaging = () => {
    const dispatch = useAppDispatch();
    const messages = useAppSelector(selectMessagesByChat);
    
    const [isContextSelectorVisible, setIsContextSelectorVisible] = useState(false);
    const [pendingPrompt, setPendingPrompt] = useState<string>('');

    const sendMessage = useCallback(async (
        messageText: string,
        isNewChat: boolean,
        newChat: Chat | null,
        contextMode: 'next-only' | 'entire-conversation' = 'next-only'
    ) => {
        if (contextMode === 'entire-conversation') {
            // Prepare message with full context
            const preparedMessage = ContextService.prepareMessageForSending(
                messages,
                messageText,
                'entire-conversation'
            );
            
            // Log context information
            console.log('Sending message with full context:', {
                originalPrompt: messageText,
                contextLength: preparedMessage.contextInfo?.messageCount || 0,
                tokenCount: preparedMessage.contextInfo?.tokenCount || 0,
                estimatedCost: preparedMessage.contextInfo?.estimatedCost || 0
            });
            
            // Send the prepared message
            dispatch(sendMessageThunk({
                messageText: preparedMessage.content,
                isNewChat,
                newChat
            }));
        } else {
            // Send only the current prompt
            dispatch(sendMessageThunk({
                messageText,
                isNewChat,
                newChat
            }));
        }
    }, [dispatch, messages]);

    const showContextSelector = useCallback((prompt: string) => {
        setPendingPrompt(prompt);
        setIsContextSelectorVisible(true);
    }, []);

    const hideContextSelector = useCallback(() => {
        setIsContextSelectorVisible(false);
        setPendingPrompt('');
    }, []);

    const handleModelSwitch = useCallback((
        modelId: string,
        mode: 'next-only' | 'entire-conversation'
    ) => {
        // This would be called when user confirms model switch
        // The actual implementation would depend on your chat creation logic
        console.log('Model switched:', { modelId, mode, prompt: pendingPrompt });
        
        // Here you would typically:
        // 1. Update the selected model
        // 2. Send the message with the appropriate context mode
        // 3. Close the selector
        
        hideContextSelector();
    }, [pendingPrompt, hideContextSelector]);

    const getTokenEstimation = useCallback((
        prompt: string,
        mode: 'next-only' | 'entire-conversation'
    ) => {
        return ContextService.calculateTokenUsage(messages, prompt, mode);
    }, [messages]);

    return {
        sendMessage,
        showContextSelector,
        hideContextSelector,
        handleModelSwitch,
        getTokenEstimation,
        isContextSelectorVisible,
        pendingPrompt
    };
};
