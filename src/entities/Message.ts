import type {ModelResponse} from './ModelResponse';

export type MessageAuthor = 'user' | 'model' | 'assistant';

export interface Message {
    id: string | null;
    chatId: string | null;
    chatLocalId: string | null;
    author: MessageAuthor;
    content: string;
    modelResponses?: ModelResponse[];
    createdAt: string;
}
