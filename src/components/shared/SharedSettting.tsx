import { IconButton, Tooltip } from '@mui/material'
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';

import React, { useEffect } from 'react'
import { selectCurrentRoute } from '../../routes/routeSlice';
import { useAppSelector } from '../../app/hooks';
import InvoiceMenu from '../menu/InvoiceMenu';
import { INVOICE_CREATE, PURCHASE_CREATE } from '../../constants/routes';

type Props = {}

const SharedSettting = (props: Props) => {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const [title, setTitle] = React.useState<string>('Settings');
    const open = Boolean(anchorEl);
    const currentRoute = useAppSelector(selectCurrentRoute);

    useEffect(() => {
        console.log('currentRoute', currentRoute);
        switch (currentRoute) {
            case INVOICE_CREATE:
                setTitle('Invoice Settings');
                break;
            case PURCHASE_CREATE: 
                setTitle('Purchase Settings');
                break;
            default:
                setTitle('Settings');
                break;
        }
        return () => {
            setTitle('Settings');
        }
    }, [currentRoute])


    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const SelectedMenu = () => {
        switch (currentRoute) {
            case INVOICE_CREATE:
            case PURCHASE_CREATE: 
                return <InvoiceMenu anchorEl={anchorEl} onClose={handleClose} menuopen={open} />
            default:
                return null
        }
    }


    return (
        <div style={{
            marginRight: '1rem'
        }}>
            <Tooltip title={title}>
                <IconButton color='inherit' size='large' id="basic-button"
                    aria-controls={open ? 'setting-menu' : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? 'true' : undefined}
                    onClick={handleClick} >
                    <SettingsOutlinedIcon className='rotate-icon' />
                </IconButton>
            </Tooltip>



            <SelectedMenu />
        </div>
    )
}

export default SharedSettting