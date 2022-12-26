import Typography from '@mui/material/Typography';
import { INVOICES } from '../../constants/routes';
import { IInvoice, Invoices } from '../../services/database/model';
import { useDataUtils } from '../../utils/useDataUtils';
import InvoiceForm from './InvoiceForm';

type Props = {}

const Edit = (props: Props) => {

  const { navigate, location, toast} = useDataUtils()
  const invoice = new Invoices(location.state as IInvoice)
  console.log(invoice);
  return (
    <div className="edit-invoice">
      <Typography variant="h6">Edit Invoice</Typography>
      <InvoiceForm invoice={new Invoices(location.state as IInvoice)} onSubmit={(invoice)=> {
        console.log('Submit')
        invoice.save().then(()=>{
          toast.enqueueSnackbar('Invoice Updated', { variant: 'success' });
          console.log('Saved')
          navigate(INVOICES);
        }).catch((err)=>{
          console.log("Create: Error",err)
          toast.enqueueSnackbar('Error Updating Invoice', { variant: 'error' });
        })
      }}/>
    </div>
  )
}

export default Edit