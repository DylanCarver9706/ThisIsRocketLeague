import { recordsAPI } from "./api";

export const recordsService = {
  // Get all records with filtering and pagination
  getAll: async (params = {}) => {
    try {
      const response = await recordsAPI.getAll(params);
      return response.data;
    } catch (error) {
      console.error("Error fetching records:", error);
      throw error;
    }
  },

  // Get a specific record by ID
  getById: async (id) => {
    try {
      const response = await recordsAPI.getById(id);
      return response.data;
    } catch (error) {
      console.error("Error fetching record:", error);
      throw error;
    }
  },

  // Create a new record
  create: async (recordData) => {
    try {
      const response = await recordsAPI.create(recordData);
      return response.data;
    } catch (error) {
      console.error("Error creating record:", error);
      throw error;
    }
  },

  // Like a record
  like: async (id) => {
    try {
      const response = await recordsAPI.like(id);
      return response.data;
    } catch (error) {
      console.error("Error liking record:", error);
      throw error;
    }
  },

  // Unlike a record
  unlike: async (id) => {
    try {
      const response = await recordsAPI.unlike(id);
      return response.data;
    } catch (error) {
      console.error("Error unliking record:", error);
      throw error;
    }
  },

  // Get trending records
  getTrending: async (limit = 10) => {
    try {
      const response = await recordsAPI.getTrending(limit);
      return response.data;
    } catch (error) {
      console.error("Error fetching trending records:", error);
      throw error;
    }
  },

  // Get categories
  getCategories: async () => {
    try {
      const response = await recordsAPI.getCategories();
      return response.data;
    } catch (error) {
      console.error("Error fetching categories:", error);
      throw error;
    }
  },

  // Fetch records with state management
  fetchRecords: async (
    filters,
    page,
    setRecords,
    setTotalPages,
    setLoading,
    setError
  ) => {
    try {
      setLoading(true);
      const params = {
        ...filters,
        limit: 12,
        page,
      };

      const response = await recordsAPI.getAll(params);

      // The server returns { success: true, data: [...], count: 10 }
      const apiData = response.data;
      setRecords(apiData.data || []);
      setTotalPages(Math.ceil((apiData.count || 0) / 12));
    } catch (err) {
      console.error("Error fetching records:", err);
      setError("Failed to load records");
    } finally {
      setLoading(false);
    }
  },
};
 