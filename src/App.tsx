import React from 'react';
import AppRoutes from './routes/AppRoutes';
import { SnackbarProvider } from 'notistack';

import './styles/App.css';
import { ThemeProvider } from '@mui/material';

function App() {
  return (
    <div className="App">

      <SnackbarProvider maxSnack={3}>
        <AppRoutes />
      </SnackbarProvider>

    </div>
  );
}

export default App;
