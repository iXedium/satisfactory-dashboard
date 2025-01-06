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
  ListItem,
  ListItemIcon,
  ListItemText,
  Switch,
  useTheme,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import HomeIcon from "@mui/icons-material/Home";
import CompareArrowsIcon from "@mui/icons-material/CompareArrows";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import { Link, useLocation } from "react-router-dom";
import { useThemeContext } from "../context/ThemeContext";

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const { toggleTheme, mode } = useThemeContext();
  const location = useLocation();
  const theme = useTheme();

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
        background: "linear-gradient(180deg, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.2) 100%)",
      }}
    >
      <Toolbar
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          py: 2,
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
            background: "linear-gradient(45deg, #00E5FF, #5EFFFF)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Satisfactory
        </Typography>
      </Toolbar>

      <List sx={{ flex: 1, px: 2 }}>
        <ListItem
          component={Link}
          to="/"
          sx={{
            borderRadius: 2,
            mb: 1,
            background: isCurrentRoute("/")
              ? "linear-gradient(45deg, rgba(0,229,255,0.15), rgba(94,255,255,0.15))"
              : "transparent",
            "& .MuiListItemIcon-root": {
              color: isCurrentRoute("/") ? "primary.main" : "text.secondary",
            },
            "& .MuiListItemText-primary": {
              color: isCurrentRoute("/") ? "primary.main" : "text.primary",
              fontWeight: isCurrentRoute("/") ? 600 : 400,
            },
            "&:hover": {
              background: "linear-gradient(45deg, rgba(0,229,255,0.1), rgba(94,255,255,0.1))",
            },
          }}
        >
          <ListItemIcon>
            <HomeIcon />
          </ListItemIcon>
          <ListItemText primary="Dashboard" />
        </ListItem>

        <ListItem
          component={Link}
          to="/compare"
          sx={{
            borderRadius: 2,
            mb: 1,
            background: isCurrentRoute("/compare")
              ? "linear-gradient(45deg, rgba(0,229,255,0.15), rgba(94,255,255,0.15))"
              : "transparent",
            "& .MuiListItemIcon-root": {
              color: isCurrentRoute("/compare") ? "primary.main" : "text.secondary",
            },
            "& .MuiListItemText-primary": {
              color: isCurrentRoute("/compare") ? "primary.main" : "text.primary",
              fontWeight: isCurrentRoute("/compare") ? 600 : 400,
            },
            "&:hover": {
              background: "linear-gradient(45deg, rgba(0,229,255,0.1), rgba(94,255,255,0.1))",
            },
          }}
        >
          <ListItemIcon>
            <CompareArrowsIcon />
          </ListItemIcon>
          <ListItemText primary="Compare States" />
        </ListItem>
      </List>

      <Box
        sx={{
          p: 2,
          borderTop: "1px solid",
          borderColor: "rgba(255,255,255,0.1)",
          display: "flex",
          alignItems: "center",
          gap: 2,
        }}
      >
        <DarkModeIcon sx={{ color: "text.secondary" }} />
        <Switch
          checked={mode === "dark"}
          onChange={toggleTheme}
          sx={{
            "& .MuiSwitch-switchBase.Mui-checked": {
              color: theme.palette.primary.main,
            },
            "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
              backgroundColor: theme.palette.primary.main,
            },
          }}
        />
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          width: { sm: `calc(100% - 240px)` },
          ml: { sm: `240px` },
          backdropFilter: "blur(10px)",
          background: "rgba(0,0,0,0.5)",
          borderBottom: "1px solid",
          borderColor: "rgba(255,255,255,0.1)",
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{
              mr: 2,
              display: { sm: "none" },
              "&:hover": {
                background: "rgba(255,255,255,0.1)",
              },
            }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{
              background: "linear-gradient(45deg, #00E5FF, #5EFFFF)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              fontWeight: 700,
            }}
          >
            Dashboard
          </Typography>
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
              border: "none",
              background: "linear-gradient(180deg, #1A1A1A 0%, #2D2D2D 100%)",
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
              border: "none",
              background: "linear-gradient(180deg, #1A1A1A 0%, #2D2D2D 100%)",
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
          p: 3,
          width: { sm: `calc(100% - 240px)` },
          minHeight: "100vh",
          background: "linear-gradient(135deg, #1A1A1A 0%, #2D2D2D 100%)",
        }}
      >
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
};

export default AdminLayout;
