import api from "./api";

class CarDesignsService {
  // Get all car designs with filtering and pagination
  async getAllCarDesigns(params = {}) {
    try {
      const response = await api.get("/car-designs", { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Get a specific car design by ID
  async getCarDesignById(id) {
    try {
      const response = await api.get(`/car-designs/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Create a new car design
  async createCarDesign(carDesignData) {
    try {
      const response = await api.post("/car-designs", carDesignData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Like a car design
  async likeCarDesign(id) {
    try {
      const response = await api.post(`/car-designs/${id}/like`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Unlike a car design
  async unlikeCarDesign(id) {
    try {
      const response = await api.delete(`/car-designs/${id}/like`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Get trending car designs
  async getTrendingCarDesigns(limit = 10) {
    try {
      const response = await api.get("/car-designs/trending/limit", {
        params: { limit },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Fetch car designs with state setters (following the same pattern as other services)
  async fetchCarDesigns(
    filters,
    page,
    setCarDesigns,
    setTotalPages,
    setLoading,
    setError
  ) {
    try {
      setLoading(true);
      setError(null);

      const params = {
        sort: filters.sort || "newest",
        limit: 50,
        page: page || 1,
      };

      if (filters.search && filters.search.trim()) {
        params.search = filters.search.trim();
      }

      const response = await this.getAllCarDesigns(params);

      setCarDesigns(response.data);
      setTotalPages(response.totalPages);
    } catch (error) {
      console.error("Error fetching car designs:", error);
      setError("Failed to load car designs");
    } finally {
      setLoading(false);
    }
  }
}

const carDesignsService = new CarDesignsService();
export default carDesignsService;
 