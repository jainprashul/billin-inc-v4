
import { Grid, Stack, Typography } from '@mui/material'
import { DataTesting } from '../../components'
import Filters from '../../components/shared/Filters'
import ExpensePieChart from '../Expenses/ExpensePieChart'
import SalesChart from '../Invoices/SalesChart'
import SalesNPurchaseGraph from '../Invoices/SalesNPurchaseGraph'
import useDashboard from './useDashboard'

type Props = {}

const Dashboard = (props: Props) => {
  const { filterList, handleFilterChange, expenses, invoices, purchase, filter } = useDashboard()
  return (
    <div>
      <Stack direction="row" spacing={2} alignItems="center" justifyContent={'space-between'}>
        <Typography variant="h4">Dashboard</Typography>
        <Filters filters={filterList} getFilters={handleFilterChange} />
      </Stack>


      <Grid container spacing={2}>

        <Grid item xs={12} md={6}>
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '10px',
          }}>
            <ExpensePieChart data={expenses} width={300} height={350} />
            <div>
              <Typography variant="body1">Sales Count </Typography>
              <SalesChart data={{ invoices, purchases: purchase }} date={filter.date} width={300} height={330} />
            </div>
          </div>
        </Grid>

        <Grid item xs={12} md={6}>
        </Grid>

        <Grid item xs={12} md={6}>
          <SalesNPurchaseGraph />
        </Grid>

      </Grid>


      <DataTesting />
    </div>
  )
}

export default Dashboard