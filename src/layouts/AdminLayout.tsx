import React from "react";
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

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const location = useLocation();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const isCurrentRoute = (path: string) => location.pathname === path;

  const drawer = (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Toolbar
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-start",
          px: 2,
          py: 2,
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
            color: "text.primary",
          }}
        >
          Satisfactory
        </Typography>
      </Toolbar>

      <List sx={{ flex: 1, px: 2 }}>
        <ListItemButton
          component={Link}
          to="/"
          selected={isCurrentRoute("/")}
          sx={{
            borderRadius: 2,
            mb: 1,
            "& .MuiListItemIcon-root": {
              color: isCurrentRoute("/") ? "primary.main" : "text.secondary",
              minWidth: 40,
            },
            "& .MuiListItemText-primary": {
              color: isCurrentRoute("/") ? "primary.main" : "text.primary",
              fontWeight: isCurrentRoute("/") ? 600 : 400,
            },
          }}
        >
          <ListItemIcon>
            <HomeIcon />
          </ListItemIcon>
          <ListItemText primary="Dashboard" />
        </ListItemButton>

        <ListItemButton
          component={Link}
          to="/compare"
          selected={isCurrentRoute("/compare")}
          sx={{
            borderRadius: 2,
            mb: 1,
            "& .MuiListItemIcon-root": {
              color: isCurrentRoute("/compare") ? "primary.main" : "text.secondary",
              minWidth: 40,
            },
            "& .MuiListItemText-primary": {
              color: isCurrentRoute("/compare") ? "primary.main" : "text.primary",
              fontWeight: isCurrentRoute("/compare") ? 600 : 400,
            },
          }}
        >
          <ListItemIcon>
            <CompareArrowsIcon />
          </ListItemIcon>
          <ListItemText primary="Compare States" />
        </ListItemButton>

        <ListItemButton
          component={Link}
          to="/resources"
          selected={isCurrentRoute("/resources")}
          sx={{
            borderRadius: 2,
            mb: 1,
            "& .MuiListItemIcon-root": {
              color: isCurrentRoute("/resources") ? "primary.main" : "text.secondary",
              minWidth: 40,
            },
            "& .MuiListItemText-primary": {
              color: isCurrentRoute("/resources") ? "primary.main" : "text.primary",
              fontWeight: isCurrentRoute("/resources") ? 600 : 400,
            },
          }}
        >
          <ListItemIcon>
            <InventoryIcon />
          </ListItemIcon>
          <ListItemText primary="Resources" />
        </ListItemButton>
      </List>

      <Box
        sx={{
          p: 2,
          borderTop: "1px solid",
          borderColor: "divider",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
          <Avatar
            sx={{
              width: 32,
              height: 32,
              bgcolor: "primary.main",
            }}
          >
            JD
          </Avatar>
          <Box>
            <Typography variant="subtitle2" sx={{ color: "text.primary" }}>
              John Doe
            </Typography>
            <Typography variant="caption" sx={{ color: "text.secondary" }}>
              Administrator
            </Typography>
          </Box>
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
          width: { sm: `calc(100% - 240px)` },
          ml: { sm: `240px` },
        }}
      >
        <Toolbar sx={{ justifyContent: "space-between" }}>
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
                bgcolor: "rgba(42, 62, 80, 0.8)",
                backdropFilter: "blur(10px)",
                "&:hover": { bgcolor: "rgba(42, 62, 80, 0.95)" },
              }}
            >
              <NotificationsIcon fontSize="small" />
            </IconButton>
            <IconButton
              size="small"
              sx={{
                bgcolor: "rgba(42, 62, 80, 0.8)",
                backdropFilter: "blur(10px)",
                "&:hover": { bgcolor: "rgba(42, 62, 80, 0.95)" },
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
          width: { sm: 240 },
          flexShrink: { sm: 0 },
        }}
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
              width: 240,
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
              width: 240,
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
          width: { sm: `calc(100% - 240px)` },
          mt: 8,
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default AdminLayout;
