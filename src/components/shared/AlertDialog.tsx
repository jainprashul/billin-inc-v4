import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

type Props = {
    open: boolean;
    setOpen: (open: boolean) => void;
    title: string;
    message: string;
    onCancel?: () => void;
    onConfirm?: () => void;
    confirmText?: string;
    cancelText?: string;
    confirmColor?: 'error' | 'success' | 'warning' | 'info' | 'primary' | 'secondary';
}

export default function AlertDialog(props: Props) {
    let { open, setOpen, title, message, onCancel, onConfirm, confirmText = "OK", cancelText = "Cancel", confirmColor='primary' } = props;

    /* const handleClickOpen = () => {
        setOpen(true);
    }; */

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <div>
            <Dialog
                data-testid="alert-dialog-container"
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {title}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        {message}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button data-testid="alert-dialog-cancel-btn" onClick={() => {
                        handleClose();
                        if (onCancel) onCancel();
                    }}>{cancelText}</Button>
                    <Button data-testid="alert-dialog-confirm-btn" color={confirmColor} onClick={() => {
                        handleClose();
                        if (onConfirm) onConfirm();
                    }} autoFocus>{confirmText}</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}