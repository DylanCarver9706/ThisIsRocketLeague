import React, { useState, useEffect } from "react";
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import {
  Search as SearchIcon,
  ThumbUp as LikeIcon,
  Add as AddIcon,
  Book as BookIcon,
} from "@mui/icons-material";
import { termsService } from "../services";

const Dictionary = () => {
  const [terms, setTerms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);
  const [filters, setFilters] = useState({
    search: "",
    category: "",
    skillLevel: "",
    sort: "newest",
  });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [likedTerms, setLikedTerms] = useState(new Set());
  const [submitDialogOpen, setSubmitDialogOpen] = useState(false);
  const [submitForm, setSubmitForm] = useState({
    term: "",
    definition: "",
    category: "",
    exampleUsage: "",
    skillLevel: "",
    submittedBy: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    termsService.fetchTerms(
      filters,
      page,
      setTerms,
      setTotalPages,
      setLoading,
      setError
    );
  }, [filters, page]);

  const fetchCategories = async () => {
    try {
      const response = await termsService.getCategories();
      setCategories(response.data || []);
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  };

  const handleLike = async (termId) => {
    try {
      await termsService.like(termId);
      setTerms((prevTerms) =>
        prevTerms.map((term) =>
          term._id === termId
            ? { ...term, likeCount: term.likeCount + 1 }
            : term
        )
      );
      setLikedTerms((prev) => new Set([...prev, termId]));
    } catch (err) {
      console.error("Error liking term:", err);
    }
  };

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
    setPage(1);
  };

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      setSubmitError(null);

      if (
        !submitForm.term ||
        !submitForm.definition ||
        !submitForm.category ||
        !submitForm.exampleUsage ||
        !submitForm.skillLevel
      ) {
        setSubmitError("Please fill in all required fields");
        return;
      }

      await termsService.create(submitForm);

      // Reset form and close dialog
      setSubmitForm({
        term: "",
        definition: "",
        category: "",
        exampleUsage: "",
        skillLevel: "",
        submittedBy: "",
      });
      setSubmitDialogOpen(false);

      // Show success message
      alert("Term submitted successfully! It will be reviewed by an admin.");
    } catch (err) {
      console.error("Error creating term:", err);
      setSubmitError(err.response?.data?.error || "Failed to submit term");
    } finally {
      setSubmitting(false);
    }
  };

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

  const getCategoryColor = (category) => {
    const colors = {
      Mechanics: "primary",
      Slang: "secondary",
      Strategy: "success",
      Tactics: "warning",
      Equipment: "info",
      Other: "default",
    };
    return colors[category] || "default";
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
          <BookIcon color="primary" />
          Rocket League Dictionary
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>
          Learn the language of Rocket League with our comprehensive dictionary
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          size="large"
          onClick={() => setSubmitDialogOpen(true)}
        >
          Submit New Term
        </Button>
      </Box>

      {/* Filters */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Search terms..."
                value={filters.search}
                onChange={(e) => handleFilterChange("search", e.target.value)}
                InputProps={{
                  startAdornment: <SearchIcon color="action" sx={{ mr: 1 }} />,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
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
            <Grid item xs={12} sm={6} md={2}>
              <FormControl fullWidth>
                <InputLabel>Skill Level</InputLabel>
                <Select
                  value={filters.skillLevel}
                  label="Skill Level"
                  onChange={(e) =>
                    handleFilterChange("skillLevel", e.target.value)
                  }
                >
                  <MenuItem value="">All Levels</MenuItem>
                  <MenuItem value="Beginner">Beginner</MenuItem>
                  <MenuItem value="Intermediate">Intermediate</MenuItem>
                  <MenuItem value="Pro">Pro</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
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
                  <MenuItem value="oldest">Oldest</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <Button
                variant="outlined"
                fullWidth
                onClick={() =>
                  setFilters({
                    search: "",
                    category: "",
                    skillLevel: "",
                    sort: "newest",
                  })
                }
              >
                Clear Filters
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Terms Grid */}
      <Grid container spacing={3}>
        {loading
          ? Array.from({ length: 12 }).map((_, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card>
                  <CardContent>
                    <Skeleton variant="text" width="60%" height={32} />
                    <Skeleton variant="text" width="100%" />
                    <Skeleton variant="text" width="80%" />
                    <Skeleton variant="text" width="40%" />
                  </CardContent>
                </Card>
              </Grid>
            ))
          : Array.isArray(terms) &&
            terms.map((term) => (
              <Grid item xs={12} sm={6} md={4} key={term._id}>
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
                      sx={{ mb: 2 }}
                    >
                      {term.definition}
                    </Typography>

                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ fontStyle: "italic", display: "block", mb: 2 }}
                    >
                      "{term.exampleUsage}"
                    </Typography>

                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mb: 2,
                      }}
                    >
                      <Chip
                        label={term.category}
                        color={getCategoryColor(term.category)}
                        size="small"
                        variant="outlined"
                      />
                      <Typography variant="caption" color="text.secondary">
                        by {term.submittedBy}
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
                            likedTerms.has(term._id)
                              ? "You've already liked this"
                              : "Like this term"
                          }
                        >
                          <IconButton
                            size="small"
                            onClick={() => handleLike(term._id)}
                            disabled={likedTerms.has(term._id)}
                            color={
                              likedTerms.has(term._id) ? "primary" : "default"
                            }
                          >
                            <LikeIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Typography variant="caption">
                          {term.likeCount} likes
                        </Typography>
                      </Box>
                      <Typography variant="caption" color="text.secondary">
                        {new Date(term.createdAt).toLocaleDateString()}
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
      {!loading && terms.length === 0 && (
        <Box sx={{ textAlign: "center", py: 8 }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No terms found
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Try adjusting your filters or submit a new term
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setSubmitDialogOpen(true)}
          >
            Submit New Term
          </Button>
        </Box>
      )}

      {/* Submit Dialog */}
      <Dialog
        open={submitDialogOpen}
        onClose={() => setSubmitDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Submit New Term</DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 1 }}>
            <TextField
              label="Term"
              value={submitForm.term}
              onChange={(e) =>
                setSubmitForm({ ...submitForm, term: e.target.value })
              }
              fullWidth
              required
            />
            <TextField
              label="Definition"
              value={submitForm.definition}
              onChange={(e) =>
                setSubmitForm({ ...submitForm, definition: e.target.value })
              }
              fullWidth
              multiline
              rows={3}
              required
            />
            <FormControl fullWidth required>
              <InputLabel>Category</InputLabel>
              <Select
                value={submitForm.category}
                label="Category"
                onChange={(e) =>
                  setSubmitForm({ ...submitForm, category: e.target.value })
                }
              >
                <MenuItem value="Mechanics">Mechanics</MenuItem>
                <MenuItem value="Slang">Slang</MenuItem>
                <MenuItem value="Strategy">Strategy</MenuItem>
                <MenuItem value="Tactics">Tactics</MenuItem>
                <MenuItem value="Equipment">Equipment</MenuItem>
                <MenuItem value="Other">Other</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="Example Usage"
              value={submitForm.exampleUsage}
              onChange={(e) =>
                setSubmitForm({ ...submitForm, exampleUsage: e.target.value })
              }
              fullWidth
              multiline
              rows={2}
              required
            />
            <FormControl fullWidth required>
              <InputLabel>Skill Level</InputLabel>
              <Select
                value={submitForm.skillLevel}
                label="Skill Level"
                onChange={(e) =>
                  setSubmitForm({ ...submitForm, skillLevel: e.target.value })
                }
              >
                <MenuItem value="Beginner">Beginner</MenuItem>
                <MenuItem value="Intermediate">Intermediate</MenuItem>
                <MenuItem value="Pro">Pro</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="Your Name (optional)"
              value={submitForm.submittedBy}
              onChange={(e) =>
                setSubmitForm({ ...submitForm, submittedBy: e.target.value })
              }
              fullWidth
            />

            {submitError && <Alert severity="error">{submitError}</Alert>}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSubmitDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={submitting}
          >
            {submitting ? "Submitting..." : "Submit"}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Dictionary;
