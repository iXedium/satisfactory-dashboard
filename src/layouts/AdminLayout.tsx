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
  Collapse,
  Divider,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import HomeIcon from "@mui/icons-material/Home";
import CompareArrowsIcon from "@mui/icons-material/CompareArrows";
import InventoryIcon from "@mui/icons-material/Inventory";
import NotificationsIcon from "@mui/icons-material/Notifications";
import SettingsIcon from "@mui/icons-material/Settings";
import BarChartIcon from "@mui/icons-material/BarChart";
import ExtensionIcon from "@mui/icons-material/Extension";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import { Link, useLocation } from "react-router-dom";

interface AdminLayoutProps {
  children: React.ReactNode;
}

const DRAWER_WIDTH = 240;
const COLLAPSED_DRAWER_WIDTH = 56;

interface NavItem {
  title: string;
  path: string;
  icon: React.ReactNode;
  children?: NavItem[];
}

const mainNavItems: NavItem[] = [
  {
    title: "Dashboard",
    path: "/",
    icon: <HomeIcon />,
  },
  {
    title: "Orders",
    path: "/orders",
    icon: <InventoryIcon />,
  },
];

const analyticsNavItems: NavItem[] = [
  {
    title: "Reports",
    path: "/reports",
    icon: <BarChartIcon />,
    children: [
      {
        title: "Performance",
        path: "/reports/performance",
        icon: <BarChartIcon />,
      },
      {
        title: "Analytics",
        path: "/reports/analytics",
        icon: <BarChartIcon />,
      },
    ],
  },
  {
    title: "Integrations",
    path: "/integrations",
    icon: <ExtensionIcon />,
  },
];

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openSubMenus, setOpenSubMenus] = useState<{ [key: string]: boolean }>({});
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleDrawerToggle = () => {
    if (isMobile) {
      setMobileOpen(!mobileOpen);
    } else {
      setIsOpen(!isOpen);
    }
  };

  const handleSubMenuClick = (path: string) => {
    setOpenSubMenus((prev) => ({
      ...prev,
      [path]: !prev[path],
    }));
  };

  const isCurrentRoute = (path: string) => location.pathname === path;

  const renderNavItems = (items: NavItem[], groupTitle?: string) => {
    return (
      <>
        {groupTitle && isOpen && (
          <Typography
            variant="caption"
            sx={{
              px: 2,
              py: 1,
              color: "text.secondary",
              display: "block",
              fontWeight: 500,
            }}
          >
            {groupTitle}
          </Typography>
        )}
        {items.map((item) => (
          <React.Fragment key={item.path}>
            <Tooltip
              title={!isOpen ? item.title : ""}
              placement="right"
              arrow
              disableHoverListener={isOpen}
            >
              <ListItemButton
                component={item.children ? "div" : Link}
                to={item.children ? undefined : item.path}
                onClick={
                  item.children ? () => handleSubMenuClick(item.path) : undefined
                }
                selected={isCurrentRoute(item.path)}
                sx={{
                  minHeight: 44,
                  px: isOpen ? 2 : "14px",
                  py: "6px",
                  borderRadius: 1,
                  mb: 0.5,
                  justifyContent: isOpen ? "initial" : "center",
                  "&.Mui-selected": {
                    bgcolor: "action.selected",
                  },
                  "& .MuiListItemIcon-root": {
                    minWidth: 0,
                    mr: isOpen ? 2 : 0,
                    color: isCurrentRoute(item.path)
                      ? "primary.main"
                      : "text.secondary",
                  },
                }}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                {isOpen && (
                  <>
                    <ListItemText
                      primary={item.title}
                      sx={{
                        opacity: isOpen ? 1 : 0,
                        color: isCurrentRoute(item.path)
                          ? "primary.main"
                          : "text.primary",
                      }}
                    />
                    {item.children && (
                      <Box component="span" sx={{ ml: "auto" }}>
                        {openSubMenus[item.path] ? (
                          <ExpandLess />
                        ) : (
                          <ExpandMore />
                        )}
                      </Box>
                    )}
                  </>
                )}
              </ListItemButton>
            </Tooltip>
            {item.children && (
              <Collapse
                in={isOpen && openSubMenus[item.path]}
                timeout="auto"
                unmountOnExit
              >
                <List component="div" disablePadding>
                  {item.children.map((child) => (
                    <Tooltip
                      key={child.path}
                      title={!isOpen ? child.title : ""}
                      placement="right"
                      arrow
                      disableHoverListener={isOpen}
                    >
                      <ListItemButton
                        component={Link}
                        to={child.path}
                        selected={isCurrentRoute(child.path)}
                        sx={{
                          minHeight: 36,
                          px: isOpen ? 4 : "14px",
                          py: "4px",
                          borderRadius: 1,
                          mb: 0.5,
                          justifyContent: isOpen ? "initial" : "center",
                          "&.Mui-selected": {
                            bgcolor: "action.selected",
                          },
                          "& .MuiListItemIcon-root": {
                            minWidth: 0,
                            mr: isOpen ? 2 : 0,
                            color: isCurrentRoute(child.path)
                              ? "primary.main"
                              : "text.secondary",
                          },
                        }}
                      >
                        <ListItemIcon>{child.icon}</ListItemIcon>
                        {isOpen && (
                          <ListItemText
                            primary={child.title}
                            sx={{
                              opacity: isOpen ? 1 : 0,
                              color: isCurrentRoute(child.path)
                                ? "primary.main"
                                : "text.primary",
                            }}
                          />
                        )}
                      </ListItemButton>
                    </Tooltip>
                  ))}
                </List>
              </Collapse>
            )}
          </React.Fragment>
        ))}
      </>
    );
  };

  const drawer = (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      <List sx={{ flex: 1, px: 1, py: 1 }}>
        {renderNavItems(mainNavItems, "Main items")}
        <Divider sx={{ my: 1 }} />
        {renderNavItems(analyticsNavItems, "Analytics")}
      </List>

      <Divider />
      <Box
        sx={{
          p: 1.5,
          display: "flex",
          alignItems: "center",
          gap: 1,
          justifyContent: isOpen ? "flex-start" : "center",
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
        {isOpen && (
          <Box
            sx={{
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
  );

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          bgcolor: "background.paper",
          borderBottom: 1,
          borderColor: "divider",
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="toggle drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{
              color: "text.secondary",
              mr: 2,
            }}
          >
            <MenuIcon />
          </IconButton>

          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              color: "text.primary",
            }}
          >
            Satisfactory
          </Typography>

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
          width: isOpen ? DRAWER_WIDTH : COLLAPSED_DRAWER_WIDTH,
          flexShrink: 0,
          transition: (theme) =>
            theme.transitions.create("width", {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
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
              width: isOpen ? DRAWER_WIDTH : COLLAPSED_DRAWER_WIDTH,
              backgroundColor: "background.paper",
              borderRight: 1,
              borderColor: "divider",
              transition: (theme) =>
                theme.transitions.create("width", {
                  easing: theme.transitions.easing.sharp,
                  duration: theme.transitions.duration.enteringScreen,
                }),
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
          width: { sm: `calc(100% - ${isOpen ? DRAWER_WIDTH : COLLAPSED_DRAWER_WIDTH}px)` },
          mt: 8,
          transition: (theme) =>
            theme.transitions.create("width", {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default AdminLayout;
