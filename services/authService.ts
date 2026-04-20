import http from './http';

// Types
export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  code: number;
  result: {
    token: string;
    authenticated: boolean;
  };
}

export interface User {
  id: string;
  username: string;
  displayName: string;
  email?: string;
  avatar?: string;
}

// Decode JWT token to get user info
export const decodeToken = (token: string): any => {
  try {
    // JWT token has 3 parts: header.payload.signature
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join(''),
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Failed to decode token:', error);
    return null;
  }
};

// Login API
export const login = async (credentials: LoginRequest): Promise<LoginResponse> => {
  try {
    const response = await http.post<LoginResponse>('/auth/login', credentials);

    // Store token if login successful
    if (response.data.result.authenticated) {
      localStorage.setItem('access_token', response.data.result.token);
    }

    return response.data;
  } catch (error: any) {
    // Check if response exists
    if (!error.response) {
      throw new Error('Không thể kết nối đến server. Vui lòng kiểm tra lại.');
    }

    const statusCode = error.response.status;
    const errorData = error.response?.data;
    const errorCode = errorData?.code;
    const errorMessage = errorData?.message;

    // Handle specific error codes from backend (regardless of HTTP status)
    if (errorCode === 4001) {
      throw new Error('Username không tồn tại. Vui lòng kiểm tra lại.');
    }

    if (errorCode === 1014) {
      throw new Error('Mật khẩu không chính xác. Vui lòng thử lại.');
    }

    // Handle specific HTTP status codes
    if (statusCode === 404 && !errorCode) {
      throw new Error('API endpoint không tồn tại. Vui lòng liên hệ admin.');
    }

    if (statusCode === 500) {
      throw new Error('Lỗi server. Vui lòng thử lại sau.');
    }

    // Default error message
    throw new Error(errorMessage || 'Đăng nhập thất bại. Vui lòng thử lại.');
  }
};

// Logout
export const logout = () => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('current_user');
  window.location.href = '/login';
};

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  return !!localStorage.getItem('access_token');
};

// Get token
export const getToken = (): string | null => {
  return localStorage.getItem('access_token');
};
