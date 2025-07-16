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
  Skeleton,
  Alert,
} from "@mui/material";
import {
  TrendingUp as TrendingIcon,
  Book as BookIcon,
  EmojiEvents as TrophyIcon,
  Add as AddIcon,
  ThumbUp as LikeIcon,
  Person as PersonIcon,
} from "@mui/icons-material";
import { termsService, recordsService } from "../services";

const Home = () => {
  const [trendingTerms, setTrendingTerms] = useState([]);
  const [trendingRecords, setTrendingRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTrendingContent = async () => {
      try {
        setLoading(true);
        const [termsResponse, recordsResponse] = await Promise.all([
          termsService.getTrending(5),
          recordsService.getTrending(5),
        ]);

        setTrendingTerms(termsResponse.data || []);
        setTrendingRecords(recordsResponse.data || []);
      } catch (err) {
        console.error("Error fetching trending content:", err);
        setError("Failed to load trending content");
      } finally {
        setLoading(false);
      }
    };

    fetchTrendingContent();
  }, []);

  const getSkillLevelColor = (level) => {
    switch (level) {
      case "Beginner":
        return "success";
      case "Intermediate":
        return "warning";
      case "Pro":
        return "error";
      default:
        return "default";
    }
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
    <Box className="min-h-screen">
      {/* Hero Section */}
      <Box
        sx={{
          background: "linear-gradient(135deg, #FF6B35 0%, #1E3A8A 100%)",
          color: "white",
          py: 8,
          mb: 6,
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography
                variant="h2"
                component="h1"
                gutterBottom
                sx={{ fontWeight: "bold" }}
              >
                This Is Rocket League
              </Typography>
              <Typography variant="h5" sx={{ mb: 3, opacity: 0.9 }}>
                Your ultimate guide to Rocket League terminology and world
                records
              </Typography>
              <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                <Button
                  component={Link}
                  to="/dictionary"
                  variant="contained"
                  size="large"
                  startIcon={<BookIcon />}
                  sx={{
                    backgroundColor: "white",
                    color: "primary.main",
                    "&:hover": { backgroundColor: "grey.100" },
                  }}
                >
                  Explore Dictionary
                </Button>
                <Button
                  component={Link}
                  to="/world-records"
                  variant="outlined"
                  size="large"
                  startIcon={<TrophyIcon />}
                  sx={{
                    borderColor: "white",
                    color: "white",
                    "&:hover": {
                      borderColor: "white",
                      backgroundColor: "rgba(255,255,255,0.1)",
                    },
                  }}
                >
                  View Records
                </Button>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ textAlign: "center" }}>
                <TrophyIcon sx={{ fontSize: 120, opacity: 0.8 }} />
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ pb: 6 }}>
        {/* Quick Actions */}
        <Grid container spacing={3} sx={{ mb: 6 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ height: "100%", textAlign: "center" }}>
              <CardContent>
                <BookIcon sx={{ fontSize: 48, color: "primary.main", mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                  Dictionary
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 2 }}
                >
                  Learn Rocket League terms and mechanics
                </Typography>
                <Button
                  component={Link}
                  to="/dictionary"
                  variant="outlined"
                  fullWidth
                >
                  Browse Terms
                </Button>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ height: "100%", textAlign: "center" }}>
              <CardContent>
                <TrophyIcon
                  sx={{ fontSize: 48, color: "primary.main", mb: 2 }}
                />
                <Typography variant="h6" gutterBottom>
                  World Records
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 2 }}
                >
                  Discover amazing achievements
                </Typography>
                <Button
                  component={Link}
                  to="/world-records"
                  variant="outlined"
                  fullWidth
                >
                  View Records
                </Button>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ height: "100%", textAlign: "center" }}>
              <CardContent>
                <AddIcon sx={{ fontSize: 48, color: "primary.main", mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                  Submit Term
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 2 }}
                >
                  Add new terms to our dictionary
                </Typography>
                <Button
                  component={Link}
                  to="/submit-term"
                  variant="outlined"
                  fullWidth
                >
                  Submit Term
                </Button>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ height: "100%", textAlign: "center" }}>
              <CardContent>
                <AddIcon sx={{ fontSize: 48, color: "primary.main", mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                  Submit Record
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 2 }}
                >
                  Share your achievements
                </Typography>
                <Button
                  component={Link}
                  to="/submit-record"
                  variant="outlined"
                  fullWidth
                >
                  Submit Record
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Trending Content */}
        <Grid container spacing={4}>
          {/* Trending Terms */}
          <Grid item xs={12} lg={6}>
            <Box sx={{ mb: 3 }}>
              <Typography
                variant="h4"
                gutterBottom
                sx={{ display: "flex", alignItems: "center", gap: 1 }}
              >
                <TrendingIcon color="primary" />
                Trending Terms
              </Typography>
            </Box>

            {loading
              ? Array.from({ length: 3 }).map((_, index) => (
                  <Card key={index} sx={{ mb: 2 }}>
                    <CardContent>
                      <Skeleton variant="text" width="60%" height={32} />
                      <Skeleton variant="text" width="100%" />
                      <Skeleton variant="text" width="80%" />
                    </CardContent>
                  </Card>
                ))
              : trendingTerms.map((term) => (
                  <Card key={term._id} sx={{ mb: 2 }}>
                    <CardContent>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "flex-start",
                          mb: 1,
                        }}
                      >
                        <Typography variant="h6" component="h3">
                          {term.term}
                        </Typography>
                        <Chip
                          label={term.skillLevel}
                          color={getSkillLevelColor(term.skillLevel)}
                          size="small"
                        />
                      </Box>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mb: 1 }}
                      >
                        {term.definition}
                      </Typography>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ fontStyle: "italic" }}
                      >
                        "{term.exampleUsage}"
                      </Typography>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          mt: 2,
                        }}
                      >
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          <LikeIcon fontSize="small" color="action" />
                          <Typography variant="caption">
                            {term.likeCount} likes
                          </Typography>
                        </Box>
                        <Typography variant="caption" color="text.secondary">
                          by {term.submittedBy}
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                ))}

            <Button
              component={Link}
              to="/dictionary"
              variant="text"
              fullWidth
              sx={{ mt: 2 }}
            >
              View All Terms →
            </Button>
          </Grid>

          {/* Trending Records */}
          <Grid item xs={12} lg={6}>
            <Box sx={{ mb: 3 }}>
              <Typography
                variant="h4"
                gutterBottom
                sx={{ display: "flex", alignItems: "center", gap: 1 }}
              >
                <TrendingIcon color="primary" />
                Trending Records
              </Typography>
            </Box>

            {loading
              ? Array.from({ length: 3 }).map((_, index) => (
                  <Card key={index} sx={{ mb: 2 }}>
                    <CardContent>
                      <Skeleton variant="text" width="70%" height={32} />
                      <Skeleton variant="text" width="100%" />
                      <Skeleton variant="text" width="60%" />
                    </CardContent>
                  </Card>
                ))
              : trendingRecords.map((record) => (
                  <Card key={record._id} sx={{ mb: 2 }}>
                    <CardContent>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "flex-start",
                          mb: 1,
                        }}
                      >
                        <Typography variant="h6" component="h3">
                          {record.title}
                        </Typography>
                        <Chip
                          label={record.category}
                          color="primary"
                          size="small"
                        />
                      </Box>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mb: 1 }}
                      >
                        {record.description}
                      </Typography>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          mb: 1,
                        }}
                      >
                        <PersonIcon fontSize="small" color="action" />
                        <Typography variant="caption" color="text.secondary">
                          {record.recordHolderName}
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
                          <LikeIcon fontSize="small" color="action" />
                          <Typography variant="caption">
                            {record.likeCount} likes
                          </Typography>
                        </Box>
                        <Typography variant="caption" color="text.secondary">
                          {formatDate(record.dateAchieved)}
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                ))}

            <Button
              component={Link}
              to="/world-records"
              variant="text"
              fullWidth
              sx={{ mt: 2 }}
            >
              View All Records →
            </Button>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Home;
