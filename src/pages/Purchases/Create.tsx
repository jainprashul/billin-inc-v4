import Typography from '@mui/material/Typography';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
import { InvoiceForm } from '../Invoices';


type Props = {}

const Create = (props: Props) => {
  const navigate = useNavigate();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  return (
    <div className="create-purchase">
      <Typography variant="h6">Purchase Entry</Typography>
      <InvoiceForm onSubmit={(invoice)=> {
        console.log('Submit')
        invoice.save().then(()=>{
          enqueueSnackbar('Purchase Created', { variant: 'success' });
          console.log('Saved')
          navigate('/purchase');
        })
      }}/>
    </div>
  )
}

export default Create