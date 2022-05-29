import { createTheme, ThemeOptions } from "@mui/material";

const Theme: ThemeOptions = {
  palette: {
    primary: {
      main: '#53439a',
    },
    secondary: {
      main: '#0098db',
    },
    error: {
      main: '#cc0101',
    },
    success: {
      main: '#4caf50',
    },
  }
}

export const theme = createTheme(Theme);