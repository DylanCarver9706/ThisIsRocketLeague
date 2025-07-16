const https = require("https");

class PluginsService {
  // Helper function to make HTTPS requests
  async makeRequest(url) {
    return new Promise((resolve, reject) => {
      const options = {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        },
        timeout: 10000,
      };

      const req = https.get(url, options, (res) => {
        let data = "";

        res.on("data", (chunk) => {
          data += chunk;
        });

        res.on("end", () => {
          resolve(data);
        });
      });

      req.on("error", (error) => {
        reject(error);
      });

      req.on("timeout", () => {
        req.destroy();
        reject(new Error("Request timeout"));
      });

      req.setTimeout(10000);
    });
  }

  // Fetch plugins from BakkesPlugins website
  async getPlugins() {
    try {
      const html = await this.makeRequest(
        "https://bakkesplugins.com/plugin-search?style=list"
      );

      // We'll need to parse the HTML manually since we removed cheerio
      const plugins = this.parsePluginsFromHTML(html);

      return {
        success: true,
        data: plugins,
        count: plugins.length,
        lastFetched: new Date(),
      };
    } catch (error) {
      console.error("Error fetching plugins:", error);
      throw new Error(`Failed to fetch plugins: ${error.message}`);
    }
  }

  // Parse plugins from HTML using regex and string manipulation
  parsePluginsFromHTML(html) {
    const plugins = [];

    // Find the table body
    const tableBodyMatch = html.match(/<tbody[^>]*>([\s\S]*?)<\/tbody>/i);
    if (!tableBodyMatch) {
      console.log("No table body found in HTML");
      return plugins;
    }

    const tableBody = tableBodyMatch[1];

    // Split into rows
    const rows = tableBody.split(/<tr[^>]*>/i).filter((row) => row.trim());

    rows.forEach((row, index) => {
      if (!row.includes("<td")) return;

      // Extract cells using regex
      const cellMatches = row.match(/<td[^>]*>([\s\S]*?)<\/td>/gi);
      if (!cellMatches || cellMatches.length < 6) return;

      // Extract data from cells
      const cells = cellMatches.map((cell) => {
        // Remove HTML tags and decode entities
        return cell
          .replace(/<[^>]*>/g, "")
          .replace(/&nbsp;/g, " ")
          .replace(/&amp;/g, "&")
          .replace(/&lt;/g, "<")
          .replace(/&gt;/g, ">")
          .trim();
      });

      // Extract plugin URL from data-href attribute
      const urlMatch = row.match(/data-href="([^"]*)"/i);
      const pluginUrl = urlMatch ? urlMatch[1] : "";
      const fullUrl = pluginUrl ? `https://bakkesplugins.com${pluginUrl}` : "";

      // Check if plugin is verified (look for shield icon)
      const isVerified =
        row.includes("fa-shield-alt") || row.includes("shield-alt");

      const pluginName = cells[1] || "";
      const author = cells[2] || "";
      const description = cells[3] || "";
      const views = parseInt(cells[4]?.replace(/,/g, "")) || 0;
      const downloads = parseInt(cells[5]?.replace(/,/g, "")) || 0;
      const lastUpdated = cells[6] || "";

      if (pluginName) {
        plugins.push({
          id: index + 1,
          name: pluginName,
          author,
          description,
          views,
          downloads,
          lastUpdated,
          url: fullUrl,
          isVerified,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }
    });

    return plugins;
  }

  // Get trending plugins (top 10 by downloads)
  async getTrendingPlugins(limit = 10) {
    try {
      const result = await this.getPlugins();

      // Sort by downloads and take top N
      const trending = result.data
        .sort((a, b) => b.downloads - a.downloads)
        .slice(0, limit);

      return {
        success: true,
        data: trending,
        count: trending.length,
      };
    } catch (error) {
      console.error("Error fetching trending plugins:", error);
      throw error;
    }
  }

  // Search plugins by name or description
  async searchPlugins(query) {
    try {
      const result = await this.getPlugins();

      if (!query) {
        return result;
      }

      const searchTerm = query.toLowerCase();
      const filtered = result.data.filter(
        (plugin) =>
          plugin.name.toLowerCase().includes(searchTerm) ||
          plugin.description.toLowerCase().includes(searchTerm) ||
          plugin.author.toLowerCase().includes(searchTerm)
      );

      return {
        success: true,
        data: filtered,
        count: filtered.length,
        searchTerm: query,
      };
    } catch (error) {
      console.error("Error searching plugins:", error);
      throw error;
    }
  }
}

module.exports = new PluginsService();
