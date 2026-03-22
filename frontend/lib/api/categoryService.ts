import axios from 'axios';
import Cookies from 'js-cookie';

import { API_URL } from '../config';


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

api.interceptors.response.use(
  (response) => {
    const contentType = response.headers['content-type'];
    if (contentType && !contentType.includes('application/json')) {
      console.error('Expected JSON but received:', response.data);
      throw new Error(`Expected JSON but received ${contentType}`);
    }
    return response;
  },
  (error) => {
    if (error.response) {
      const contentType = error.response.headers['content-type'];
      if (contentType && contentType.includes('text/html')) {
        console.error('API returned HTML (likely a 404 or error page)');
        return Promise.reject(new Error(`API Error: Received HTML instead of JSON. Check your API URL: ${error.config.url}`));
      }
    }
    return Promise.reject(error);
  }
);

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
