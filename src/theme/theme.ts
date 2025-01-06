import { createTheme } from "@mui/material/styles";
import { alpha } from "@mui/material/styles";

const darkThemeColors = {
  primary: {
    main: "#4ECCA3", // Bright teal for accents
    light: "#6EDDB5",
    dark: "#3AA982",
    contrastText: "#FFFFFF",
  },
  secondary: {
    main: "#393E46", // Dark gray for secondary elements
    light: "#4A4F57",
    dark: "#2B2F35",
    contrastText: "#FFFFFF",
  },
  error: {
    main: "#FF6B6B",
    light: "#FF8A8A",
    dark: "#FF4C4C",
  },
  background: {
    default: "#0F1117", // Very dark blue-gray
    paper: "#1A1D24", // Slightly lighter dark blue-gray
  },
  text: {
    primary: "#E0E0E0",
    secondary: "rgba(224, 224, 224, 0.6)",
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
      h5: {
        fontWeight: 700,
        letterSpacing: "-0.01em",
      },
      h6: { 
        fontWeight: 600,
        letterSpacing: "-0.005em",
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
            background: mode === "dark" ? "#1A1D24" : undefined,
            border: mode === "dark" ? `1px solid ${alpha("#FFFFFF", 0.06)}` : undefined,
            borderRadius: 16,
            transition: "all 0.2s ease-in-out",
            backdropFilter: "blur(10px)",
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
            background: mode === "dark" ? "linear-gradient(45deg, #4ECCA3, #3AA982)" : undefined,
            "&:hover": {
              boxShadow: "none",
              transform: "translateY(-1px)",
              background: mode === "dark" ? "linear-gradient(45deg, #6EDDB5, #4ECCA3)" : undefined,
            },
          },
          outlined: {
            borderWidth: 1,
            "&:hover": {
              borderWidth: 1,
              background: mode === "dark" ? alpha("#FFFFFF", 0.05) : undefined,
            },
          },
        },
      },
      MuiIconButton: {
        styleOverrides: {
          root: {
            transition: "all 0.2s ease-in-out",
            padding: 8,
            "&:hover": {
              transform: "scale(1.1)",
              background: mode === "dark" ? alpha("#FFFFFF", 0.05) : undefined,
            },
          },
          sizeSmall: {
            padding: 6,
          },
        },
      },
      MuiAccordion: {
        styleOverrides: {
          root: {
            background: "transparent",
            boxShadow: "none",
            "&:before": {
              display: "none",
            },
            "&.Mui-expanded": {
              margin: 0,
            },
          },
        },
      },
      MuiAccordionSummary: {
        styleOverrides: {
          root: {
            padding: "0 8px",
            minHeight: 40,
            "&.Mui-expanded": {
              minHeight: 40,
            },
          },
          content: {
            margin: "10px 0",
            "&.Mui-expanded": {
              margin: "10px 0",
            },
          },
        },
      },
      MuiAccordionDetails: {
        styleOverrides: {
          root: {
            padding: "0 8px 16px",
            background: mode === "dark" ? alpha("#000", 0.2) : undefined,
            borderRadius: "0 0 16px 16px",
          },
        },
      },
      MuiDrawer: {
        styleOverrides: {
          paper: {
            backgroundColor: mode === "dark" ? "#0F1117" : undefined,
            borderRight: mode === "dark" ? `1px solid ${alpha("#FFFFFF", 0.06)}` : undefined,
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundColor: mode === "dark" ? alpha("#0F1117", 0.8) : undefined,
            backdropFilter: "blur(10px)",
          },
        },
      },
      MuiLinearProgress: {
        styleOverrides: {
          root: {
            borderRadius: 4,
            backgroundColor: mode === "dark" ? alpha("#FFFFFF", 0.05) : undefined,
          },
          bar: {
            borderRadius: 4,
          },
        },
      },
    },
  });
