import React, { useState } from "react";
import {
  Box,
  CssBaseline,
  Drawer,
  Toolbar,
  AppBar,
  Typography,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  Tooltip,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import HomeIcon from "@mui/icons-material/Home";
import CompareArrowsIcon from "@mui/icons-material/CompareArrows";
import InventoryIcon from "@mui/icons-material/Inventory";
import NotificationsIcon from "@mui/icons-material/Notifications";
import SettingsIcon from "@mui/icons-material/Settings";
import { Link, useLocation } from "react-router-dom";

interface AdminLayoutProps {
  children: React.ReactNode;
}

const DRAWER_WIDTH = 240;
const COLLAPSED_DRAWER_WIDTH = 72;

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleMouseEnter = () => {
    if (!isMobile) {
      setIsExpanded(true);
    }
  };

  const handleMouseLeave = () => {
    if (!isMobile) {
      setIsExpanded(false);
    }
  };

  const isCurrentRoute = (path: string) => location.pathname === path;

  const drawer = (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      <Toolbar
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-start",
          px: isExpanded ? 2 : 1.5,
          py: 2,
          minHeight: 64,
        }}
      >
        {isExpanded && (
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              color: "text.primary",
              transition: "opacity 0.2s",
              opacity: isExpanded ? 1 : 0,
            }}
          >
            Satisfactory
          </Typography>
        )}
      </Toolbar>

      <List sx={{ flex: 1, px: isExpanded ? 2 : 1 }}>
        <Tooltip title={!isExpanded ? "Dashboard" : ""} placement="right" arrow>
          <ListItemButton
            component={Link}
            to="/"
            selected={isCurrentRoute("/")}
            sx={{
              borderRadius: 2,
              mb: 1,
              justifyContent: isExpanded ? "flex-start" : "center",
              minHeight: 44,
              "& .MuiListItemIcon-root": {
                color: isCurrentRoute("/") ? "primary.main" : "text.secondary",
                minWidth: isExpanded ? 40 : 24,
                mr: isExpanded ? "auto" : 0,
              },
              "& .MuiListItemText-primary": {
                color: isCurrentRoute("/") ? "primary.main" : "text.primary",
                fontWeight: isCurrentRoute("/") ? 600 : 400,
                opacity: isExpanded ? 1 : 0,
                transition: "opacity 0.2s",
              },
            }}
          >
            <ListItemIcon>
              <HomeIcon />
            </ListItemIcon>
            <ListItemText primary="Dashboard" sx={{ ml: isExpanded ? 1 : 0 }} />
          </ListItemButton>
        </Tooltip>

        <Tooltip title={!isExpanded ? "Compare States" : ""} placement="right" arrow>
          <ListItemButton
            component={Link}
            to="/compare"
            selected={isCurrentRoute("/compare")}
            sx={{
              borderRadius: 2,
              mb: 1,
              justifyContent: isExpanded ? "flex-start" : "center",
              minHeight: 44,
              "& .MuiListItemIcon-root": {
                color: isCurrentRoute("/compare") ? "primary.main" : "text.secondary",
                minWidth: isExpanded ? 40 : 24,
                mr: isExpanded ? "auto" : 0,
              },
              "& .MuiListItemText-primary": {
                color: isCurrentRoute("/compare") ? "primary.main" : "text.primary",
                fontWeight: isCurrentRoute("/compare") ? 600 : 400,
                opacity: isExpanded ? 1 : 0,
                transition: "opacity 0.2s",
              },
            }}
          >
            <ListItemIcon>
              <CompareArrowsIcon />
            </ListItemIcon>
            <ListItemText primary="Compare States" sx={{ ml: isExpanded ? 1 : 0 }} />
          </ListItemButton>
        </Tooltip>

        <Tooltip title={!isExpanded ? "Resources" : ""} placement="right" arrow>
          <ListItemButton
            component={Link}
            to="/resources"
            selected={isCurrentRoute("/resources")}
            sx={{
              borderRadius: 2,
              mb: 1,
              justifyContent: isExpanded ? "flex-start" : "center",
              minHeight: 44,
              "& .MuiListItemIcon-root": {
                color: isCurrentRoute("/resources") ? "primary.main" : "text.secondary",
                minWidth: isExpanded ? 40 : 24,
                mr: isExpanded ? "auto" : 0,
              },
              "& .MuiListItemText-primary": {
                color: isCurrentRoute("/resources") ? "primary.main" : "text.primary",
                fontWeight: isCurrentRoute("/resources") ? 600 : 400,
                opacity: isExpanded ? 1 : 0,
                transition: "opacity 0.2s",
              },
            }}
          >
            <ListItemIcon>
              <InventoryIcon />
            </ListItemIcon>
            <ListItemText primary="Resources" sx={{ ml: isExpanded ? 1 : 0 }} />
          </ListItemButton>
        </Tooltip>
      </List>

      <Box
        sx={{
          p: isExpanded ? 2 : 1,
          borderTop: "1px solid",
          borderColor: "divider",
          transition: "padding 0.2s",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            justifyContent: isExpanded ? "flex-start" : "center",
          }}
        >
          <Avatar
            sx={{
              width: 32,
              height: 32,
              bgcolor: "primary.main",
            }}
          >
            JD
          </Avatar>
          {isExpanded && (
            <Box
              sx={{
                opacity: isExpanded ? 1 : 0,
                transition: "opacity 0.2s",
                whiteSpace: "nowrap",
              }}
            >
              <Typography variant="subtitle2" sx={{ color: "text.primary" }}>
                John Doe
              </Typography>
              <Typography variant="caption" sx={{ color: "text.secondary" }}>
                Administrator
              </Typography>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${isExpanded ? DRAWER_WIDTH : COLLAPSED_DRAWER_WIDTH}px)` },
          ml: { sm: isExpanded ? DRAWER_WIDTH : COLLAPSED_DRAWER_WIDTH },
          transition: "width 0.2s, margin-left 0.2s",
        }}
      >
        <Toolbar
          sx={{
            justifyContent: "space-between",
            backgroundColor: (theme) => theme.palette.background.paper,
          }}
        >
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>

          <Box sx={{ flex: 1 }} />

          <Box sx={{ display: "flex", gap: 1 }}>
            <IconButton
              size="small"
              sx={{
                color: "text.secondary",
                bgcolor: "action.hover",
                "&:hover": {
                  bgcolor: "action.selected",
                },
              }}
            >
              <NotificationsIcon fontSize="small" />
            </IconButton>
            <IconButton
              size="small"
              sx={{
                color: "text.secondary",
                bgcolor: "action.hover",
                "&:hover": {
                  bgcolor: "action.selected",
                },
              }}
            >
              <SettingsIcon fontSize="small" />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      <Box
        component="nav"
        sx={{
          width: { sm: isExpanded ? DRAWER_WIDTH : COLLAPSED_DRAWER_WIDTH },
          flexShrink: { sm: 0 },
          transition: "width 0.2s",
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: DRAWER_WIDTH,
              backgroundColor: "background.paper",
              borderRight: 1,
              borderColor: "divider",
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: isExpanded ? DRAWER_WIDTH : COLLAPSED_DRAWER_WIDTH,
              backgroundColor: "background.paper",
              borderRight: 1,
              borderColor: "divider",
              transition: "width 0.2s",
              overflowX: "hidden",
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { sm: `calc(100% - ${isExpanded ? DRAWER_WIDTH : COLLAPSED_DRAWER_WIDTH}px)` },
          mt: 8,
          transition: "width 0.2s",
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default AdminLayout;
