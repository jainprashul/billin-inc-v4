import Typography from '@mui/material/Typography';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
import InvoiceForm from './InvoiceForm';

type Props = {}

const Edit = (props: Props) => {
  const navigate = useNavigate();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  return (
    <div className="edit-invoice">
      <Typography variant="h6">Edit Invoice</Typography>
      <InvoiceForm onSubmit={(invoice)=> {
        console.log('Submit')
        invoice.save().then(()=>{
          enqueueSnackbar('Invoice Updated', { variant: 'success' });
          console.log('Saved')
          navigate('/invoice');
        })
      }}/>
    </div>
  )
}

export default Edit