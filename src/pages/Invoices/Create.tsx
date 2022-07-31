import Typography from '@mui/material/Typography';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
import { INVOICES } from '../../constants/routes';
import InvoiceForm from './InvoiceForm';

type Props = {}

const Create = (props: Props) => {
  const navigate = useNavigate();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  return (
    <div className="create-invoice">
      <Typography variant="h6">Create Invoice</Typography>
      <InvoiceForm onSubmit={(invoice)=> {
        console.log('Submit')
        invoice.save().then(()=>{
          enqueueSnackbar('Invoice Created', { variant: 'success' });
          console.log('Saved')
          navigate(INVOICES);
        }).catch((err)=>{
          console.log("Create: Error",err)
          enqueueSnackbar('Error Creating Invoice', { variant: 'error' });
        })
      }}/>
    </div>
  )
}

export default Create