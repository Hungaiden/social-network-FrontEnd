import http from './http';

// Types
export interface Friend {
  userId: string;
  displayName: string;
  avatar: string | null;
}

export interface FriendsResponse {
  code: number;
  message: string;
  result: {
    content: Friend[];
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
    last: boolean;
  };
}

export interface PageableParams {
  page?: number;
  size?: number;
  sort?: string;
}

export interface FriendRequest {
  requestId: string;
  senderId: string;
  senderDisplayName: string;
  receiverId: string;
  receiverDisplayName: string;
  status: string;
  message: string;
  created_at: string;
}

export interface FriendRequestsResponse {
  code: number;
  message: string;
  result: FriendRequest[];
}

export interface RespondFriendRequest {
  requestId: string;
  receiverId: string;
  action: 'ACCEPT' | 'REJECT';
}

export interface FriendRequestResponse {
  code: number;
  message: string;
  result: FriendRequest;
}

// Service functions
export const friendService = {
  /**
   * Get list of user's friends with pagination
   * @param params Pageable parameters (page, size, sort)
   * @returns List of friends with pagination info
   */
  getMyFriends: async (params: PageableParams = {}): Promise<FriendsResponse> => {
    try {
      const { page = 0, size = 20, sort } = params;
      const queryParams = new URLSearchParams({
        page: page.toString(),
        size: size.toString(),
        ...(sort && { sort }),
      });

      const response = await http.get<FriendsResponse>(`/friends/myFriend?${queryParams}`);
      return response.data;
    } catch (error: any) {
      console.error('Error fetching friends:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch friends');
    }
  },

  /**
   * Get list of user's friend requests
   * @returns List of friend requests
   */
  getMyFriendRequests: async (): Promise<FriendRequestsResponse> => {
    try {
      const response = await http.get<FriendRequestsResponse>(`/friend-request/myFriendRequest`);
      return response.data;
    } catch (error: any) {
      console.error('Error fetching friend requests:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch friend requests');
    }
  },

  /**
   * Respond to a friend request (accept or reject)
   * @param request Request data containing requestId, receiverId, and action
   * @returns Updated friend request
   */
  respondFriendRequest: async (request: RespondFriendRequest): Promise<FriendRequestResponse> => {
    try {
      const response = await http.post<FriendRequestResponse>(`/friend-request/response`, request);
      return response.data;
    } catch (error: any) {
      console.error('Error responding to friend request:', error);
      throw new Error(error.response?.data?.message || 'Failed to respond to friend request');
    }
  },
};

export default friendService;
