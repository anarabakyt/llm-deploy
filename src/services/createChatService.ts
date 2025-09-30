import type {Chat} from "../entities";

export class ChatService {
    static async createChat(modelId: string, name: string): Promise<Chat> {
        const token = localStorage.getItem("authToken");

        const response = await fetch(`/api/webhook/chats`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                ...(token ? {Authorization: `Bearer ${token}`} : {}),
            },
            body: JSON.stringify({modelId, name}),
        });

        if (!response.ok) {
            throw new Error(`Ошибка при создании чата: ${response.statusText}`);
        }

        const data = await response.json();

        return {
            id: data.id,
            modelId: data.model_id,
            localId: null,
            name: data.name,
            createdAt: data.created_at,
        };
    }
}
