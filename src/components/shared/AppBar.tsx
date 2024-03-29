import { styled } from '@mui/material/styles';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import { DRAWER_WIDTH as drawerWidth, APP_NAME } from '../../constants';
import UserMenu from './UserMenu';
import SharedSettting from './SharedSettting';
import { useAppSelector } from '../../app/hooks';
import { selectCurrentRoute } from '../../routes/routeSlice';
import { RoutesHasSettings } from '../../constants/navbar';
import NotificationBar from './NotificationBar';
import { useDataUtils } from '../../utils/useDataUtils';

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const Bar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

type Props = {
  open: boolean,
  handleDrawerOpen: () => void,
}

const AppBar = ({ open, handleDrawerOpen }: Props) => {
  const currentRoute = useAppSelector(selectCurrentRoute);
  const { company } = useDataUtils()

  const name = company?.name || APP_NAME

  return (
    <Bar data-testid="app-bar-container" position="fixed" open={open}>
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          onClick={handleDrawerOpen}
          edge="start"
          sx={{
            marginRight: 5,
            ...(open && { display: 'none' }),
          }}
        >
          <MenuIcon />
        </IconButton>
        <div style={{
          flexGrow: 1,
        }}>
          <Typography variant="h6" noWrap component="div">
            {name} <Typography variant="caption" component="span" sx={{ color: 'grey.500' }} >/{APP_NAME}</Typography>
          </Typography>
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems:'center' }} >
          {
            RoutesHasSettings.includes(currentRoute) && <SharedSettting />
          }
          <NotificationBar/>
          <UserMenu />
        </div>
      </Toolbar>
    </Bar>
  )
}

export default AppBar