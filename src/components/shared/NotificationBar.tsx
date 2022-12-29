import { Notifications } from '@mui/icons-material'
import { Badge, IconButton, Popover, Tooltip } from '@mui/material'
import React from 'react'
import NotificationSide from '../../pages/Notifications/NotificationSide'
import { NotificationLog } from '../../services/database/model'

type Props = {}

const NotificationBar = (props: Props) => {

    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const [count, setCount] = React.useState<number>(0);

    const handleOpenNotifications = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleCloseNotifications = () => {
        setAnchorEl(null);
    };

    const getNotificationCount = (logs : NotificationLog[]) => {
        let count = logs.filter(log => log.status === 'NEW').length;
        setCount(count);
        return count;
    }
    return (
        <>
            <Tooltip title="Notifications">
                <IconButton color='inherit' size='large' id="basic-button" aria-controls="basic-menu" aria-haspopup="true" aria-expanded={open ? 'true' : undefined} onClick={handleOpenNotifications}>
                    <Badge badgeContent={count} color="info">
                        <Notifications />
                    </Badge>
                </IconButton>
            </Tooltip>
            <Popover
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleCloseNotifications}
                keepMounted
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                }}
            >
                <NotificationSide getNotificationCount={getNotificationCount} handleClose={handleCloseNotifications} />
            </Popover>
        </>
    )
}

export default NotificationBar