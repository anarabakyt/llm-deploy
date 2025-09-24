// Экспорт API сервисов
export { apiService, ApiError } from './api';
export type { ApiResponse } from './api';

// Экспорт сервиса авторизации
export { authService } from './authService';

// Экспорт RTK Query API
export { modelsApi } from './modelsApi';
export { chatsApi } from './chatsApi';
export { messagesApi } from './messagesApi';
export { messageApi } from './messageApi';

// Экспорт сервиса сообщений
export { messageService } from './messageService';

// Экспорт сервиса feedback
export { feedbackService } from './feedbackService';
export type { ModelResponseFeedback, FeedbackParams } from './feedbackService';

// Экспорт хуков
export {
  useGetModelsQuery,
  useGetModelByIdQuery,
  useCreateModelMutation,
  useUpdateModelMutation,
  useDeleteModelMutation,
} from './modelsApi';

export {
  useGetChatsQuery,
  useGetChatByIdQuery,
  useCreateChatMutation,
  useUpdateChatMutation,
  useDeleteChatMutation,
  useSendMessageMutation,
  useSendToAllModelsMutation,
  useGetFixedChatMessagesQuery,
} from './chatsApi';

export {
  useSendMessageToModelMutation as useSendMessageToModelApiMutation,
  useSendMessageToFixedModelsMutation as useSendMessageToFixedModelsApiMutation,
} from './messageApi';

export {
  useSendMessageToModelMutation,
  useSendMessageToAllModelsMutation,
  useGetChatMessagesQuery,
  useGetChatMessagesQuery as useGetMessagesQuery,
  useGetFixedChatMessagesQuery as useGetFixedMessagesQuery,
} from './messagesApi';

export {
  useLikeModelResponseMutation,
  useDislikeModelResponseMutation,
  useRemoveModelResponseFeedbackMutation,
  useGetModelResponseFeedbackQuery,
  useGetMessageFeedbackQuery,
} from './feedbackApi';
