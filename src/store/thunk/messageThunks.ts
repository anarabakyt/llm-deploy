import {createAsyncThunk} from "@reduxjs/toolkit";
import {addChat, updateChatFromLocalId} from "../slice/chatSlice";
import {addMessage, updateMessagesChatIdFromLocalId,} from "../slice/messageSlice";
import {addLog, updateUserRating} from "../slice/loggingSlice";
import {updateModelScore, selectBestModel} from "../slice/modelSlice";
import type {Chat, Message} from "../../entities";
import type {RootState} from "../../config/store.ts";
import {ChatService} from "../../services/createChatService.ts";
import {MessageService} from "../../services/messageService.ts";
import {LLMLoggingService} from "../../services/llmLoggingService.ts";
import {ModelScoringService} from "../../services/modelScoringService.ts";
import {TokenEstimationService} from "../../services/tokenEstimationService.ts";

export const sendMessageThunk = createAsyncThunk<
    void,
    { messageText: string, isNewChat: boolean, newChat: Chat | null },
    { state: RootState }
>("messages/sendMessageThunk", async ({messageText, isNewChat, newChat}, {dispatch, getState}) => {
    const state = getState();

    const selectedChatId = state.chats.selectedChatId;
    const selectedChatLocalId = state.chats.selectedChatLocalId;
    const selectedModelId = state.models.selectedModelId;
    const selectedModelUrl = state.models.selectedModelUrl;

    console.log('==> messageThunk-handleSendMessage: selectedChatId: ', selectedChatId);
    console.log('==> messageThunk-handleSendMessage: selectedLocalChatId: ', selectedChatLocalId);
    console.log('==> messageThunk-handleSendMessage: selectedModelId: ', selectedModelId);
    console.log('==> messageThunk-handleSendMessage: selectedModelUrl: ', selectedModelUrl);

    if (!messageText.trim() || !selectedModelId || !selectedModelUrl) {
        console.log('==> messageThunk-handleSendMessage: return');
        return;
    }

    const userMessage: Message = {
        id: null,
        chatId: selectedChatId,
        chatLocalId: selectedChatLocalId,
        author: "user",
        content: messageText,
        createdAt: new Date().toISOString(),
    };

    dispatch(addMessage(userMessage));

    let finalChatId = selectedChatId;
    let finalLocalId = selectedChatLocalId;

    if (isNewChat && newChat) {
        try {
            dispatch(addChat(newChat));
            const createdChat = await ChatService.createChat(newChat.modelId, newChat.name);
            console.log('==> messageThunk-handleSendMessage: createdChat: ', createdChat);
            dispatch(updateChatFromLocalId({
                localId: finalLocalId,
                chat: createdChat
            }));
            dispatch(updateMessagesChatIdFromLocalId({
                localId: finalLocalId,
                newChatId: createdChat.id!
            }));

            console.log('==> messageThunk-handleSendMessage: createdChat.id', createdChat.id);
            finalChatId = createdChat.id;
        } catch (err) {
            console.error("Ошибка при создании чата:", err);
            return;
        }
    }

    try {
        const response = await MessageService.sendMessageToModels({
            modelUrl: selectedModelUrl,
            chatId: finalChatId!,
            content: messageText,
        });

        console.log('==> messageThunk-handleSendMessage: response: ', response);

        dispatch(addMessage({...response, chatLocalId: finalLocalId}));

        // Update model scores based on responses
        if (response.modelResponses && response.modelResponses.length > 0) {
            for (const modelResponse of response.modelResponses) {
                const score = ModelScoringService.calculateModelScore(modelResponse);
                dispatch(updateModelScore({
                    modelId: modelResponse.modelName,
                    quality: score.quality,
                    tokenEfficiency: score.tokenEfficiency,
                    responseTime: score.responseTime
                }));
            }
        }

        // If auto-selection is enabled, select the best model for next time
        const currentState = getState();
        if (currentState.models.autoSelectionMode !== 'manual') {
            dispatch(selectBestModel());
        }

        // Логирование запроса к LLM
        if (state.user.currentUser && response.modelResponses && response.modelResponses.length > 0) {
            const modelResponse = response.modelResponses[0]; // Логируем только первый ответ
            const log = LLMLoggingService.logRequest({
                userId: state.user.currentUser.id,
                userName: state.user.currentUser.name,
                userEmail: state.user.currentUser.email,
                userAvatar: state.user.currentUser.avatarUrl,
                prompt: messageText,
                response: modelResponse,
                modelName: modelResponse.modelName,
                chatId: finalChatId!,
            });
            // Добавляем лог в Redux store
            dispatch(addLog(log));
        }

        console.log('==> messageThunk-handleSendMessage: end of function');
        console.log('==> messageThunk-handleSendMessage: state.chats.selectedChatId: ', state.chats.selectedChatId);
    } catch (err) {
        console.error("Ошибка при отправке сообщения моделям:", err);
    }
});


