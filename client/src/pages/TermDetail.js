import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  Box,
  Chip,
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
} from "@mui/icons-material";
import { termsService } from "../services";
import TaggedText from "../components/TaggedText";

const TermDetail = () => {
  const { slug } = useParams();
  const [term, setTerm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTerm = async () => {
      try {
        setLoading(true);
        const response = await termsService.getBySlug(slug);
        setTerm(response.data);
      } catch (err) {
        console.error("Error fetching term:", err);
        setError("Failed to load term details");
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchTerm();
    }
  }, [slug]);

  const handleLike = async () => {
    try {
      if (term.isLiked) {
        // Unlike
        await termsService.unlike(term._id);
        setTerm((prev) => ({
          ...prev,
          likeCount: prev.likeCount - 1,
          isLiked: false,
        }));
      } else {
        // Like
        await termsService.like(term._id);
        setTerm((prev) => ({
          ...prev,
          likeCount: prev.likeCount + 1,
          isLiked: true,
        }));
      }
    } catch (err) {
      console.error("Error toggling like:", err);
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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

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

  if (error || !term) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error || "Term not found"}
        </Alert>
        <Button
          component={Link}
          to="/dictionary"
          startIcon={<ArrowBackIcon />}
          variant="outlined"
        >
          Back to Dictionary
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
            to="/dictionary"
            startIcon={<ArrowBackIcon />}
            variant="text"
            color="inherit"
          >
            Dictionary
          </Button>
          <Typography color="text.primary">{term.title}</Typography>
        </Breadcrumbs>
      </Box>

      {/* Term Details */}
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
                {term.title}
              </Typography>
              <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
                <Chip
                  label={term.skillLevel}
                  color={getSkillLevelColor(term.skillLevel)}
                  size="medium"
                />
                <Chip
                  label={term.category}
                  color={getCategoryColor(term.category)}
                  variant="outlined"
                  size="medium"
                />
              </Box>
            </Box>
            <Tooltip
              title={term.isLiked ? "Click to unlike" : "Like this term"}
            >
              <IconButton
                size="large"
                onClick={handleLike}
                color={term.isLiked ? "primary" : "default"}
                sx={{ ml: 2 }}
              >
                <LikeIcon fontSize="large" />
              </IconButton>
            </Tooltip>
          </Box>

          {/* Definition */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
              Definition
            </Typography>
            <TaggedText
              text={term.definition}
              tags={term.tags}
              variant="body1"
              sx={{ fontSize: "1.1rem", lineHeight: 1.6 }}
            />
          </Box>

          {/* Example Usage */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
              Example Usage
            </Typography>
            <TaggedText
              text={`"${term.exampleUsage}"`}
              tags={term.tags}
              variant="body1"
              sx={{
                fontSize: "1.1rem",
                fontStyle: "italic",
                color: "text.secondary",
                backgroundColor: "grey.50",
                p: 2,
                borderRadius: 1,
                borderLeft: 4,
                borderColor: "primary.main",
              }}
            />
          </Box>

          {/* Metadata */}
          <Box
            sx={{
              display: "flex",
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
                Submitted by: <strong>{term.submittedBy}</strong>
              </Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <CalendarIcon color="action" />
              <Typography variant="body2" color="text.secondary">
                Added: <strong>{formatDate(term.createdAt)}</strong>
              </Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <LikeIcon color="action" />
              <Typography variant="body2" color="text.secondary">
                <strong>{term.likeCount}</strong> likes
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};

export default TermDetail;
