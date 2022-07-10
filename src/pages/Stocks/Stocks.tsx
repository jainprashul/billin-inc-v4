import { useLiveQuery } from 'dexie-react-hooks';
import React from 'react'
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import { Stock } from '../../services/database/model';
import StockTable from './StockTable';
import { useDataUtils } from '../../utils/useDataUtils';
import Create from './Create';

type Props = {}

const Stocks = (props: Props) => {
  const { companyDB, navigate} = useDataUtils();
  const [open, setOpen] = React.useState(false);

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
          position: 'fixed',
          bottom: 16,
          right: 16,
      }} onClick={()=> {
        setOpen(true)
      }} aria-label="add">
        <AddIcon />
      </Fab>
      <Create open={open} setOpen={setOpen} />
    </div>
  )
}

export default Stocks