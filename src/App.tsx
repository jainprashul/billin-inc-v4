import React from 'react';
import AppRoutes from './routes/AppRoutes';
import { SnackbarProvider } from 'notistack';

import './styles/App.css';
import { ThemeProvider } from '@mui/material';
import { theme } from './styles/theme';

function App() {
  return (
    <div className="App">
      <ThemeProvider theme={theme}>
      <SnackbarProvider maxSnack={3}>
        <AppRoutes />
      </SnackbarProvider>
      </ThemeProvider>

    </div>
  );
}

export default App;
