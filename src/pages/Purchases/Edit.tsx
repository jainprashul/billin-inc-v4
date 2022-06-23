import Typography from '@mui/material/Typography';
import { useSnackbar } from 'notistack';
import { useLocation, useNavigate } from 'react-router-dom';
import { IInvoice, Invoices, IPurchase, Purchase } from '../../services/database/model';
import { InvoiceForm } from '../Invoices';

type Props = {}

const Edit = (props: Props) => {
  const navigate = useNavigate();
  const location = useLocation()
  const purchase = new Purchase(location.state as IPurchase)
  console.log(purchase);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  return (
    <div className="edit-purchase">
      <Typography variant="h6">Edit Purchase Entry</Typography>
      <InvoiceForm invoice={new Invoices(location.state as IInvoice)} onSubmit={(invoice)=> {
        console.log('Submit')
        invoice.save().then(()=>{
          enqueueSnackbar('Purchase Updated', { variant: 'success' });
          console.log('Saved')
          navigate('/invoice');
        })
      }}/>
    </div>
  )
}

export default Edit