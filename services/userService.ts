import http from './http';

// Types
export interface UpdateProfileRequest {
  displayName?: string;
  email?: string;
  avatar?: string;
  bio?: string;
}

export interface UpdateProfileResponse {
  code: number;
  message: string;
  result: {
    id: string;
    username: string;
    displayName: string;
    email: string;
    avatar?: string;
    bio?: string;
  };
}

// Service functions
export const userService = {
  /**
   * Update user profile
   * @param data Profile data to update
   * @returns Updated user information
   */
  updateProfile: async (data: UpdateProfileRequest): Promise<UpdateProfileResponse> => {
    try {
      const response = await http.put<UpdateProfileResponse>('/user', data);
      return response.data;
    } catch (error: any) {
      console.error('Error updating profile:', error);
      throw new Error(error.response?.data?.message || 'Failed to update profile');
    }
  },

  /**
   * Upload image
   * @param file Image file
   * @returns URL of uploaded image
   */
  uploadImage: async (file: File): Promise<string> => {
    try {
      const formData = new FormData();
      formData.append('file', file);

      interface UploadResponse {
        code: number;
        message: string;
        result: string;
      }

      const response = await http.post<UploadResponse>('/upload/image', formData);

      if (response.data.code === 1000) {
        return response.data.result;
      }

      throw new Error(response.data.message || 'Upload image failed');
    } catch (error: any) {
      console.error('Error uploading image:', error);
      throw new Error(error.response?.data?.message || 'Failed to upload image');
    }
  },
};

export default userService;
