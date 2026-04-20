import http from './http';

// Types
export interface CreateGroupChatRequest {
  name: string;
  memberIds: string[];
}

export interface CreateGroupChatResponse {
  id: string;
  name: string;
  memberIds: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Conversation {
  id: string;
  name: string;
  type: 'direct' | 'group';
  members: Array<{
    id: string;
    name: string;
    avatar: string;
  }>;
  lastMessage?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PrivateConversation {
  id: string;
  name: string;
  lastMessageContent: string;
  lastMessageTime: string;
}

export interface PrivateConversationsResponse {
  code: number;
  message: string;
  result: {
    content: PrivateConversation[];
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
    last: boolean;
  };
}

export interface ApiMessage {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  content: string;
  createdAt: string;
}

export interface MessagesResponse {
  code: number;
  message: string;
  result: {
    content: ApiMessage[];
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
    last: boolean;
  };
}

export interface SendMessageRequest {
  conversationId: string;
  senderId: string;
  content: string;
}

export interface MessageResponseDTO {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  content: string;
  createdAt: string;
}

export interface SendMessageResponse {
  code: number;
  message: string;
  result: MessageResponseDTO;
}

// Service functions
export const conversationService = {
  /**
   * Create a new group chat
   * @param data Group chat data with name and member IDs
   * @returns Created group chat information
   */
  createGroupChat: async (data: CreateGroupChatRequest): Promise<CreateGroupChatResponse> => {
    try {
      const response = await http.post<CreateGroupChatResponse>('/conversation/group', data);
      return response.data;
    } catch (error: any) {
      console.error('Error creating group chat:', error);
      throw new Error(error.response?.data?.message || 'Failed to create group chat');
    }
  },

  /**
   * Get all private conversations for current user
   * @returns List of private conversations with pagination
   */
  getPrivateConversations: async (): Promise<PrivateConversationsResponse> => {
    try {
      const response = await http.get<PrivateConversationsResponse>(
        '/conversation/by-user/private',
      );
      return response.data;
    } catch (error: any) {
      console.error('Error fetching private conversations:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch private conversations');
    }
  },

  /**
   * Get all conversations for current user
   * @returns List of conversations
   */
  getConversations: async (): Promise<Conversation[]> => {
    try {
      const response = await http.get<Conversation[]>('/conversation');
      return response.data;
    } catch (error: any) {
      console.error('Error fetching conversations:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch conversations');
    }
  },

  /**
   * Get conversation by ID
   * @param id Conversation ID
   * @returns Conversation details
   */
  getConversationById: async (id: string): Promise<Conversation> => {
    try {
      const response = await http.get<Conversation>(`/conversation/${id}`);
      return response.data;
    } catch (error: any) {
      console.error('Error fetching conversation:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch conversation');
    }
  },

  /**
   * Delete conversation
   * @param id Conversation ID
   */
  deleteConversation: async (id: string): Promise<void> => {
    try {
      await http.delete(`/conversation/${id}`);
    } catch (error: any) {
      console.error('Error deleting conversation:', error);
      throw new Error(error.response?.data?.message || 'Failed to delete conversation');
    }
  },

  /**
   * Get all messages for a conversation
   * @param conversationId Conversation ID
   * @returns List of messages with pagination
   */
  getMessagesByConversation: async (conversationId: string): Promise<MessagesResponse> => {
    try {
      const response = await http.get<MessagesResponse>(`/message/${conversationId}`);
      return response.data;
    } catch (error: any) {
      console.error('Error fetching messages:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch messages');
    }
  },

  /**
   * Send a message to a conversation
   * @param data Message data with conversationId, senderId, and content
   * @returns Sent message information
   */
  sendMessage: async (data: SendMessageRequest): Promise<SendMessageResponse> => {
    try {
      console.log('Sending message with data:', data);
      const response = await http.post<SendMessageResponse>('/message/send', data);
      console.log('Message sent successfully:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Error sending message:', error);
      console.error('Error response:', error.response?.data);
      throw new Error(error.response?.data?.message || 'Failed to send message');
    }
  },
};

export default conversationService;
