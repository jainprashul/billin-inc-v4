import Typography from '@mui/material/Typography';
import InvoiceForm from './InvoiceForm';

type Props = {}

const Create = (props: Props) => {
  return (
    <div className="create-invoice">
      <Typography variant="h6">Create Invoice</Typography>
      <InvoiceForm onSubmit={()=> {
        console.log('Submit')
      }}/>
    </div>
  )
}

export default Create