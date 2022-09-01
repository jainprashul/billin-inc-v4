import Typography from '@mui/material/Typography';
import { useSnackbar } from 'notistack';
import { useLocation, useNavigate } from 'react-router-dom';
import { INVOICES } from '../../constants/routes';
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
          navigate(INVOICES);
        }).catch((err)=>{
          console.log("Create: Error",err)
          enqueueSnackbar('Error Updating Invoice', { variant: 'error' });
        })
      }}/>
    </div>
  )
}

export default Edit