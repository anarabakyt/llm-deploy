import type {Message, ModelResponse} from '../entities';

export class MessageService {
    private static getAuthHeaders(): Headers {
        const headers = new Headers();
        const token = localStorage.getItem("authToken");
        if (token) {
            headers.set("Authorization", `Bearer ${token}`);
        }
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
            method: "GET",
            headers: this.getAuthHeaders(),
            body: JSON.stringify({content}),
        });

        if (!response.ok) {
            throw new Error(`Ошибка при отправке сообщения: ${response.statusText}`);
        }

        const data = await response.json();

        const base = data.message_with_responses;

        return {
            id: base.id,
            chatId: String(base.chat_id),
            chatLocalId: null,
            author: base.author,
            content: base.content,
            createdAt: base.created_at,
            modelResponses: Array.isArray(base.model_responses)
                ? base.model_responses.map(
                    (mr: any): ModelResponse => ({
                        id: mr.id,
                        messageId: mr.message_id,
                        modelName: mr.model_name,
                        content: mr.content,
                        responseTime: mr.response_time,
                        createdAt: mr.created_at,
                    })
                )
                : [],
        };
    }
}
