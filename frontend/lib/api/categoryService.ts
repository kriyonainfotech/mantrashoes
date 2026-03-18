import axios from 'axios';
import Cookies from 'js-cookie';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = Cookies.get('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  parent?: Category | string | null;
  isActive: boolean;
  showInNavbar: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export const categoryService = {
  async getCategories() {
    const response = await api.get('/categories/get-categories');
    return response.data;
  },

  async getCategory(id: string) {
    const response = await api.get(`/categories/get-category/${id}`);
    return response.data;
  },

  async createCategory(data: Partial<Category>) {
    const response = await api.post('/categories/create-category', data);
    return response.data;
  },

  async updateCategory(id: string, data: Partial<Category>) {
    const response = await api.put(`/categories/update-category/${id}`, data);
    return response.data;
  },

  async deleteCategory(id: string) {
    const response = await api.delete(`/categories/delete-category/${id}`);
    return response.data;
  },
};
