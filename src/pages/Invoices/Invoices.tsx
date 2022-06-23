import { useLiveQuery } from 'dexie-react-hooks';
import React, { useEffect } from 'react'
import CompanyDB from '../../services/database/companydb';
import db from '../../services/database/db';
import { Invoice } from '../../services/database/model/Invoices';
import InoviceTable from './InoviceTable';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from 'react-router-dom';
import { INVOICE_CREATE } from '../../constants/routes';

type Props = {}

const Invoices = (props: Props) => {
  const [companyDB, setCompanyDB] = React.useState<CompanyDB | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    db.on('ready', () => {
      setTimeout(() => {
        setCompanyDB(db.getCompanyDB(1));
      }, 200);
    });
  }, []);
  const invoices = useLiveQuery(async () => {
    console.log('Fetching Invoices', companyDB);
    if (companyDB) {
      const invoices = await Promise.all((await companyDB?.invoices.toArray())?.map(async invoice => {
        await invoice.loadProducts();
        await invoice.loadClient();
        return invoice;
      }))
      return invoices
    }
  }, [companyDB], []) as Array<Invoice>;

  return (
    <div>
      <InoviceTable data={invoices as Invoice[]} />
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
  )
}

export default Invoices