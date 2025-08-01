import { termsAPI } from "./api";

export const termsService = {
  // Get all terms with filtering and pagination
  getAll: async (params = {}) => {
    try {
      const response = await termsAPI.getAll(params);
      // Server returns { success: true, data: [...], count: 10 }
      return response.data;
    } catch (error) {
      console.error("Error fetching terms:", error);
      throw error;
    }
  },

  // Get a specific term by ID
  getById: async (id) => {
    try {
      const response = await termsAPI.getById(id);
      return response.data;
    } catch (error) {
      console.error("Error fetching term:", error);
      throw error;
    }
  },

  // Get a specific term by slug
  getBySlug: async (slug) => {
    try {
      const response = await termsAPI.getBySlug(slug);
      return response.data;
    } catch (error) {
      console.error("Error fetching term by slug:", error);
      throw error;
    }
  },

  // Create a new term
  create: async (termData) => {
    try {
      const response = await termsAPI.create(termData);
      return response.data;
    } catch (error) {
      console.error("Error creating term:", error);
      throw error;
    }
  },

  // Like a term
  like: async (id) => {
    try {
      const response = await termsAPI.like(id);
      return response.data;
    } catch (error) {
      console.error("Error liking term:", error);
      throw error;
    }
  },

  // Unlike a term
  unlike: async (id) => {
    try {
      const response = await termsAPI.unlike(id);
      return response.data;
    } catch (error) {
      console.error("Error unliking term:", error);
      throw error;
    }
  },

  // Get trending terms
  getTrending: async (limit = 10) => {
    try {
      const response = await termsAPI.getTrending(limit);
      // Server returns { success: true, data: [...], count: 10 }
      return response.data;
    } catch (error) {
      console.error("Error fetching trending terms:", error);
      throw error;
    }
  },

  // Fetch terms with state management
  fetchTerms: async (
    filters,
    page,
    setTerms,
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

      const response = await termsAPI.getAll(params);

      // The server returns { success: true, data: [...], count: 10 }
      const apiData = response.data;
      setTerms(apiData.data || []);
      setTotalPages(Math.ceil((apiData.count || 0) / 12));
    } catch (err) {
      console.error("Error fetching terms:", err);
      setError("Failed to load terms");
    } finally {
      setLoading(false);
    }
  },
};
