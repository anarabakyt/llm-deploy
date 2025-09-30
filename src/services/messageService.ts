import type {Message, ModelResponse} from "../entities";

export class MessageService {
    private static getAuthHeaders(): Headers {
        const headers = new Headers();
        const token = localStorage.getItem("authToken");
        if (token) {
            headers.set("Authorization", `Bearer ${token}`);
        }
        headers.set("Content-Type", "application/json");
        return headers;
    }

    static async sendMessageToModels({
                                         modelUrl,
                                         chatId,
                                         content,
                                     }: {
        modelUrl: string;
        chatId: string;
        content: string;
    }): Promise<Message> {
        const url = `${modelUrl}/${chatId}`;

        const response = await fetch(url, {
            method: "POST",
            headers: this.getAuthHeaders(),
            body: JSON.stringify({ content }),
        });

        if (!response.ok) {
            throw new Error(`Ошибка при отправке сообщения: ${response.statusText}`);
        }

        const data = await response.json();

        // если есть обертка message_with_responses, то берем её, такая обертка есть при ответе всех моделей разом
        const base = data.message_with_responses ?? data;

        return {
            id: String(base.id),
            chatId: String(base.chat_id),
            chatLocalId: null,
            author: base.author,
            content: base.content,
            createdAt: base.created_at,
            modelResponses: Array.isArray(base.model_responses)
                ? base.model_responses.map(
                    (mr: any): ModelResponse => ({
                        id: String(mr.id),
                        messageId: String(mr.message_id),
                        modelName: mr.model_name,
                        content: mr.content,
                        responseTime: mr.response_time,
                        createdAt: mr.created_at,
                    })
                )
                : [],
        };
    }

    static async getChatMessages(chatId: string): Promise<Message[]> {
        const url = `/api/webhook/86dbcf57-9d9a-4b5a-98c9-bf37fad2e479/messages/${chatId}`;

        const response = await fetch(url, {
            method: "GET",
            headers: this.getAuthHeaders(),
        });

        if (!response.ok) {
            throw new Error(`Ошибка загрузки сообщений: ${response.statusText}`);
        }

        const data = await response.json();

        return (
            data?.messages
            ?.filter((m: any) => m?.message_with_responses)
            .map(({message_with_responses: base}: any) => ({
                id: base.id,
                chatId: String(base.chat_id),
                chatLocalId: null,
                author: base.author,
                content: base.content,
                createdAt: base.created_at,
                modelResponses: base.model_responses?.map(
                    ({
                         id,
                         message_id,
                         model_name,
                         content,
                         response_time,
                         created_at,
                     }: any): ModelResponse => ({
                        id,
                        messageId: message_id,
                        modelName: model_name,
                        content,
                        responseTime: response_time,
                        createdAt: created_at,
                    })
                ) ?? [],
            })) ?? []
        );
    }
}
