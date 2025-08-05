import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Box,
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
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
  const navigate = useNavigate();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    search: "",
    sort: "newest",
  });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [submitDialogOpen, setSubmitDialogOpen] = useState(false);
  const [submitForm, setSubmitForm] = useState({
    title: "",
    description: "",
    recordHolderName: "",
    proofUrl: "",
    dateAchieved: "",
    submittedBy: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

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

  const handleLike = async (recordId) => {
    try {
      const record = records.find((r) => r._id === recordId);
      if (record.isLiked) {
        // Unlike
        await recordsService.unlike(recordId);
        setRecords((prevRecords) =>
          prevRecords.map((r) =>
            r._id === recordId
              ? { ...r, likeCount: r.likeCount - 1, isLiked: false }
              : r
          )
        );
      } else {
        // Like
        await recordsService.like(recordId);
        setRecords((prevRecords) =>
          prevRecords.map((r) =>
            r._id === recordId
              ? { ...r, likeCount: r.likeCount + 1, isLiked: true }
              : r
          )
        );
      }
    } catch (err) {
      console.error("Error toggling like:", err);
    }
  };

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
    setPage(1);
  };

  const handleCardClick = (record) => {
    const recordSlug = record.title.toLowerCase().replace(/\s+/g, "-");
    navigate(`/world-records/${recordSlug}`);
  };

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      setSubmitError(null);

      if (
        !submitForm.title ||
        !submitForm.description ||
        !submitForm.recordHolderName ||
        !submitForm.proofUrl ||
        !submitForm.dateAchieved
      ) {
        setSubmitError("Please fill in all required fields");
        return;
      }

      await recordsService.create(submitForm);

      // Reset form and close dialog
      setSubmitForm({
        title: "",
        description: "",
        recordHolderName: "",
        proofUrl: "",
        dateAchieved: "",
        submittedBy: "",
      });
      setSubmitDialogOpen(false);

      // Show success message
      alert("Record submitted successfully! It will be reviewed by an admin.");
    } catch (err) {
      console.error("Error creating record:", err);
      setSubmitError(err.response?.data?.error || "Failed to submit record");
    } finally {
      setSubmitting(false);
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
          variant="contained"
          startIcon={<AddIcon />}
          size="large"
          onClick={() => setSubmitDialogOpen(true)}
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
                onClick={() => setFilters({ search: "", sort: "newest" })}
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
                    cursor: "pointer",
                    transition: "transform 0.2s, box-shadow 0.2s",
                    "&:hover": {
                      transform: "translateY(-2px)",
                      boxShadow: 3,
                    },
                  }}
                  onClick={() => handleCardClick(record)}
                >
                  <CardContent
                    sx={{
                      flexGrow: 1,
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography
                        variant="h6"
                        component="h3"
                        sx={{ fontWeight: "bold", mb: 2 }}
                      >
                        {record.title}
                      </Typography>

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
                          Record holder:{" "}
                          <strong>{record.recordHolderName}</strong>
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
                          onClick={(e) => e.stopPropagation()}
                        >
                          Watch on YouTube
                        </MuiLink>
                      </Box>

                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          gap: 1,
                          mb: 2,
                        }}
                      >
                        <Typography variant="body2" color="text.secondary">
                          Achieved: {formatDate(record.dateAchieved)}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Submitted by: {record.submittedBy}
                        </Typography>
                      </Box>
                    </Box>

                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mt: "auto",
                      }}
                    >
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <Tooltip
                          title={
                            record.isLiked
                              ? "Click to unlike"
                              : "Like this record"
                          }
                        >
                          <IconButton
                            size="medium"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleLike(record._id);
                            }}
                            color={record.isLiked ? "primary" : "default"}
                          >
                            <LikeIcon fontSize="medium" />
                          </IconButton>
                        </Tooltip>
                        <Typography variant="body2">
                          {record.likeCount} likes
                        </Typography>
                      </Box>
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
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setSubmitDialogOpen(true)}
          >
            Submit New Record
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
        <DialogTitle>Submit New Record</DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 1 }}>
            <TextField
              label="Title"
              value={submitForm.title}
              onChange={(e) =>
                setSubmitForm({ ...submitForm, title: e.target.value })
              }
              fullWidth
              required
            />
            <TextField
              label="Description"
              value={submitForm.description}
              onChange={(e) =>
                setSubmitForm({ ...submitForm, description: e.target.value })
              }
              fullWidth
              multiline
              rows={3}
              required
            />
            <TextField
              label="Record Holder Name"
              value={submitForm.recordHolderName}
              onChange={(e) =>
                setSubmitForm({
                  ...submitForm,
                  recordHolderName: e.target.value,
                })
              }
              fullWidth
              required
            />
            <TextField
              label="Proof URL"
              value={submitForm.proofUrl}
              onChange={(e) =>
                setSubmitForm({ ...submitForm, proofUrl: e.target.value })
              }
              fullWidth
              required
              placeholder="https://example.com/proof"
            />
            <TextField
              label="Date Achieved"
              type="date"
              value={submitForm.dateAchieved}
              onChange={(e) =>
                setSubmitForm({ ...submitForm, dateAchieved: e.target.value })
              }
              fullWidth
              required
              InputLabelProps={{ shrink: true }}
            />
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

export default WorldRecords;