// Thunk для обновления пользовательской оценки ответа LLM
export const updateLLMResponseRatingThunk = createAsyncThunk<
    void,
    { logId: string; rating: 'like' | 'dislike' | null },
    { state: RootState }
>("messages/updateLLMResponseRatingThunk", async ({ logId, rating }, { dispatch }) => {
    try {
        // Обновляем оценку в сервисе логирования
        LLMLoggingService.updateUserRating(logId, rating);
        
        // Обновляем Redux store
        dispatch(updateUserRating({ logId, rating }));
        
        console.log(`==> updateLLMResponseRatingThunk: Updated rating for log ${logId} to ${rating}`);
    } catch (err) {
        console.error("Ошибка при обновлении оценки ответа LLM:", err);
        throw err;
    }
});

export const sendMessageWithContextTransferThunk = createAsyncThunk<
    void,
    { 
        messageText: string, 
        isNewChat: boolean, 
        newChat: Chat | null,
        contextMessages: Message[],
        targetModelId: string
    },
    { state: RootState }
>("messages/sendMessageWithContextTransferThunk", async ({
    messageText, 
    isNewChat, 
    newChat, 
    contextMessages, 
    targetModelId
}, {dispatch, getState}) => {
    const state = getState();
    
    // Find the target model
    const targetModel = state.models.models.find(m => m.id === targetModelId);
    if (!targetModel) {
        console.error("Target model not found:", targetModelId);
        return;
    }

    const selectedChatId = state.chats.selectedChatId;
    const selectedChatLocalId = state.chats.selectedChatLocalId;

    console.log('==> sendMessageWithContextTransferThunk: targetModelId: ', targetModelId);
    console.log('==> sendMessageWithContextTransferThunk: contextMessages.length: ', contextMessages.length);

    // Estimate token usage for context transfer
    const tokenEstimation = TokenEstimationService.estimateContextTokens(contextMessages);
    console.log('==> sendMessageWithContextTransferThunk: tokenEstimation: ', tokenEstimation);

    // Check if context is too large and suggest truncation
    const truncationSuggestion = TokenEstimationService.suggestTruncationStrategy(contextMessages);
    if (truncationSuggestion.shouldTruncate) {
        console.warn('Context may be too large, suggesting truncation:', truncationSuggestion);
    }

    // Create user message
    const userMessage: Message = {
        id: null,
        chatId: selectedChatId,
        chatLocalId: selectedChatLocalId,
        author: "user",
        content: messageText,
        createdAt: new Date().toISOString(),
    };

    dispatch(addMessage(userMessage));

    let finalChatId = selectedChatId;
    let finalLocalId = selectedChatLocalId;

    if (isNewChat && newChat) {
        try {
            dispatch(addChat(newChat));
            const createdChat = await ChatService.createChat(newChat.modelId, newChat.name);
            dispatch(updateChatFromLocalId({
                localId: finalLocalId,
                chat: createdChat
            }));
            dispatch(updateMessagesChatIdFromLocalId({
                localId: finalLocalId,
                newChatId: createdChat.id!
            }));
            finalChatId = createdChat.id;
        } catch (err) {
            console.error("Ошибка при создании чата:", err);
            return;
        }
    }

    try {
        // Send message with context to the target model
        const response = await MessageService.sendMessageToModels({
            modelUrl: targetModel.modelUrl,
            chatId: finalChatId!,
            content: messageText,
        });

        console.log('==> sendMessageWithContextTransferThunk: response: ', response);

        dispatch(addMessage({...response, chatLocalId: finalLocalId}));

        // Update model scores
        if (response.modelResponses && response.modelResponses.length > 0) {
            for (const modelResponse of response.modelResponses) {
                const score = ModelScoringService.calculateModelScore(modelResponse);
                dispatch(updateModelScore({
                    modelId: modelResponse.modelName,
                    quality: score.quality,
                    tokenEfficiency: score.tokenEfficiency,
                    responseTime: score.responseTime
                }));
            }
        }

        console.log('==> sendMessageWithContextTransferThunk: Context transfer completed');
    } catch (err) {
        console.error("Ошибка при отправке сообщения с передачей контекста:", err);
    }
});

