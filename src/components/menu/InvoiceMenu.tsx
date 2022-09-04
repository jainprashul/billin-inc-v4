import * as React from 'react';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { FormControlLabel, Switch } from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { selectGstEnabled, setGstEnabled } from '../../utils/utilsSlice';

type Props = {
    anchorEl : null | HTMLElement
    onClose: () => void
    menuopen: boolean
}

const InvoiceMenu = ({
    anchorEl, onClose, menuopen
}: Props) => {
    const dispatch = useAppDispatch();
    const gstEnabled = useAppSelector(selectGstEnabled);
  return (
    <div>
        <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={menuopen}
        onClose={onClose}
        MenuListProps={{
          'aria-labelledby': 'menu-button',
        }}
      >
        <MenuItem>
            <FormControlLabel
          value="start"
          control={<Switch checked={gstEnabled} onChange={()=>{
            dispatch(setGstEnabled(!gstEnabled))
          }} color="primary" />}
          label="GST Enabled"
          labelPlacement="start"
        />
        </MenuItem>
      </Menu>
    </div>
  )
}

export default InvoiceMenu