import { pluginsAPI } from "./api";

export const pluginsService = {
  // Get all plugins
  getAll: async (params = {}) => {
    try {
      const response = await pluginsAPI.getAll(params);
      return response.data;
    } catch (error) {
      console.error("Error fetching plugins:", error);
      throw error;
    }
  },

  // Get trending plugins
  getTrending: async (limit = 10) => {
    try {
      const response = await pluginsAPI.getTrending(limit);
      return response.data;
    } catch (error) {
      console.error("Error fetching trending plugins:", error);
      throw error;
    }
  },

  // Search plugins
  search: async (query) => {
    try {
      const response = await pluginsAPI.search(query);
      return response.data;
    } catch (error) {
      console.error("Error searching plugins:", error);
      throw error;
    }
  },

  // Fetch plugins with state management
  fetchPlugins: async (setPlugins, setLoading, setError) => {
    try {
      setLoading(true);
      const response = await pluginsAPI.getAll();
      setPlugins(response.data.data || []);
    } catch (err) {
      console.error("Error fetching plugins:", err);
      setError("Failed to load plugins");
    } finally {
      setLoading(false);
    }
  },
};
