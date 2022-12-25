import React from 'react';
import AppRoutes from './routes/AppRoutes';
import { SnackbarProvider } from 'notistack';
import { GoogleApiProvider } from 'react-gapi'

import './styles/App.css';
import { ThemeProvider } from '@mui/material';
import { theme } from './styles/theme';
import LoadingX, { LoadingProvider } from './components/shared/LoadingX';

const CLIENT_ID = process.env.REACT_APP_CLIENT_ID


function App() {
  return (
    <div className="App">
      <LoadingProvider>
        <GoogleApiProvider clientId={CLIENT_ID!}>
          <ThemeProvider theme={theme}>
            <SnackbarProvider maxSnack={3}>
              <AppRoutes />
            </SnackbarProvider>
          </ThemeProvider>
        </GoogleApiProvider>
        <LoadingX />
      </LoadingProvider>
    </div>
  );
}

export default App;
