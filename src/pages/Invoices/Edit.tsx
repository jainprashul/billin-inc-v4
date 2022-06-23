import Typography from '@mui/material/Typography';
import { useSnackbar } from 'notistack';
import { useLocation, useNavigate } from 'react-router-dom';
import { IInvoice, Invoices } from '../../services/database/model';
import InvoiceForm from './InvoiceForm';

type Props = {}

const Edit = (props: Props) => {
  const navigate = useNavigate();
  const location = useLocation()
  const invoice = new Invoices(location.state as IInvoice)
  console.log(invoice);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  return (
    <div className="edit-invoice">
      <Typography variant="h6">Edit Invoice</Typography>
      <InvoiceForm invoice={new Invoices(location.state as IInvoice)} onSubmit={(invoice)=> {
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