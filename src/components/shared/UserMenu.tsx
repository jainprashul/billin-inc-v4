import * as React from 'react';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import { USER_MENU as settings } from '../../constants';


type Props = {}

const UserMenu = (props: Props) => {

    const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);
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
                <IconButton data-testid="user-menu-icon-button" onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                    <Avatar alt="User" src={''} />
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
                    <MenuItem data-testid="user-menu-item" key={setting} onClick={handleCloseUserMenu}>
                        <Typography textAlign="center">{setting}</Typography>
                    </MenuItem>
                ))}
            </Menu>
        </Box>
    )
}

export default UserMenu

