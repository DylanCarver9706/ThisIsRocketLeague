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
  Book as BookIcon,
  CheckCircle as CheckIcon,
  ArrowBack as BackIcon,
} from "@mui/icons-material";
import { termsService } from "../services";

const steps = ["Term Details", "Definition & Usage", "Review & Submit"];

const SubmitTerm = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    term: "",
    definition: "",
    category: "",
    exampleUsage: "",
    skillLevel: "",
    submittedBy: "",
  });

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (activeStep === 0) {
      if (!formData.term || !formData.category || !formData.skillLevel) {
        setError("Please fill in all required fields");
        return;
      }
    } else if (activeStep === 1) {
      if (!formData.definition || !formData.exampleUsage) {
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

      const response = await termsService.create(formData);

      if (response.success) {
        setSuccess(true);
        setTimeout(() => {
          navigate("/dictionary");
        }, 2000);
      }
    } catch (err) {
      console.error("Error submitting term:", err);
      setError(
        err.response?.data?.error || "Failed to submit term. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const isStepValid = (step) => {
    switch (step) {
      case 0:
        return formData.term && formData.category && formData.skillLevel;
      case 1:
        return formData.definition && formData.exampleUsage;
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
                label="Term *"
                value={formData.term}
                onChange={(e) => handleInputChange("term", e.target.value)}
                placeholder="e.g., Air Dribble, Flip Reset, Wave Dash"
                helperText="Enter the Rocket League term or phrase"
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
                  <MenuItem value="Mechanics">Mechanics</MenuItem>
                  <MenuItem value="Slang">Slang</MenuItem>
                  <MenuItem value="Strategy">Strategy</MenuItem>
                  <MenuItem value="Tactics">Tactics</MenuItem>
                  <MenuItem value="Equipment">Equipment</MenuItem>
                  <MenuItem value="Other">Other</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>Skill Level *</InputLabel>
                <Select
                  value={formData.skillLevel}
                  label="Skill Level *"
                  onChange={(e) =>
                    handleInputChange("skillLevel", e.target.value)
                  }
                >
                  <MenuItem value="Beginner">Beginner</MenuItem>
                  <MenuItem value="Intermediate">Intermediate</MenuItem>
                  <MenuItem value="Pro">Pro</MenuItem>
                </Select>
              </FormControl>
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
                label="Definition *"
                value={formData.definition}
                onChange={(e) =>
                  handleInputChange("definition", e.target.value)
                }
                multiline
                rows={4}
                placeholder="Provide a clear and concise definition of the term"
                helperText="Explain what this term means in Rocket League"
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Example Usage *"
                value={formData.exampleUsage}
                onChange={(e) =>
                  handleInputChange("exampleUsage", e.target.value)
                }
                multiline
                rows={3}
                placeholder="e.g., 'I just hit a perfect air dribble from midfield to score!'"
                helperText="Provide an example of how this term is used in context"
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
                      {formData.term}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Category:</strong> {formData.category}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Skill Level:</strong> {formData.skillLevel}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      <strong>Definition:</strong> {formData.definition}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography
                      variant="body2"
                      sx={{ fontStyle: "italic", mt: 1 }}
                    >
                      <strong>Example:</strong> "{formData.exampleUsage}"
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
              Term Submitted Successfully!
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Your term "{formData.term}" has been added to the dictionary.
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Redirecting to dictionary...
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
          <BookIcon color="primary" />
          Submit New Term
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Help expand our Rocket League dictionary by submitting new terms
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
                  {loading ? "Submitting..." : "Submit Term"}
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

export default SubmitTerm;
