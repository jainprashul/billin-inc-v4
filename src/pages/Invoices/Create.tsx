import Typography from '@mui/material/Typography';
import { useSnackbar } from 'notistack';
import InvoiceForm from './InvoiceForm';

type Props = {}

const Create = (props: Props) => {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  return (
    <div className="create-invoice">
      <Typography variant="h6">Create Invoice</Typography>
      <InvoiceForm onSubmit={(invoice)=> {
        console.log('Submit')
        invoice.save().then(()=>{
          enqueueSnackbar('Invoice Created', { variant: 'success' });
          console.log('Saved')
        })
      }}/>
    </div>
  )
}

export default Create