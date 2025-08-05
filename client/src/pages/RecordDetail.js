import React, { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  Box,
  Skeleton,
  Alert,
  IconButton,
  Tooltip,
  Breadcrumbs,
} from "@mui/material";
import {
  ArrowBack as ArrowBackIcon,
  ThumbUp as LikeIcon,
  Person as PersonIcon,
  CalendarToday as CalendarIcon,
  PlayArrow as PlayIcon,
} from "@mui/icons-material";
import { recordsService } from "../services";

const RecordDetail = () => {
  const { slug } = useParams();
  const [record, setRecord] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const hasFetched = useRef(false);

  useEffect(() => {
    if (hasFetched.current) return;

    const fetchRecord = async () => {
      try {
        setLoading(true);
        const response = await recordsService.getBySlug(slug);
        setRecord(response.data);
      } catch (err) {
        console.error("Error fetching record:", err);
        setError("Failed to load record details");
      } finally {
        setLoading(false);
      }
    };

    hasFetched.current = true;
    fetchRecord();
  }, [slug]);

  const handleLike = async () => {
    try {
      if (record.isLiked) {
        // Unlike
        await recordsService.unlike(record._id);
        setRecord((prev) => ({
          ...prev,
          likeCount: prev.likeCount - 1,
          isLiked: false,
        }));
      } else {
        // Like
        await recordsService.like(record._id);
        setRecord((prev) => ({
          ...prev,
          likeCount: prev.likeCount + 1,
          isLiked: true,
        }));
      }
    } catch (err) {
      console.error("Error toggling like:", err);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getYouTubeVideoId = (url) => {
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  const videoId = record?.proofUrl ? getYouTubeVideoId(record.proofUrl) : null;

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Box sx={{ mb: 3 }}>
          <Skeleton variant="text" width="200px" height={32} />
        </Box>
        <Card>
          <CardContent>
            <Skeleton variant="text" width="60%" height={48} />
            <Skeleton variant="text" width="100%" height={24} />
            <Skeleton variant="text" width="80%" height={24} />
            <Skeleton variant="text" width="60%" height={24} />
            <Box sx={{ mt: 2 }}>
              <Skeleton variant="text" width="40%" height={32} />
            </Box>
          </CardContent>
        </Card>
      </Container>
    );
  }

  if (error || !record) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error || "Record not found"}
        </Alert>
        <Button
          component={Link}
          to="/world-records"
          startIcon={<ArrowBackIcon />}
          variant="outlined"
        >
          Back to World Records
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      {/* Breadcrumbs */}
      <Box sx={{ mb: 3 }}>
        <Breadcrumbs aria-label="breadcrumb">
          <Button
            component={Link}
            to="/world-records"
            startIcon={<ArrowBackIcon />}
            variant="text"
            color="inherit"
          >
            World Records
          </Button>
          <Typography color="text.primary">{record.title}</Typography>
        </Breadcrumbs>
      </Box>

      {/* Record Details */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          {/* Header */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              mb: 3,
            }}
          >
            <Box sx={{ flex: 1 }}>
              <Typography
                variant="h3"
                component="h1"
                gutterBottom
                sx={{ fontWeight: "bold", color: "primary.main" }}
              >
                {record.title}
              </Typography>
            </Box>
          </Box>

          {/* Record Holder */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
              Record Holder
            </Typography>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                p: 2,
                backgroundColor: "grey.50",
                borderRadius: 1,
                borderLeft: 4,
                borderColor: "primary.main",
              }}
            >
              <PersonIcon color="primary" />
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                {record.recordHolderName}
              </Typography>
            </Box>
          </Box>

          {/* Description */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
              Description
            </Typography>
            <Typography
              variant="body1"
              sx={{ fontSize: "1.1rem", lineHeight: 1.6 }}
            >
              {record.description}
            </Typography>
          </Box>

          {/* Video */}
          {videoId && (
            <Box sx={{ mb: 2 }}>
              <Box
                sx={{
                  position: "relative",
                  width: "100%",
                  height: 0,
                  paddingBottom: "56.25%", // 16:9 aspect ratio
                  mb: 2,
                }}
              >
                <iframe
                  src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
                  title="Record Video"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    borderRadius: "8px",
                  }}
                />
              </Box>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mt: 1,
                }}
              >
                <Button
                  component="a"
                  href={record.proofUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="outlined"
                  sx={{ borderColor: "primary.main" }}
                  startIcon={<PlayIcon />}
                >
                  Watch on YouTube
                </Button>
                <Box
                  sx={{
                    display: { xs: "flex", sm: "none" },
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  <Box
                    sx={{
                      border: 1,
                      borderColor: "primary.main",
                      borderRadius: 1,
                      px: 1,
                      py: 0.5,
                      display: "flex",
                      alignItems: "center",
                      gap: 0.5,
                      minWidth: "fit-content",
                    }}
                  >
                    <Typography variant="body1" color="text.secondary">
                      <strong>{record.likeCount}</strong> likes
                    </Typography>
                    <Tooltip
                      title={
                        record.isLiked ? "Click to unlike" : "Like this record"
                      }
                    >
                      <IconButton
                        size="small"
                        onClick={handleLike}
                        sx={{
                          color: record.isLiked ? "#ff9800" : "default",
                          p: 0.5,
                        }}
                      >
                        <LikeIcon fontSize="medium" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Box>
              </Box>
            </Box>
          )}

          {/* Metadata */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 3,
              pt: 3,
              borderTop: 1,
              borderColor: "divider",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <PersonIcon color="action" />
              <Typography variant="body2" color="text.secondary">
                Submitted by: <strong>{record.submittedBy}</strong>
              </Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <CalendarIcon color="action" />
              <Typography variant="body2" color="text.secondary">
                Achieved: <strong>{formatDate(record.dateAchieved)}</strong>
              </Typography>
            </Box>
            <Box
              sx={{
                display: { xs: "none", sm: "flex" },
                alignItems: "center",
                gap: 1,
              }}
            >
              <Box
                sx={{
                  border: 1,
                  borderColor: "primary.main",
                  borderRadius: 1,
                  px: 1,
                  py: 0.5,
                  display: "flex",
                  alignItems: "center",
                  gap: 0.5,
                  minWidth: "fit-content",
                }}
              >
                <Typography variant="body1" color="text.secondary">
                  <strong>{record.likeCount}</strong> likes
                </Typography>
                <Tooltip
                  title={
                    record.isLiked ? "Click to unlike" : "Like this record"
                  }
                >
                  <IconButton
                    size="small"
                    onClick={handleLike}
                    sx={{
                      color: record.isLiked ? "#ff9800" : "default",
                      p: 0.5,
                    }}
                  >
                    <LikeIcon fontSize="medium" />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};

export default RecordDetail;
