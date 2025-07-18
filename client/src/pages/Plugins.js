import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Box,
  Skeleton,
  Alert,
  Tooltip,
  Link as MuiLink,
  Paper,
  Divider,
} from "@mui/material";
import {
  Download as DownloadIcon,
  Visibility as ViewIcon,
  Verified as VerifiedIcon,
  Warning as WarningIcon,
  Link as LinkIcon,
  TrendingUp as TrendingIcon,
} from "@mui/icons-material";
import { pluginsService } from "../services";

const Plugins = () => {
  const [plugins, setPlugins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTrendingPlugins();
  }, []);

  const fetchTrendingPlugins = async () => {
    try {
      setLoading(true);
      const response = await pluginsService.getTrending();
      setPlugins(response.data || []);
    } catch (err) {
      console.error("Error fetching trending plugins:", err);
      setError("Failed to load trending plugins");
    } finally {
      setLoading(false);
    }
  };

  const formatNumber = (num) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "M";
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K";
    }
    return num.toString();
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (error) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4, textAlign: "center" }}>
        <Typography
          variant="h3"
          component="h1"
          gutterBottom
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 2,
            fontWeight: "bold",
          }}
        >
          <TrendingIcon color="primary" sx={{ fontSize: 40 }} />
          Top 10 Trending Plugins
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
          Most downloaded BakkesMod plugins for Rocket League
        </Typography>
        <Typography variant="h6" color="text.secondary">
          <b>Note:</b> This is only available on PC.
        </Typography>
      </Box>

      {/* Top 10 List */}
      <Paper elevation={3} sx={{ borderRadius: 3, overflow: "hidden" }}>
        {loading ? (
          Array.from({ length: 10 }).map((_, index) => (
            <Box key={index}>
              <Box sx={{ p: 3, display: "flex", alignItems: "center" }}>
                <Skeleton
                  variant="circular"
                  width={48}
                  height={48}
                  sx={{ mr: 2 }}
                />
                <Box sx={{ flex: 1 }}>
                  <Skeleton variant="text" width="60%" height={24} />
                  <Skeleton variant="text" width="40%" height={20} />
                  <Skeleton variant="text" width="80%" height={16} />
                </Box>
                <Skeleton variant="text" width={60} height={20} />
              </Box>
              {index < 9 && <Divider />}
            </Box>
          ))
        ) : (
          <List sx={{ p: 0 }}>
            {plugins.map((plugin, index) => (
              <React.Fragment key={plugin.id}>
                <ListItem
                  sx={{
                    p: 3,
                    "&:hover": {
                      backgroundColor: "action.hover",
                    },
                  }}
                >
                  <ListItemAvatar>
                    <Avatar
                      sx={{
                        bgcolor: index < 3 ? "primary.main" : "grey.300",
                        color: index < 3 ? "white" : "text.primary",
                        fontWeight: "bold",
                        fontSize: "1.2rem",
                      }}
                    >
                      {index + 1}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <MuiLink
                          href={plugin.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          sx={{
                            textDecoration: "none",
                            color: "inherit",
                            "&:hover": {
                              textDecoration: "underline",
                            },
                          }}
                        >
                          <Typography
                            variant="h6"
                            component="h3"
                            sx={{ fontWeight: "bold" }}
                          >
                            {plugin.name}
                          </Typography>
                        </MuiLink>
                        <Tooltip
                          title={
                            plugin.isVerified
                              ? "Verified by BakkesPlugins staff"
                              : "Not verified by BakkesPlugins staff"
                          }
                        >
                          <Box>
                            {plugin.isVerified ? (
                              <VerifiedIcon color="success" fontSize="small" />
                            ) : (
                              <WarningIcon color="warning" fontSize="small" />
                            )}
                          </Box>
                        </Tooltip>
                      </Box>
                    }
                    secondary={
                      <Box>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ mb: 1 }}
                        >
                          {plugin.description}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ mb: 1 }}
                        >
                          by <strong>{plugin.author}</strong>
                        </Typography>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 3,
                            mb: 1,
                          }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 0.5,
                            }}
                          >
                            <ViewIcon fontSize="small" color="action" />
                            <Typography variant="caption">
                              {formatNumber(plugin.views)} views
                            </Typography>
                          </Box>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 0.5,
                            }}
                          >
                            <DownloadIcon fontSize="small" color="action" />
                            <Typography variant="caption">
                              {formatNumber(plugin.downloads)} downloads
                            </Typography>
                          </Box>
                        </Box>
                        <Typography variant="caption" color="text.secondary">
                          Updated: {formatDate(plugin.lastUpdated)}
                        </Typography>
                      </Box>
                    }
                  />
                  {plugin.url && (
                    <Tooltip title="View on BakkesPlugins">
                      <MuiLink
                        href={plugin.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={{ ml: 2 }}
                      >
                        <LinkIcon color="primary" />
                      </MuiLink>
                    </Tooltip>
                  )}
                </ListItem>
                {index < plugins.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        )}
      </Paper>

      {/* No results */}
      {!loading && plugins.length === 0 && (
        <Box sx={{ textAlign: "center", py: 8 }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No trending plugins found
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Check back later for the latest trending plugins
          </Typography>
        </Box>
      )}
    </Container>
  );
};

export default Plugins;
