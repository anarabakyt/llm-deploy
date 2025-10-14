import {createAsyncThunk} from "@reduxjs/toolkit";
import {addChat, updateChatFromLocalId} from "../slice/chatSlice";
import {addMessage, updateMessagesChatIdFromLocalId,} from "../slice/messageSlice";
import {addLog, updateUserRating} from "../slice/loggingSlice";
import type {Chat, Message} from "../../entities";
import type {RootState} from "../../config/store.ts";
import {ChatService} from "../../services/createChatService.ts";
import {MessageService} from "../../services/messageService.ts";
import {LLMLoggingService} from "../../services/llmLoggingService.ts";

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