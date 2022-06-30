import { useLiveQuery } from 'dexie-react-hooks';
import React, { useEffect } from 'react'
import CompanyDB from '../../services/database/companydb';
import db from '../../services/database/db';
import { Invoice } from '../../services/database/model/Invoices';

import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from 'react-router-dom';
import { INVOICE_CREATE } from '../../constants/routes';
import { Stock } from '../../services/database/model';
import StockTable from './StockTable';

type Props = {}

const Stocks = (props: Props) => {
  const [companyDB, setCompanyDB] = React.useState<CompanyDB | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    db.on('ready', () => {
      setTimeout(() => {
        setCompanyDB(db.getCompanyDB(1));
      }, 200);
    });
  }, []);
  const stocks = useLiveQuery(async () => {
    if (companyDB) {
      const stocks = await Promise.all((await companyDB?.stocks.toArray())?.map(async stock => {
        await stock.loadStockLogs()
        return stock
      }))
      return stocks
    }
  }, [companyDB], []) as Array<Stock>;

  console.log(stocks);

  return (
    <div>
      <StockTable data={stocks as Stock[]} />
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

export default Stocks