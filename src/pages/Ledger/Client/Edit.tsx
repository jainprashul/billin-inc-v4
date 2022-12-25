import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { IconButton } from '@mui/material';
import { Close } from '@mui/icons-material';
import ClientForm from '../../../features/Client/ClientForm';
import { Client } from '../../../services/database/model';
import { useDataUtils } from '../../../utils/useDataUtils';

type Props = {
  open: boolean
  setOpen: (open: boolean) => void
  onClose?: () => void
  onConfirm?: (values: any) => void
  title?: string
  submitText?: string
  children?: React.ReactNode
  client : Client
}
export default function ClientEdit(props: Props) {
  const { open, setOpen, client } = props;
  const { toast } = useDataUtils();

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Dialog fullWidth
        maxWidth="md"
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Customer Details
          <IconButton style={{
            float: 'right',
          }} onClick={handleClose}>
            <Close/>
          </IconButton>
        </DialogTitle>
        <DialogContent >
          <ClientForm client={client} onSubmit={(client) => {
            console.log('Submit')
            client.save().then((id) => {
              handleClose()
              toast.enqueueSnackbar(`Client ${client.name} Details Updated`, { variant: 'success' });
              console.log('Saved', id)
            })
          }} />
        </DialogContent>
      </Dialog>
    </div>
  );
}

