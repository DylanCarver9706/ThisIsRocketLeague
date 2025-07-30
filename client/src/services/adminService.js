import api from "./api";

class AdminService {
  // Verify admin access
  async verifyAccess(adminKey) {
    try {
      const response = await api.get("/admin/dashboard", {
        headers: {
          "x-admin-key": adminKey,
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Get dashboard stats
  async getDashboardStats(adminKey) {
    try {
      const response = await api.get("/admin/dashboard", {
        headers: {
          "x-admin-key": adminKey,
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Get all submissions
  async getAllSubmissions(adminKey) {
    try {
      const response = await api.get("/admin/submissions", {
        headers: {
          "x-admin-key": adminKey,
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Get submissions by status
  async getSubmissionsByStatus(status, adminKey, type = null) {
    try {
      const params = type ? { type } : {};
      const response = await api.get(`/admin/submissions/${status}`, {
        headers: {
          "x-admin-key": adminKey,
        },
        params,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Update submission status
  async updateSubmissionStatus(id, type, status, adminKey) {
    try {
      const response = await api.put(
        "/admin/submissions/status",
        {
          id,
          type,
          status,
        },
        {
          headers: {
            "x-admin-key": adminKey,
          },
        }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}

const adminService = new AdminService();
export default adminService;
 