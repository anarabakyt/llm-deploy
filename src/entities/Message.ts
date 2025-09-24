import type { ModelResponse } from './ModelResponse';

export type MessageAuthor = 'user' | 'model';

export interface Message {
  id: string | null;
  chatId: string;
  author: MessageAuthor;
  content: string;
  modelResponses?: ModelResponse[];
  createdAt: string;
}
