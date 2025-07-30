import React, { useState } from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Card,
  CardContent,
  Grid,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Chip,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import {
  AdminPanelSettings as AdminIcon,
  CheckCircle as ApproveIcon,
  Cancel as RejectIcon,
} from "@mui/icons-material";
import adminService from "../services/adminService";
import TaggedText from "../components/TaggedText";

const Admin = () => {
  const [adminKey, setAdminKey] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState(null);
  const [submissions, setSubmissions] = useState({
    terms: [],
    records: [],
    carDesigns: [],
  });
  const [currentTab, setCurrentTab] = useState(0);
  const [selectedStatus, setSelectedStatus] = useState("review");
  const [statusDialog, setStatusDialog] = useState({
    open: false,
    submission: null,
    newStatus: "",
  });

  const handleLogin = async () => {
    if (!adminKey.trim()) {
      setError("Please enter an admin key");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await adminService.verifyAccess(adminKey);
      setIsAuthenticated(true);
      fetchDashboardData();
    } catch (err) {
      setError("Invalid admin key");
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  const fetchDashboardData = async () => {
    try {
      const [statsResponse, submissionsResponse] = await Promise.all([
        adminService.getDashboardStats(adminKey),
        adminService.getAllSubmissions(adminKey),
      ]);
      setStats(statsResponse.data);
      setSubmissions(submissionsResponse.data);
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      setError("Failed to load dashboard data");
    }
  };

  const handleStatusUpdate = async (submission, newStatus) => {
    try {
      // Determine type based on current tab
      const typeMap = ["terms", "records", "carDesigns"];
      const type = typeMap[currentTab];

      await adminService.updateSubmissionStatus(
        submission._id,
        type,
        newStatus,
        adminKey
      );
      setStatusDialog({ open: false, submission: null, newStatus: "" });
      fetchDashboardData();
    } catch (err) {
      console.error("Error updating status:", err);
      setError("Failed to update submission status");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "published":
        return "success";
      case "review":
        return "warning";
      case "rejected":
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
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (!isAuthenticated) {
    return (
      <Container maxWidth="sm" sx={{ py: 8 }}>
        <Card>
          <CardContent sx={{ textAlign: "center", py: 4 }}>
            <AdminIcon sx={{ fontSize: 60, color: "primary.main", mb: 2 }} />
            <Typography variant="h4" component="h1" gutterBottom>
              Admin Access
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              Enter your admin key to access the admin panel
            </Typography>

            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}

            <TextField
              fullWidth
              type="password"
              label="Admin Key"
              value={adminKey}
              onChange={(e) => setAdminKey(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleLogin()}
              autoFocus
              sx={{ mb: 3 }}
            />

            <Button
              variant="contained"
              size="large"
              onClick={handleLogin}
              disabled={loading}
              fullWidth
            >
              {loading ? "Verifying..." : "Access Admin Panel"}
            </Button>
          </CardContent>
        </Card>
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
          <AdminIcon color="primary" />
          Admin Dashboard
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Manage submissions and content
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {stats && (
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {["terms", "records", "carDesigns"].map((section) => (
            <Grid item xs={12} md={4} key={section}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {section === "carDesigns"
                      ? "Car Designs"
                      : section.charAt(0).toUpperCase() + section.slice(1)}
                  </Typography>
                  <Grid container spacing={2}>
                    {["total", "review", "published"].map((key) => (
                      <Grid item xs={4} key={key}>
                        <Typography
                          variant="h4"
                          color={
                            key === "review"
                              ? "warning.main"
                              : key === "published"
                              ? "success.main"
                              : "primary"
                          }
                        >
                          {stats[section][key]}
                        </Typography>
                        <Typography variant="body2">
                          {key.charAt(0).toUpperCase() + key.slice(1)}
                        </Typography>
                      </Grid>
                    ))}
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <Card>
        <CardContent>
          <Tabs
            value={currentTab}
            onChange={(e, newValue) => setCurrentTab(newValue)}
            sx={{ mb: 3 }}
          >
            <Tab label="Terms" />
            <Tab label="Records" />
            <Tab label="Car Designs" />
          </Tabs>

          <Box sx={{ mb: 3 }}>
            <FormControl sx={{ minWidth: 200 }}>
              <InputLabel>Filter by Status</InputLabel>
              <Select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                label="Filter by Status"
              >
                <MenuItem value="review">Review</MenuItem>
                <MenuItem value="published">Published</MenuItem>
                <MenuItem value="rejected">Rejected</MenuItem>
              </Select>
            </FormControl>
          </Box>

          <List>
            {(currentTab === 0
              ? submissions.terms
              : currentTab === 1
              ? submissions.records
              : submissions.carDesigns
            )
              .filter((item) => item.status === selectedStatus)
              .map((submission) => (
                <ListItem
                  key={submission._id}
                  sx={{
                    border: 1,
                    borderColor: "divider",
                    borderRadius: 1,
                    mb: 1,
                  }}
                >
                  <ListItemText
                    primary={
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <Typography variant="h6">
                          {submission.term || submission.title}
                        </Typography>
                        <Chip
                          label={submission.status}
                          color={getStatusColor(submission.status)}
                          size="small"
                        />
                      </Box>
                    }
                    secondary={
                      <Box>
                        <TaggedText
                          text={submission.definition || submission.description}
                          tags={submission.tags}
                          variant="body2"
                          sx={{ mb: 1 }}
                        />
                        {submission.image && (
                          <Box sx={{ mb: 1 }}>
                            <img
                              src={submission.image}
                              alt={submission.title}
                              style={{
                                maxWidth: "200px",
                                maxHeight: "150px",
                                objectFit: "contain",
                              }}
                            />
                          </Box>
                        )}
                        <Typography variant="caption" color="text.secondary">
                          Submitted by: {submission.submittedBy} |{" "}
                          {formatDate(submission.createdAt)}
                        </Typography>
                      </Box>
                    }
                  />
                  <ListItemSecondaryAction>
                    <Box sx={{ display: "flex", gap: 1 }}>
                      {submission.status === "review" && (
                        <>
                          <IconButton
                            color="success"
                            onClick={() =>
                              setStatusDialog({
                                open: true,
                                submission,
                                newStatus: "published",
                              })
                            }
                          >
                            <ApproveIcon />
                          </IconButton>
                          <IconButton
                            color="error"
                            onClick={() =>
                              setStatusDialog({
                                open: true,
                                submission,
                                newStatus: "rejected",
                              })
                            }
                          >
                            <RejectIcon />
                          </IconButton>
                        </>
                      )}
                    </Box>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
          </List>

          {(currentTab === 0
            ? submissions.terms
            : currentTab === 1
            ? submissions.records
            : submissions.carDesigns
          ).filter((item) => item.status === selectedStatus).length === 0 && (
            <Box sx={{ textAlign: "center", py: 4 }}>
              <Typography variant="h6" color="text.secondary">
                No {selectedStatus} submissions found
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>

      <Dialog
        open={statusDialog.open}
        onClose={() =>
          setStatusDialog({ open: false, submission: null, newStatus: "" })
        }
      >
        <DialogTitle>Update Submission Status</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to mark this submission as{" "}
            <strong>{statusDialog.newStatus}</strong>?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() =>
              setStatusDialog({ open: false, submission: null, newStatus: "" })
            }
          >
            Cancel
          </Button>
          <Button
            onClick={() =>
              handleStatusUpdate(
                statusDialog.submission,
                statusDialog.newStatus
              )
            }
            color={statusDialog.newStatus === "published" ? "success" : "error"}
            variant="contained"
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Admin;
