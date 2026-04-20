import http from './http';

// Types
export interface CreatePostRequest {
  title: string;
  content: string;
}

export interface Post {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string | null;
  ownerId: string;
  ownerUsername: string;
  ownerDisplayName: string;
  ownerAvatar: string | null;
}

export interface CreatePostResponse {
  code: number;
  message: string;
  result: Post;
}

export interface HomePostsResponse {
  code: number;
  message: string;
  result: {
    content: Post[];
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
    last: boolean;
  };
}

// Service functions
export const postService = {
  /**
   * Create a new post
   */
  createPost: async (data: CreatePostRequest): Promise<CreatePostResponse> => {
    try {
      const response = await http.post<CreatePostResponse>('/post', data);
      return response.data;
    } catch (error: any) {
      console.error('Error creating post:', error);
      throw new Error(error.response?.data?.message || 'Failed to create post');
    }
  },

  /**
   * Get home feed posts with pagination
   */
  getHomePosts: async (page = 0, size = 10): Promise<HomePostsResponse> => {
    try {
      const response = await http.get<HomePostsResponse>(`/post/home?page=${page}&size=${size}`);
      return response.data;
    } catch (error: any) {
      console.error('Error fetching home posts:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch posts');
    }
  },
};

export default postService;
