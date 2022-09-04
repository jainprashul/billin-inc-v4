import { useLiveQuery } from 'dexie-react-hooks';
import PurchaseTable from './PurchaseTable';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import { PURCHASE_CREATE } from '../../constants/routes';
import { useDataUtils } from '../../utils/useDataUtils';
import { Purchase } from '../../services/database/model';

type Props = {}

const Purchases = (props: Props) => {
  const { companyDB, navigate } = useDataUtils();

  const purchases = useLiveQuery(async () => {
    if (companyDB) {
      const purchases = await Promise.all((await companyDB?.purchases.orderBy('billingDate').reverse().toArray())?.map(async purchs => {
        await purchs.loadProducts();
        await purchs.loadClient();
        return purchs;
      }))
      return purchases
    }
  }, [companyDB], []) as Array<Purchase>;

  return (
    <div id='purchase-page'>
      <PurchaseTable data={purchases} />
      <Fab color="primary" style={{
        position: 'absolute',
        bottom: 16,
        right: 16,
      }} onClick={() => {
        navigate(PURCHASE_CREATE);
      }} aria-label="add">
        <AddIcon />
      </Fab>
    </div>
  )
}

export default Purchases