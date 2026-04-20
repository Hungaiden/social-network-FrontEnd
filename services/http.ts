import axios, { AxiosInstance } from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080/api/v1';

const API_BASE_URL_PROD = 'https://fakebook-app-v1.onrender.com/api/v1';

// Tạo instance Axios với cấu hình mặc định
const http: AxiosInstance = axios.create({
  baseURL: API_BASE_URL_PROD,
  timeout: 10000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Gắn accessToken vào header mỗi request
http.interceptors.request.use((config) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }

  // Nếu data là FormData, loại bỏ Content-Type để Axios tự set multipart/form-data
  if (config.data instanceof FormData) {
    delete config.headers['Content-Type'];
  }

  return config;
});

export default http;

export interface ResList {
  hits?: any[];
  pagination?: {
    totalRows?: number;
    totalPages?: number;
  };
}
