import { createTheme, Theme } from "@mui/material/styles";
import { alpha } from "@mui/material/styles";

const darkThemeColors = {
  primary: {
    main: "#7ab3a4",
    light: alpha("#7ab3a4", 0.12),
    dark: alpha("#7ab3a4", 0.8),
    contrastText: "#FFFFFF",
  },
  secondary: {
    main: "#647eec",
    light: alpha("#647eec", 0.12),
    dark: alpha("#647eec", 0.8),
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
    default: "#141825",
    paper: "#252936",
  },
  text: {
    primary: "#FFFFFF",
    secondary: "#A0AEC0",
  },
  action: {
    hover: alpha("#2A3E50", 0.6),
    selected: alpha("#2A3E50", 0.8),
    disabled: alpha("#A0AEC0", 0.3),
    disabledBackground: alpha("#A0AEC0", 0.12),
    focus: alpha("#2A3E50", 0.12),
  },
  divider: alpha("#FFFFFF", 0.06),
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
            // backgroundImage: (theme: Theme) => 
            //   `linear-gradient(145deg, ${theme.palette.background.default} 0%, ${alpha(theme.palette.background.paper, 0.8)} 100%)`,
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            background: mode === "dark" ? darkThemeColors.background.paper : undefined,
            border: mode === "dark" ? `1px solid ${darkThemeColors.divider}` : undefined,
            borderRadius: 16,
            boxShadow: mode === "dark" ? `0 4px 24px ${alpha("#000000", 0.2)}` : undefined,
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
              background: mode === "dark" ? darkThemeColors.action.hover : undefined,
            },
          },
        },
      },
      MuiIconButton: {
        styleOverrides: {
          root: {
            padding: 8,
            background: mode === "dark" ? darkThemeColors.action.hover : undefined,
            transition: "all 0.2s ease-in-out",
            "&:hover": {
              background: mode === "dark" ? darkThemeColors.action.selected : undefined,
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
            backgroundColor: mode === "dark" ? alpha(darkThemeColors.text.primary, 0.05) : undefined,
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
            backgroundColor: mode === "dark" ? darkThemeColors.background.paper : undefined,
            borderRight: mode === "dark" ? `1px solid ${darkThemeColors.divider}` : undefined,
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundColor: mode === "dark" ? darkThemeColors.background.default : undefined,
            backdropFilter: "blur(10px)",
            borderBottom: mode === "dark" ? `1px solid ${darkThemeColors.divider}` : undefined,
            boxShadow: "none",
          },
        },
      },
      MuiDialog: {
        styleOverrides: {
          paper: {
            backgroundColor: mode === "dark" ? darkThemeColors.background.paper : undefined,
            borderRadius: 16,
            border: mode === "dark" ? `1px solid ${darkThemeColors.divider}` : undefined,
          },
        },
      },
    },
  });
