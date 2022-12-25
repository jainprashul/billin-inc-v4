import * as React from 'react';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Grow from '@mui/material/Grow';
import Paper from '@mui/material/Paper';
import Popper from '@mui/material/Popper';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import { KeyboardArrowDown } from '@mui/icons-material';

export interface Menu {
    name: string;
    icon: JSX.Element;
    action: () => void;
}

type Props = {
    handleClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
    buttonLabel: string | JSX.Element
    MenuItems: Menu[];
    variant? : 'text' | 'outlined' | 'contained'
}

const SplitButton = ({handleClick, MenuItems , buttonLabel, variant='contained'}: Props) => {

    const anchorRef = React.useRef<HTMLDivElement>(null);
    const [openMenu, setOpenMenu] = React.useState(false);

    const handleToggle = () => {
        setOpenMenu((prevOpen) => !prevOpen);
    };

    const handleClose = (event: Event) => {
        if (
            anchorRef.current &&
            anchorRef.current.contains(event.target as HTMLElement)
        ) {
            return;
        }
        setOpenMenu(false);
    };


  return (
    <>
    <ButtonGroup  variant={variant} ref={anchorRef} aria-label="button" >
    <Button size='small' color="primary"  onClick={handleClick}>{buttonLabel}</Button>
    <Button size="small"
      aria-controls={openMenu ? 'split-button-menu' : undefined}
      aria-expanded={openMenu ? 'true' : undefined}
      aria-label="" aria-haspopup="menu"
      onClick={handleToggle}
    ><KeyboardArrowDown /></Button>
  </ButtonGroup> &nbsp;

  <Popper
    open={openMenu}
    anchorEl={anchorRef.current}
    role={undefined}
    transition
    placement='bottom-start'
  >
    {({ TransitionProps }) => (
      <Grow
        {...TransitionProps}

      >
        <Paper elevation={3} sx={{
          marginTop: '.5rem',
        }}>
          <ClickAwayListener onClickAway={handleClose}>
            <MenuList id="split-button-menu" autoFocusItem>
              {
                MenuItems.map((option, index) => (
                  <MenuItem color='primary'
                    key={index}
                    onClick={option.action}
                  >
                    {option.icon}&nbsp;{option.name}
                  </MenuItem>
                ))}
            </MenuList>
          </ClickAwayListener>
        </Paper>
      </Grow>
    )}
  </Popper>
  </>
  )
}

export default SplitButton