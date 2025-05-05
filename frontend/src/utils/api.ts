import axios from 'axios';
import { DiaryResponse } from 'types/entities';
import { ContactResponse } from 'types/entities';

// 创建axios实例
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // 允许跨域请求携带凭证
});

// 请求拦截器
api.interceptors.request.use(
  (config) => {
    // 从localStorage获取token
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // 处理401错误（未授权）
    if (error.response && error.response.status === 401) {
      // 清除本地存储的token
      localStorage.removeItem('token');
      // 重定向到登录页面
      window.location.href = '/auth/login';
    }
    return Promise.reject(error);
  }
);

// 认证相关API
export const authApi = {
  // 邮箱登录
  login: (email: string, password: string) =>
    api.post('/api/users/login', { email, password }),

  // 邮箱注册
  register: (email: string, password: string) =>
    api.post('/api/users/register', { email, password }),

  // 获取当前用户信息
  getCurrentUser: () =>
    api.get('/api/users/me'),

  // 退出登录
  logout: () =>
    api.post('/api/users/logout'),
};

// 日志相关API
export const diaryApi = {
  // 获取日志列表
  getDiaries: (params?: any) =>
    api.get<DiaryResponse[]>('/api/diaries/', { params }),

  // 获取单篇日志
  getDiary: (id: number) =>
    api.get(`/api/diaries/${id}`),

  // 创建日志
  createDiary: (data: any) =>
    api.post('/api/diaries', data),

  // 更新日志
  updateDiary: (id: number, data: any) =>
    api.put(`/api/diaries/${id}`, data),

  // 删除日志
  deleteDiary: (id: number) =>
    api.delete(`/api/diaries/${id}`),
};

// 联系人相关API
export const contactsApi = {
  // 获取联系人列表
  getContacts: (params?: any) =>
    api.get<ContactResponse[]>('/api/contacts/', { params }),

  // 获取单个联系人
  getContact: (id: number) =>
    api.get<ContactResponse>(`/api/contacts/${id}`),

  // 创建联系人
  createContact: (data: any) =>
    api.post('/api/contacts', data),

  // 更新联系人
  updateContact: (id: number, data: any) =>
    api.put(`/api/contacts/${id}`, data),

  // 删除联系人
  deleteContact: (id: number) =>
    api.delete(`/api/contacts/${id}`),

  // 获取最近联系人
  getRecentContacts: () => api.get('/api/contacts/recent'),
};

export default api;