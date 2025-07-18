import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  Box,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  IconButton,
  Pagination,
} from "@mui/material";
import {
  DirectionsCar as CarIcon,
  Add as AddIcon,
  Favorite as LikeIcon,
  FavoriteBorder as LikeBorderIcon,
  Upload as UploadIcon,
} from "@mui/icons-material";
import carDesignsService from "../services/carDesignsService";

const CarDesigns = () => {
  const [carDesigns, setCarDesigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sort, setSort] = useState("newest");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [uploadForm, setUploadForm] = useState({
    title: "",
    description: "",
    submittedBy: "",
    image: null,
  });
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    carDesignsService.fetchCarDesigns(
      { sort, search },
      page,
      setCarDesigns,
      setTotalPages,
      setLoading,
      setError
    );
  }, [sort, search, page]);

  const handleLike = async (id) => {
    try {
      await carDesignsService.likeCarDesign(id);
      setCarDesigns((prevCarDesigns) =>
        prevCarDesigns.map((carDesign) =>
          carDesign._id === id
            ? {
                ...carDesign,
                likeCount: carDesign.likeCount + 1,
                isLiked: true,
              }
            : carDesign
        )
      );
    } catch (err) {
      console.error("Error liking car design:", err);
      setError("Failed to like car design");
    }
  };

  const handleFilterChange = (field, value) => {
    if (field === "sort") {
      setSort(value);
    } else if (field === "search") {
      setSearch(value);
    }
    setPage(1);
  };

  const handlePageChange = (_, value) => {
    setPage(value);
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        setUploadError("Please select a valid image file");
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setUploadError("Image size must be less than 5MB");
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const base64 = e.target.result;
        setUploadForm({ ...uploadForm, image: base64 });
        setImagePreview(base64);
        setUploadError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadSubmit = async () => {
    try {
      setUploading(true);
      setUploadError(null);

      if (!uploadForm.title || !uploadForm.description || !uploadForm.image) {
        setUploadError("Please fill in all required fields");
        return;
      }

      await carDesignsService.createCarDesign(uploadForm);

      // Reset form and close dialog
      setUploadForm({
        title: "",
        description: "",
        submittedBy: "",
        image: null,
      });
      setImagePreview(null);
      setUploadDialogOpen(false);

      // Show success message
      setError(null);
      alert(
        "Car design submitted successfully! It will be reviewed by an admin."
      );
    } catch (err) {
      console.error("Error creating car design:", err);
      setUploadError(
        err.response?.data?.error || "Failed to submit car design"
      );
    } finally {
      setUploading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h4" gutterBottom>
          Loading car designs...
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h3"
          component="h1"
          gutterBottom
          sx={{ display: "flex", alignItems: "center", gap: 2 }}
        >
          <CarIcon color="primary" />
          Car Designs
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>
          Show off your Rocket League car designs
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          size="large"
          onClick={() => setUploadDialogOpen(true)}
        >
          Submit New Car Design
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Search and Sort Controls */}
      <Box sx={{ mb: 3, display: "flex", gap: 2, flexWrap: "wrap" }}>
        <TextField
          label="Search car designs"
          value={search}
          onChange={(e) => handleFilterChange("search", e.target.value)}
          sx={{ minWidth: 200 }}
        />
        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel>Sort by</InputLabel>
          <Select
            value={sort}
            onChange={(e) => handleFilterChange("sort", e.target.value)}
            label="Sort by"
          >
            <MenuItem value="newest">Newest</MenuItem>
            <MenuItem value="trending">Trending</MenuItem>
            <MenuItem value="mostLiked">Most Liked</MenuItem>
            <MenuItem value="oldest">Oldest</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Car Designs Grid */}
      <Grid container spacing={3}>
        {carDesigns.map((carDesign) => (
          <Grid item xs={12} sm={6} md={4} key={carDesign._id}>
            <Card
              sx={{ height: "100%", display: "flex", flexDirection: "column" }}
            >
              <CardMedia
                component="img"
                height="200"
                image={carDesign.image}
                alt={carDesign.title}
                sx={{ objectFit: "cover" }}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6" gutterBottom>
                  {carDesign.title}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 2 }}
                >
                  {carDesign.description}
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Typography variant="caption" color="text.secondary">
                    By {carDesign.submittedBy} •{" "}
                    {formatDate(carDesign.createdAt)}
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <IconButton
                      size="small"
                      onClick={() => handleLike(carDesign._id)}
                      color={carDesign.isLiked ? "primary" : "default"}
                    >
                      {carDesign.isLiked ? (
                        <LikeIcon fontSize="small" />
                      ) : (
                        <LikeBorderIcon fontSize="small" />
                      )}
                    </IconButton>
                    <Typography variant="body2">
                      {carDesign.likeCount || 0}
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
            onChange={handlePageChange}
            color="primary"
            size="large"
          />
        </Box>
      )}

      {carDesigns.length === 0 && !loading && (
        <Box sx={{ textAlign: "center", py: 8 }}>
          <CarIcon sx={{ fontSize: 60, color: "text.secondary", mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No car designs found
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Be the first to share your car design!
          </Typography>
        </Box>
      )}

      {/* Upload Dialog */}
      <Dialog
        open={uploadDialogOpen}
        onClose={() => setUploadDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Upload Car Design</DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 1 }}>
            <TextField
              label="Title"
              value={uploadForm.title}
              onChange={(e) =>
                setUploadForm({ ...uploadForm, title: e.target.value })
              }
              fullWidth
              required
            />
            <TextField
              label="Description"
              value={uploadForm.description}
              onChange={(e) =>
                setUploadForm({ ...uploadForm, description: e.target.value })
              }
              fullWidth
              multiline
              rows={3}
              required
            />
            <TextField
              label="Your Name (optional)"
              value={uploadForm.submittedBy}
              onChange={(e) =>
                setUploadForm({ ...uploadForm, submittedBy: e.target.value })
              }
              fullWidth
            />

            <Box>
              <input
                accept="image/*"
                style={{ display: "none" }}
                id="image-upload"
                type="file"
                onChange={handleImageUpload}
              />
              <label htmlFor="image-upload">
                <Button
                  variant="outlined"
                  component="span"
                  startIcon={<UploadIcon />}
                  fullWidth
                >
                  Upload Image
                </Button>
              </label>
            </Box>

            {imagePreview && (
              <Box sx={{ mt: 2 }}>
                <img
                  src={imagePreview}
                  alt="Preview"
                  style={{
                    maxWidth: "100%",
                    maxHeight: "200px",
                    objectFit: "contain",
                  }}
                />
              </Box>
            )}

            {uploadError && <Alert severity="error">{uploadError}</Alert>}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setUploadDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleUploadSubmit}
            variant="contained"
            disabled={uploading}
          >
            {uploading ? "Uploading..." : "Submit"}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default CarDesigns;
