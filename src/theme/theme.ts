import { createTheme } from "@mui/material/styles";
import { alpha } from "@mui/material/styles";

const darkThemeColors = {
  primary: {
    main: "#2CCB70",
    light: alpha("#2CCB70", 0.12),
    dark: alpha("#2CCB70", 0.8),
    contrastText: "#FFFFFF",
  },
  secondary: {
    main: "#1A73E8",
    light: alpha("#1A73E8", 0.12),
    dark: alpha("#1A73E8", 0.8),
    contrastText: "#FFFFFF",
  },
  error: {
    main: "#E53935",
    light: alpha("#E53935", 0.12),
    dark: alpha("#E53935", 0.8),
    contrastText: "#FFFFFF",
  },
  warning: {
    main: "#F6C90E",
    light: alpha("#F6C90E", 0.12),
    dark: alpha("#F6C90E", 0.8),
    contrastText: "#FFFFFF",
  },
  background: {
    default: "#131A22",
    paper: "#1B2631",
  },
  text: {
    primary: "#FFFFFF",
    secondary: "#A0AEC0",
  },
  action: {
    hover: alpha("#2A3E50", 0.8),
    selected: alpha("#2CCB70", 0.12),
    disabled: alpha("#A0AEC0", 0.3),
    disabledBackground: alpha("#A0AEC0", 0.12),
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
      },
      h5: {
        fontWeight: 600,
        letterSpacing: "-0.015em",
      },
      h6: {
        fontWeight: 600,
        letterSpacing: "-0.01em",
        lineHeight: 1.3,
        fontSize: "1.125rem",
      },
      body1: {
        letterSpacing: "0.00938em",
      },
      body2: {
        fontSize: "0.875rem",
        letterSpacing: "0.00714em",
        lineHeight: 1.43,
      },
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            backgroundColor: darkThemeColors.background.default,
            backgroundImage: "linear-gradient(145deg, #131A22 0%, #1B2631 100%)",
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            background: mode === "dark" ? darkThemeColors.background.paper : undefined,
            border: mode === "dark" ? `1px solid ${alpha("#FFFFFF", 0.06)}` : undefined,
            borderRadius: 16,
            boxShadow: mode === "dark" ? "0 4px 24px rgba(0, 0, 0, 0.2)" : undefined,
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
            "&:hover": {
              boxShadow: "none",
              transform: "translateY(-1px)",
            },
          },
          outlined: {
            borderWidth: 1,
            "&:hover": {
              borderWidth: 1,
              background: mode === "dark" ? alpha("#2A3E50", 0.8) : undefined,
            },
          },
        },
      },
      MuiIconButton: {
        styleOverrides: {
          root: {
            padding: 8,
            background: mode === "dark" ? alpha("#2A3E50", 0.6) : undefined,
            transition: "all 0.2s ease-in-out",
            "&:hover": {
              background: mode === "dark" ? alpha("#2A3E50", 0.8) : undefined,
              transform: "scale(1.1)",
            },
          },
          sizeSmall: {
            padding: 6,
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
      MuiDrawer: {
        styleOverrides: {
          paper: {
            backgroundColor: mode === "dark" ? darkThemeColors.background.default : undefined,
            borderRight: mode === "dark" ? `1px solid ${alpha("#FFFFFF", 0.06)}` : undefined,
            backgroundImage: mode === "dark" ? "linear-gradient(180deg, #131A22 0%, #1B2631 100%)" : undefined,
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundColor: mode === "dark" ? alpha("#131A22", 0.95) : undefined,
            backdropFilter: "blur(10px)",
            borderBottom: mode === "dark" ? `1px solid ${alpha("#FFFFFF", 0.06)}` : undefined,
            boxShadow: "none",
          },
        },
      },
      MuiDialog: {
        styleOverrides: {
          paper: {
            backgroundColor: mode === "dark" ? darkThemeColors.background.paper : undefined,
            borderRadius: 16,
            border: mode === "dark" ? `1px solid ${alpha("#FFFFFF", 0.06)}` : undefined,
          },
        },
      },
    },
  });
