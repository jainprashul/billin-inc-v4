import { useLiveQuery } from 'dexie-react-hooks';
import { Invoice } from '../../services/database/model/Invoices';
import InvoiceTable from './InoviceTable';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import { INVOICE_CREATE } from '../../constants/routes';
import { useDataUtils } from '../../utils/useDataUtils';
import AdminWrapper from '../../routes/AdminWrapper';

type Props = {}

const Invoices = (props: Props) => {
  const { companyDB, navigate} = useDataUtils();

  const invoices = useLiveQuery(async () => {
    if (companyDB) {
      const invoices = await Promise.all((await companyDB?.invoices.orderBy('billingDate').reverse().toArray())?.map(async invoice => {
        await invoice.loadProducts();
        await invoice.loadClient();
        return invoice;
      }))
      return invoices
    }
  }, [companyDB], []) as Array<Invoice>;

  return (
    <AdminWrapper>
    <div id='invoice-page'>
      <InvoiceTable data={invoices as Invoice[]} />
      <Fab color="primary" style={{
          position: 'absolute',
          bottom: 16,
          right: 16,
      }} onClick={()=> {
        navigate(INVOICE_CREATE);
      }} aria-label="add">
        <AddIcon />
      </Fab>
    </div>
    </AdminWrapper>
  )
}

export default Invoices