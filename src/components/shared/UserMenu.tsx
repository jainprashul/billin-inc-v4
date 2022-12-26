import * as React from 'react';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import { USER_MENU as settings } from '../../constants';
import { useAppSelector } from '../../app/hooks';
import { selectUser } from '../../utils/utilsSlice';


type Props = {}

const UserMenu = (props: Props) => {

    const user = useAppSelector(selectUser)

    // const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);
    const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);

    const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElUser(event.currentTarget);
    };

    /* const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    }; */

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    return (
        <Box data-testid="user-menu-container" sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
                <IconButton disableRipple data-testid="user-menu-icon-button" onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                    <Avatar alt="User" src={''} /> <Typography sx={{ ml: 1, color:'Menu' }}>{user?.name}</Typography>
                </IconButton>
            </Tooltip>
            <Menu
                data-testid="user-menu"

                sx={{ mt: '45px' }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
            >
                {settings.map((setting) => (
                    <MenuItem data-testid="user-menu-item" key={setting.name} onClick={() => {
                        setting.action();
                        handleCloseUserMenu()
                    }}>
                        <Typography textAlign="center">{setting.name}</Typography>
                    </MenuItem>
                ))}
            </Menu>
        </Box>
    )
}

export default UserMenu

