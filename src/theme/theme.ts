import { createTheme } from "@mui/material/styles";
import { alpha } from "@mui/material/styles";

const darkThemeColors = {
  primary: {
    main: "#2CCB70", // Primary Accent
    light: "#4DD88C",
    dark: "#229F58",
    contrastText: "#FFFFFF",
  },
  secondary: {
    main: "#1A73E8", // Secondary Accent
    light: "#4A90EA",
    dark: "#1557B0",
    contrastText: "#FFFFFF",
  },
  error: {
    main: "#E53935", // Error
    light: "#EF5350",
    dark: "#C62828",
  },
  warning: {
    main: "#F6C90E", // Warning
    light: "#FFD54F",
    dark: "#FFA000",
  },
  background: {
    default: "#131A22", // Dark Background
    paper: "#1B2631", // Card Background
  },
  text: {
    primary: "#FFFFFF", // Primary Text
    secondary: "#A0AEC0", // Secondary Text
  },
};

export const getTheme = (mode: "light" | "dark") =>
  createTheme({
    palette: {
      mode,
      ...(mode === "dark" && darkThemeColors),
    },
    typography: {
      fontFamily: "'Inter', 'Roboto', 'Arial', sans-serif",
      h4: {
        fontWeight: 700,
        letterSpacing: "-0.02em",
        color: mode === "dark" ? "#FFFFFF" : undefined,
      },
      h5: {
        fontWeight: 600,
        letterSpacing: "-0.015em",
      },
      h6: { 
        fontWeight: 600,
        letterSpacing: "-0.01em",
        lineHeight: 1.3,
      },
      body1: {
        letterSpacing: "0.00938em",
      },
      body2: { 
        fontSize: "0.875rem",
        letterSpacing: "0.00714em",
      },
    },
    components: {
      MuiCard: {
        styleOverrides: {
          root: {
            background: mode === "dark" ? "#1B2631" : undefined,
            border: mode === "dark" ? `1px solid ${alpha("#FFFFFF", 0.06)}` : undefined,
            borderRadius: 16,
            minWidth: 280,
            maxWidth: 380,
            width: "100%",
            transition: "all 0.2s ease-in-out",
            "&:hover": {
              "& .card-actions": {
                opacity: 1,
                transform: "translateY(0)",
              },
            },
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            textTransform: "none",
            fontWeight: 500,
            padding: "8px 16px",
            transition: "all 0.2s ease-in-out",
          },
          contained: {
            boxShadow: "none",
            background: mode === "dark" ? "#2CCB70" : undefined,
            color: mode === "dark" ? "#FFFFFF" : undefined,
            "&:hover": {
              boxShadow: "none",
              transform: "translateY(-1px)",
              background: mode === "dark" ? "#4DD88C" : undefined,
            },
          },
          outlined: {
            borderWidth: 1,
            "&:hover": {
              borderWidth: 1,
              background: mode === "dark" ? "#2A3E50" : undefined,
            },
          },
        },
      },
      MuiIconButton: {
        styleOverrides: {
          root: {
            transition: "all 0.2s ease-in-out",
            padding: 8,
            background: mode === "dark" ? "#2A3E50" : undefined,
            "&:hover": {
              transform: "scale(1.1)",
              "& .MuiSvgIcon-root": {
                color: "#FFFFFF",
              },
            },
          },
          sizeSmall: {
            padding: 6,
          },
        },
      },
      MuiDrawer: {
        styleOverrides: {
          paper: {
            backgroundColor: mode === "dark" ? "#131A22" : undefined,
            borderRight: mode === "dark" ? `1px solid ${alpha("#FFFFFF", 0.06)}` : undefined,
            transition: "width 0.3s ease-in-out, transform 0.3s ease-in-out",
            overflowX: "hidden",
            width: 240,
            position: "absolute",
            height: "100%",
            "&.collapsed": {
              width: 72,
              transform: "translateX(-168px)",
              "&:hover": {
                transform: "translateX(0)",
              },
            },
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundColor: mode === "dark" ? alpha("#131A22", 0.95) : undefined,
            backdropFilter: "blur(10px)",
            borderBottom: mode === "dark" ? `1px solid ${alpha("#FFFFFF", 0.06)}` : undefined,
          },
        },
      },
      MuiLinearProgress: {
        styleOverrides: {
          root: {
            borderRadius: 4,
            height: 8,
            backgroundColor: mode === "dark" ? alpha("#FFFFFF", 0.05) : undefined,
          },
          bar: {
            borderRadius: 4,
            transition: "transform 0.3s ease-in-out",
          },
        },
      },
      MuiListItem: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            margin: "4px 8px",
            transition: "all 0.2s ease-in-out",
            "&:hover": {
              backgroundColor: mode === "dark" ? "#2A3E50" : undefined,
            },
            "&.Mui-selected": {
              backgroundColor: mode === "dark" ? alpha("#2CCB70", 0.1) : undefined,
              "&:hover": {
                backgroundColor: mode === "dark" ? alpha("#2CCB70", 0.15) : undefined,
              },
            },
          },
        },
      },
      MuiListItemIcon: {
        styleOverrides: {
          root: {
            minWidth: 40,
            color: mode === "dark" ? "#A0AEC0" : undefined,
          },
        },
      },
    },
  });
