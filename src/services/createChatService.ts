import type {Chat} from "../entities";

const BASE_URL =
    "https://denisplus8soft.app.n8n.cloud/webhook/86dbcf57-9d9a-4b5a-98c9-bf37fad2e479";

export class ChatService {
    static async createChat(modelId: string): Promise<Chat> {
        const token = localStorage.getItem("authToken");

        const response = await fetch(`${BASE_URL}/chats`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                ...(token ? {Authorization: `Bearer ${token}`} : {}),
            },
            body: JSON.stringify({modelId}),
        });

        if (!response.ok) {
            throw new Error(`Ошибка при создании чата: ${response.statusText}`);
        }

        const data = await response.json();

        return {
            id: data.id,
            modelId: data.model_id,
            localId: null,
            createdAt: data.created_at,
        };
    }
}
