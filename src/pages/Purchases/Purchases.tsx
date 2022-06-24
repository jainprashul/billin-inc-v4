import { useLiveQuery } from 'dexie-react-hooks';
import React, { useEffect } from 'react'
import CompanyDB from '../../services/database/companydb';
import db from '../../services/database/db';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from 'react-router-dom';
import { INVOICE_CREATE, PURCHASE_CREATE } from '../../constants/routes';
import { Purchase } from '../../services/database/model';
import PurchaseTable from './PurchaseTable';

type Props = {}

const Purchases = (props: Props) => {
  const [companyDB, setCompanyDB] = React.useState<CompanyDB | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    db.on('ready', () => {
      setTimeout(() => {
        setCompanyDB(db.getCompanyDB(1));
      }, 200);
    });
  }, []);
  const purchases = useLiveQuery(async () => {
    if (companyDB) {
      const purchases = await Promise.all((await companyDB?.purchases.toArray())?.map(async purchase => {
        await purchase.loadProducts();
        await purchase.loadClient();
        return purchase;
      }))
      return purchases
    }
  }, [companyDB], []) as Array<Purchase>;

  return (
    <div>
      <PurchaseTable data={purchases as Purchase[]} />
      <Fab color="primary" style={{
          position: 'absolute',
          bottom: 16,
          right: 16,
      }} onClick={()=> {
        navigate(PURCHASE_CREATE);
      }} aria-label="add">
        <AddIcon />
      </Fab>
    </div>
  )
}

export default Purchases