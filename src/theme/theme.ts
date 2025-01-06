import { createTheme } from "@mui/material/styles";
import { alpha } from "@mui/material/styles";

const darkThemeColors = {
  primary: {
    main: "#00FFC8", // Teal Green
    light: "#33FFD4",
    dark: "#00CCB3",
    contrastText: "#121212",
  },
  secondary: {
    main: "#0078FF", // Blue
    light: "#3393FF",
    dark: "#0060CC",
    contrastText: "#FFFFFF",
  },
  error: {
    main: "#FF4D4D", // Red
    light: "#FF7373",
    dark: "#CC3D3D",
  },
  warning: {
    main: "#FFC300", // Yellow
    light: "#FFCF33",
    dark: "#CC9C00",
  },
  background: {
    default: "#121212", // Dark Gray
    paper: "#1D1D1D", // Slightly lighter Dark Gray
  },
  text: {
    primary: "#E0E0E0", // Light Gray
    secondary: "#B3B3B3", // Muted Gray
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
        color: mode === "dark" ? "#00FFC8" : undefined,
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
            background: mode === "dark" ? "#1D1D1D" : undefined,
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
            background: mode === "dark" ? "#00FFC8" : undefined,
            color: mode === "dark" ? "#121212" : undefined,
            "&:hover": {
              boxShadow: "none",
              transform: "translateY(-1px)",
              background: mode === "dark" ? "#33FFD4" : undefined,
            },
          },
          outlined: {
            borderWidth: 1,
            "&:hover": {
              borderWidth: 1,
              background: mode === "dark" ? "#2C2C2C" : undefined,
            },
          },
        },
      },
      MuiIconButton: {
        styleOverrides: {
          root: {
            transition: "all 0.2s ease-in-out",
            padding: 8,
            background: mode === "dark" ? "#2C2C2C" : undefined,
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
            backgroundColor: mode === "dark" ? "#121212" : undefined,
            borderRight: mode === "dark" ? `1px solid ${alpha("#FFFFFF", 0.06)}` : undefined,
            transition: "width 0.3s ease-in-out",
            overflowX: "hidden",
            width: 240,
            "&.collapsed": {
              width: 72,
            },
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundColor: mode === "dark" ? alpha("#121212", 0.95) : undefined,
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
              backgroundColor: mode === "dark" ? "#2C2C2C" : undefined,
            },
            "&.Mui-selected": {
              backgroundColor: mode === "dark" ? alpha("#00FFC8", 0.1) : undefined,
              "&:hover": {
                backgroundColor: mode === "dark" ? alpha("#00FFC8", 0.15) : undefined,
              },
            },
          },
        },
      },
      MuiListItemIcon: {
        styleOverrides: {
          root: {
            minWidth: 40,
            color: mode === "dark" ? "#B3B3B3" : undefined,
          },
        },
      },
    },
  });
