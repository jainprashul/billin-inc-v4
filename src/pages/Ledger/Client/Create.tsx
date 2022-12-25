import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { IconButton } from '@mui/material';
import { Close } from '@mui/icons-material';
import ClientForm from '../../../features/Client/ClientForm';
import { useDataUtils } from '../../../utils/useDataUtils';

type Props = {
  open: boolean
  setOpen: (open: boolean) => void
}
export default function ClientCreate(props: Props) {
  const { open, setOpen } = props;
  const { toast, navigate } = useDataUtils();

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
          Client Details
          <IconButton style={{
            float: 'right',
          }} onClick={handleClose}>
            <Close/>
          </IconButton>
        </DialogTitle>
        <DialogContent >
          <ClientForm onSubmit={(client) => {
            console.log('Submit')
            client.save().then((id) => {
              handleClose()
              navigate('/ledger/' + id)
              toast.enqueueSnackbar(`Client ${client.name} Details Saved`, { variant: 'success' });
              console.log('Saved', id)
            })
          }} />
        </DialogContent>
      </Dialog>
    </div>
  );
}

