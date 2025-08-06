import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Box,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import {
  Menu as MenuIcon,
  SportsEsports as GameIcon,
  Book as BookIcon,
  EmojiEvents as TrophyIcon,
  // Download as DownloadIcon,
  DirectionsCar as CarIcon,
} from "@mui/icons-material";

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const location = useLocation();

  const navItems = [
    { text: "Home", path: "/", icon: <GameIcon /> },
    { text: "Dictionary", path: "/dictionary", icon: <BookIcon /> },
    { text: "World Records", path: "/world-records", icon: <TrophyIcon /> },
    { text: "Car Designs", path: "/car-designs", icon: <CarIcon /> },
    // { text: "Best Plugins", path: "/plugins", icon: <DownloadIcon /> }, Deprecated for now due to prod instance not working, but dev will
  ];

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const isActive = (path) => location.pathname === path;

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: "center" }}>
      <Typography
        variant="h6"
        sx={{ my: 2, color: "primary.main", fontWeight: "bold" }}
      >
        This Is Rocket League
      </Typography>
      <List>
        {navItems.map((item) => (
          <ListItem
            key={item.text}
            component={Link}
            to={item.path}
            sx={{
              color: isActive(item.path) ? "primary.main" : "text.primary",
              "&:hover": {
                backgroundColor: "primary.light",
                color: "white",
              },
            }}
          >
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <>
      <AppBar
        position="fixed"
        sx={{
          backgroundColor: "white",
          color: "text.primary",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: "none" } }}
          >
            <MenuIcon />
          </IconButton>

          <Typography
            variant="h6"
            component={Link}
            to="/"
            sx={{
              flexGrow: 1,
              textDecoration: "none",
              color: "primary.main",
              fontWeight: "bold",
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            This Is Rocket League
          </Typography>

          {!isMobile && (
            <Box sx={{ display: "flex", gap: 1 }}>
              {navItems.map((item) => (
                <Button
                  key={item.text}
                  component={Link}
                  to={item.path}
                  sx={{
                    color: isActive(item.path)
                      ? "primary.main"
                      : "text.primary",
                    fontWeight: isActive(item.path) ? "bold" : "normal",
                    "&:hover": {
                      backgroundColor: "primary.light",
                      color: "white",
                    },
                  }}
                >
                  {item.text}
                </Button>
              ))}
            </Box>
          )}
        </Toolbar>
      </AppBar>

      <Box component="nav">
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: "block", md: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: 240,
            },
          }}
        >
          {drawer}
        </Drawer>
      </Box>
    </>
  );
};

export default Navbar;
