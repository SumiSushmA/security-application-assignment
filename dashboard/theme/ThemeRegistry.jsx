"use client";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import { NextAppDirEmotionCacheProvider } from "./EmotionCache";
const themeOptions = {
  palette: {
    primary: {
      main: "#008268",
    },
    secondary: {
      main: "rgba(37, 38, 94, 0.7)",
    },
    background: {
      default: "#FBFBFB",
      login: "#FFFFFF",
      bgOverlap: "#F7F7F7",
    },
    button: {
      main: "#007bff",
      contrastText: "#fff",
    },
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 960,
      lg: 1280,
      xl: 1920,
    },
  },
};
const theme = createTheme(themeOptions);

const ThemeRegistry = ({ children }) => {
  return (
    <NextAppDirEmotionCacheProvider options={{ key: "mui" }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </NextAppDirEmotionCacheProvider>
  );
};

export default ThemeRegistry;
