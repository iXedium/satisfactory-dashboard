import { createTheme } from "@mui/material/styles";

export const getTheme = (mode: "light" | "dark") =>
  createTheme({
    palette: {
      mode,
      ...(mode === "dark"
        ? {
            background: {
              default: "#121212",
              paper: "#1d1d1d",
            },
            text: {
              primary: "#ffffff",
              secondary: "#bdbdbd",
            },
          }
        : {
            background: {
              default: "#ffffff",
              paper: "#f5f5f5",
            },
            text: {
              primary: "#000000",
              secondary: "#757575",
            },
          }),
    },
  });
