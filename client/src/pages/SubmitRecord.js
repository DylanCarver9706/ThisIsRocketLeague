import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  Card,
  CardContent,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Box,
  Alert,
  Stepper,
  Step,
  StepLabel,
  Grid,
} from "@mui/material";
import {
  EmojiEvents as TrophyIcon,
  CheckCircle as CheckIcon,
  ArrowBack as BackIcon,
} from "@mui/icons-material";
import { recordsService } from "../services";

const steps = ["Record Details", "Proof & Achievement", "Review & Submit"];

const SubmitRecord = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    recordHolderName: "",
    proofUrl: "",
    dateAchieved: "",
    submittedBy: "",
  });

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (activeStep === 0) {
      if (!formData.title || !formData.category || !formData.recordHolderName) {
        setError("Please fill in all required fields");
        return;
      }
    } else if (activeStep === 1) {
      if (
        !formData.description ||
        !formData.proofUrl ||
        !formData.dateAchieved
      ) {
        setError("Please fill in all required fields");
        return;
      }
    }
    setError(null);
    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await recordsService.create(formData);

      if (response.success) {
        setSuccess(true);
        setTimeout(() => {
          navigate("/world-records");
        }, 2000);
      }
    } catch (err) {
      console.error("Error submitting record:", err);
      setError(
        err.response?.data?.error ||
          "Failed to submit record. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const isStepValid = (step) => {
    switch (step) {
      case 0:
        return formData.title && formData.category && formData.recordHolderName;
      case 1:
        return (
          formData.description && formData.proofUrl && formData.dateAchieved
        );
      default:
        return true;
    }
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Record Title *"
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                placeholder="e.g., Fastest Goal from Kickoff, Longest Air Dribble"
                helperText="Enter a descriptive title for the world record"
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>Category *</InputLabel>
                <Select
                  value={formData.category}
                  label="Category *"
                  onChange={(e) =>
                    handleInputChange("category", e.target.value)
                  }
                >
                  <MenuItem value="Fastest Goal">Fastest Goal</MenuItem>
                  <MenuItem value="Longest Air Dribble">
                    Longest Air Dribble
                  </MenuItem>
                  <MenuItem value="Highest MMR">Highest MMR</MenuItem>
                  <MenuItem value="Most Goals in Match">
                    Most Goals in Match
                  </MenuItem>
                  <MenuItem value="Longest Win Streak">
                    Longest Win Streak
                  </MenuItem>
                  <MenuItem value="Fastest Aerial Goal">
                    Fastest Aerial Goal
                  </MenuItem>
                  <MenuItem value="Most Saves in Match">
                    Most Saves in Match
                  </MenuItem>
                  <MenuItem value="Other">Other</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Record Holder Name *"
                value={formData.recordHolderName}
                onChange={(e) =>
                  handleInputChange("recordHolderName", e.target.value)
                }
                placeholder="Enter the player's name"
                helperText="Who achieved this record?"
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Your Name (Optional)"
                value={formData.submittedBy}
                onChange={(e) =>
                  handleInputChange("submittedBy", e.target.value)
                }
                placeholder="Leave blank to submit anonymously"
                helperText="This will be displayed as the contributor"
              />
            </Grid>
          </Grid>
        );

      case 1:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description *"
                value={formData.description}
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
                multiline
                rows={4}
                placeholder="Provide a detailed description of the achievement"
                helperText="Explain what makes this record special and how it was achieved"
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Proof URL *"
                value={formData.proofUrl}
                onChange={(e) => handleInputChange("proofUrl", e.target.value)}
                placeholder="https://www.youtube.com/watch?v=..."
                helperText="Link to video proof (YouTube, Twitch, etc.)"
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Date Achieved *"
                type="date"
                value={formData.dateAchieved}
                onChange={(e) =>
                  handleInputChange("dateAchieved", e.target.value)
                }
                InputLabelProps={{
                  shrink: true,
                }}
                helperText="When was this record achieved?"
                required
              />
            </Grid>
          </Grid>
        );

      case 2:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Review Your Submission
            </Typography>
            <Card variant="outlined" sx={{ mb: 3 }}>
              <CardContent>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Typography
                      variant="subtitle1"
                      color="primary"
                      fontWeight="bold"
                    >
                      {formData.title}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Category:</strong> {formData.category}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Record Holder:</strong>{" "}
                      {formData.recordHolderName}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      <strong>Description:</strong> {formData.description}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="body2" color="primary" sx={{ mt: 1 }}>
                      <strong>Proof:</strong> {formData.proofUrl}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Achieved:</strong> {formData.dateAchieved}
                    </Typography>
                  </Grid>
                  {formData.submittedBy && (
                    <Grid item xs={12}>
                      <Typography variant="body2" color="text.secondary">
                        <strong>Submitted by:</strong> {formData.submittedBy}
                      </Typography>
                    </Grid>
                  )}
                </Grid>
              </CardContent>
            </Card>
          </Box>
        );

      default:
        return null;
    }
  };

  if (success) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Card>
          <CardContent sx={{ textAlign: "center", py: 4 }}>
            <CheckIcon color="success" sx={{ fontSize: 64, mb: 2 }} />
            <Typography variant="h4" gutterBottom color="success.main">
              Record Submitted Successfully!
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Your record "{formData.title}" has been submitted and is under
              review.
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              It will be published once approved by our team.
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Redirecting to world records...
            </Typography>
          </CardContent>
        </Card>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h3"
          component="h1"
          gutterBottom
          sx={{ display: "flex", alignItems: "center", gap: 2 }}
        >
          <TrophyIcon color="primary" />
          Submit New World Record
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Share incredible Rocket League achievements with the community
        </Typography>
      </Box>

      {/* Stepper */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
            {steps.map((label, index) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          {renderStepContent(activeStep)}

          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 4 }}>
            <Button
              disabled={activeStep === 0}
              onClick={handleBack}
              startIcon={<BackIcon />}
            >
              Back
            </Button>
            <Box>
              {activeStep === steps.length - 1 ? (
                <Button
                  variant="contained"
                  onClick={handleSubmit}
                  disabled={loading}
                  startIcon={loading ? null : <CheckIcon />}
                >
                  {loading ? "Submitting..." : "Submit Record"}
                </Button>
              ) : (
                <Button
                  variant="contained"
                  onClick={handleNext}
                  disabled={!isStepValid(activeStep)}
                >
                  Next
                </Button>
              )}
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};

export default SubmitRecord;
