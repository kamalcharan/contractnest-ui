// src/services/masterdata.ts
import api from './api';

export interface CategoryMaster {
  id: string;
  CategoryName: string;
  DisplayName: string;
  is_active: boolean;
  Description: string | null;
  icon_name: string | null;
  order_sequence: number | null;
  tenantid: string;
  created_at: string;
}

export interface CategoryDetail {
  id: string;
  SubCatName: string;
  DisplayName: string;
  category_id: string;
  hexcolor: string | null;
  icon_name: string | null;
  tags: string[] | null;
  tool_tip: string | null;
  is_active: boolean;
  Sequence_no: number | null;
  Description: string | null;
  tenantid: string;
  is_deletable: boolean;
  form_settings: any | null;
  created_at: string;
}

// This is a client-side service that makes API calls
export const masterdataService = {
  async getCategories(token: string, tenantId: string): Promise<CategoryMaster[]> {
    try {
      console.log("Making API request to fetch categories for tenant:", tenantId);
      
      const response = await api.get(`/api/masterdata/categories?tenantId=${tenantId}`);
      console.log("API response for categories:", response.status, response.data);
      
      return response.data;
    } catch (error) {
      console.error('Error fetching categories:', error);
      
      // Type assertion for error handling
      const axiosError = error as any;
      
      // Log more detailed error information
      if (axiosError.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error('Error response data:', axiosError.response.data);
        console.error('Error response status:', axiosError.response.status);
        console.error('Error response headers:', axiosError.response.headers);
      } else if (axiosError.request) {
        // The request was made but no response was received
        console.error('Error request:', axiosError.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error('Error message:', axiosError.message);
      }
      
      throw error;
    }
  },

  async getCategoryDetails(token: string, categoryId: string, tenantId: string): Promise<CategoryDetail[]> {
    try {
      const response = await api.get(`/api/masterdata/category-details?categoryId=${categoryId}&tenantId=${tenantId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching category details:', error);
      throw error;
    }
  },

  async getNextSequenceNumber(token: string, categoryId: string, tenantId: string): Promise<number> {
    try {
      const response = await api.get(`/api/masterdata/next-sequence?categoryId=${categoryId}&tenantId=${tenantId}`);
      return response.data.nextSequence;
    } catch (error) {
      console.error('Error getting next sequence number:', error);
      throw error;
    }
  },

  async addCategoryDetail(token: string, detail: Omit<CategoryDetail, 'id' | 'created_at'>): Promise<CategoryDetail> {
    try {
      const response = await api.post('/api/masterdata/category-details', detail);
      return response.data;
    } catch (error) {
      console.error('Error adding category detail:', error);
      throw error;
    }
  },

  async updateCategoryDetail(token: string, id: string, updates: Partial<CategoryDetail>): Promise<CategoryDetail> {
    try {
      const response = await api.patch(`/api/masterdata/category-details/${id}`, updates);
      return response.data;
    } catch (error) {
      console.error('Error updating category detail:', error);
      throw error;
    }
  },

  async softDeleteCategoryDetail(token: string, id: string, tenantId: string): Promise<{ success: boolean }> {
    try {
      const response = await api.delete(`/api/masterdata/category-details/${id}?tenantId=${tenantId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting category detail:', error);
      return { success: false };
    }
  }
};