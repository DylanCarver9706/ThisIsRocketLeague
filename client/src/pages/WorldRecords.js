import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Box,
  Chip,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Skeleton,
  Alert,
  IconButton,
  Tooltip,
  Pagination,
  Link as MuiLink,
} from "@mui/material";
import {
  Search as SearchIcon,
  ThumbUp as LikeIcon,
  Add as AddIcon,
  EmojiEvents as TrophyIcon,
  Person as PersonIcon,
  Link as LinkIcon,
} from "@mui/icons-material";
import { recordsService } from "../services";

const WorldRecords = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);
  const [filters, setFilters] = useState({
    search: "",
    category: "",
    sort: "newest",
  });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [likedRecords, setLikedRecords] = useState(new Set());

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    recordsService.fetchRecords(
      filters,
      page,
      setRecords,
      setTotalPages,
      setLoading,
      setError
    );
  }, [filters, page]);

  const fetchCategories = async () => {
    try {
      const response = await recordsService.getCategories();
      setCategories(response.data || []);
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  };

  const handleLike = async (recordId) => {
    try {
      await recordsService.like(recordId);
      setRecords((prevRecords) =>
        prevRecords.map((record) =>
          record._id === recordId
            ? { ...record, likeCount: record.likeCount + 1 }
            : record
        )
      );
      setLikedRecords((prev) => new Set([...prev, recordId]));
    } catch (err) {
      console.error("Error liking record:", err);
    }
  };

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
    setPage(1);
  };

  const getCategoryColor = (category) => {
    const colors = {
      "Fastest Goal": "error",
      "Longest Air Dribble": "primary",
      "Highest MMR": "success",
      "Most Goals in Match": "warning",
      "Longest Win Streak": "info",
      "Fastest Aerial Goal": "secondary",
      "Most Saves in Match": "default",
      Other: "default",
    };
    return colors[category] || "default";
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
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h3"
          component="h1"
          gutterBottom
          sx={{ display: "flex", alignItems: "center", gap: 2 }}
        >
          <TrophyIcon color="primary" />
          Rocket League World Records
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>
          Discover the most incredible achievements in Rocket League history
        </Typography>
        <Button
          component={Link}
          to="/submit-record"
          variant="contained"
          startIcon={<AddIcon />}
          size="large"
        >
          Submit New Record
        </Button>
      </Box>

      {/* Filters */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Search records..."
                value={filters.search}
                onChange={(e) => handleFilterChange("search", e.target.value)}
                InputProps={{
                  startAdornment: <SearchIcon color="action" sx={{ mr: 1 }} />,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select
                  value={filters.category}
                  label="Category"
                  onChange={(e) =>
                    handleFilterChange("category", e.target.value)
                  }
                >
                  <MenuItem value="">All Categories</MenuItem>
                  {categories.map((category) => (
                    <MenuItem key={category} value={category}>
                      {category}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth>
                <InputLabel>Sort By</InputLabel>
                <Select
                  value={filters.sort}
                  label="Sort By"
                  onChange={(e) => handleFilterChange("sort", e.target.value)}
                >
                  <MenuItem value="newest">Newest</MenuItem>
                  <MenuItem value="trending">Trending</MenuItem>
                  <MenuItem value="mostLiked">Most Liked</MenuItem>
                  <MenuItem value="recentAchieved">Recently Achieved</MenuItem>
                  <MenuItem value="oldest">Oldest</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <Button
                variant="outlined"
                fullWidth
                onClick={() =>
                  setFilters({ search: "", category: "", sort: "newest" })
                }
              >
                Clear Filters
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Records Grid */}
      <Grid container spacing={3}>
        {loading
          ? Array.from({ length: 12 }).map((_, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card>
                  <CardContent>
                    <Skeleton variant="text" width="70%" height={32} />
                    <Skeleton variant="text" width="100%" />
                    <Skeleton variant="text" width="60%" />
                    <Skeleton variant="text" width="40%" />
                  </CardContent>
                </Card>
              </Grid>
            ))
          : records.map((record) => (
              <Grid item xs={12} sm={6} md={4} key={record._id}>
                <Card
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        mb: 2,
                      }}
                    >
                      <Typography
                        variant="h6"
                        component="h3"
                        sx={{ fontWeight: "bold" }}
                      >
                        {record.title}
                      </Typography>
                      <Chip
                        label={record.category}
                        color={getCategoryColor(record.category)}
                        size="small"
                      />
                    </Box>

                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mb: 2 }}
                    >
                      {record.description}
                    </Typography>

                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        mb: 2,
                      }}
                    >
                      <PersonIcon fontSize="small" color="action" />
                      <Typography variant="body2" color="text.secondary">
                        {record.recordHolderName}
                      </Typography>
                    </Box>

                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        mb: 2,
                      }}
                    >
                      <LinkIcon fontSize="small" color="action" />
                      <MuiLink
                        href={record.proofUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        variant="body2"
                        color="primary"
                        sx={{ textDecoration: "none" }}
                      >
                        View Proof
                      </MuiLink>
                    </Box>

                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mb: 2,
                      }}
                    >
                      <Typography variant="caption" color="text.secondary">
                        Achieved: {formatDate(record.dateAchieved)}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        by {record.submittedBy}
                      </Typography>
                    </Box>

                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <Tooltip
                          title={
                            likedRecords.has(record._id)
                              ? "You've already liked this"
                              : "Like this record"
                          }
                        >
                          <IconButton
                            size="small"
                            onClick={() => handleLike(record._id)}
                            disabled={likedRecords.has(record._id)}
                            color={
                              likedRecords.has(record._id)
                                ? "primary"
                                : "default"
                            }
                          >
                            <LikeIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Typography variant="caption">
                          {record.likeCount} likes
                        </Typography>
                      </Box>
                      <Typography variant="caption" color="text.secondary">
                        {new Date(record.createdAt).toLocaleDateString()}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
      </Grid>

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={(_, value) => setPage(value)}
            color="primary"
            size="large"
          />
        </Box>
      )}

      {/* No results */}
      {!loading && records.length === 0 && (
        <Box sx={{ textAlign: "center", py: 8 }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No records found
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Try adjusting your filters or submit a new record
          </Typography>
          <Button
            component={Link}
            to="/submit-record"
            variant="contained"
            startIcon={<AddIcon />}
          >
            Submit New Record
          </Button>
        </Box>
      )}
    </Container>
  );
};

export default WorldRecords;
