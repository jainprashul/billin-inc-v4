import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import SideDrawer, { DrawerHeader } from './shared/SideDrawer';
import AppBar from './shared/AppBar';
import { Container } from '@mui/material';
import { setCurrentRoute } from '../routes/routeSlice';
import { useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { URLParamstoObject } from '../utils'

type Props = {
  children: React.ReactNode;
}

export default function Layout({ children }: Props) {
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);

  let location = useLocation();
  const dispatch = useAppDispatch();

  React.useEffect(() => {
    const { pathname, search } = location;
    dispatch(setCurrentRoute(pathname));

  }, [dispatch, location]);


  

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <Box sx={{ display: 'flex' }} >
      <CssBaseline />
      <AppBar open={open} handleDrawerOpen={handleDrawerOpen} />
      <SideDrawer open={open} handleDrawerClose={handleDrawerClose} theme={theme} />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <DrawerHeader />
        <Container maxWidth="lg">
          {children}
        </Container>
      </Box>
    </Box>
  );
}
