import { AddBox } from '@mui/icons-material'
import { Button, Grid, Stack, Typography } from '@mui/material'
import { useAppSelector } from '../../app/hooks'
import Filters from '../../components/shared/Filters'
import LoadingX from '../../components/shared/LoadingX'
import Time from '../../components/shared/Time'
import { INVOICE_CREATE, PURCHASE_CREATE } from '../../constants/routes'
import authService from '../../services/authentication/auth.service'
import { countDays } from '../../utils'
import { selectExpenseCount, selectNotificationCount, selectPurchaseCount, selectSalesCount, selectStockCount } from '../../utils/utilsSlice'
import ExpensePieChart from '../Expenses/ExpensePieChart'
import SalesChart from '../Invoices/SalesChart'
import SalesNPurchaseGraph from '../Invoices/SalesNPurchaseGraph'
import SalesVSPurchaseGraph from '../Invoices/SalesVSPurchaseGraph'
import useDashboard from './useDashboard'

type Props = {}

const Dashboard = (props: Props) => {
    const user = authService.getUser();

    const notificationCount = useAppSelector(selectNotificationCount);
    const salesCount = useAppSelector(selectSalesCount);
    const purchaseCount = useAppSelector(selectPurchaseCount);
    const expenseCount = useAppSelector(selectExpenseCount);
    const stockCount = useAppSelector(selectStockCount);

    const { filterList, handleFilterChange, expenses, filter, companyDB, navigate } = useDashboard()

    if (!companyDB) {
        return <LoadingX />
    }

    return (
        <div id='dashboard-page'>
            <Stack direction="row" spacing={2} alignItems="center" justifyContent={'space-between'}>
                <div>
                    <Typography variant="h6">Welcome <b>{user?.name}</b>,</Typography>
                    <Typography variant="caption">You have <span style={{
                        color: '#0288d1',
                    }}>{notificationCount} unread notifications!</span></Typography>
                </div>

                <div className='flex'>
                    <Button variant="contained"  color='primary' startIcon={<AddBox />} onClick={() => navigate(INVOICE_CREATE)}>New Invoice</Button>
                    <Button variant="contained" color='primary' startIcon={<AddBox />} onClick={() => navigate(PURCHASE_CREATE)}>New Purchase</Button>
                    <Filters filters={filterList} getFilters={handleFilterChange} />
                </div>

            </Stack>

            <Grid container spacing={2} mt={1}>
                {/* Dashboard Summary */}
                <Grid item xs={12} md={6}>
                    <div style={{
                        backgroundImage: 'url("./assets/people.svg")',
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'center',
                        backgroundSize: 'cover',
                        minHeight: 300,
                        borderRadius: '1rem',
                        position: 'relative',
                    }}>
                        <div style={{
                            display: 'flex',
                            justifyContent: 'flex-end',
                            padding: '1rem',

                        }}>
                            <Typography variant="h6"><Time /></Typography>
                        </div>
                    </div>
                </Grid>

                <Grid item xs={12} md={6}>
                    <div className='dashboard-overall' style={{
                        minHeight: 300,
                        // marginTop: '-.8rem',
                    }}>
                        <div>
                            <div className='mini-card color-1'>
                                <div className='title'> Total Sales ({salesCount.count})</div>
                                <div className='value'> ₹ {salesCount.amount.toFixed(2)}  </div>
                                <div className='percent'>{salesCount.deltaPercent.toFixed(2)}% ({countDays(filter.date.from, filter.date.to)} days)</div>
                            </div>
                            <div className='mini-card color-2'>
                                <div className='title'> Total Expense ({expenseCount?.count}) </div>
                                <div className='value'> ₹ {expenseCount?.amount.toFixed(2)} </div>
                                <div className='percent'>{expenseCount?.deltaPercent.toFixed(2)}% ({countDays(filter.date.from, filter.date.to)} days)</div>
                            </div>
                        </div>
                        <div>
                            <div className='mini-card color-3'>
                                <div className='title'> Total Purchase ({purchaseCount.count}) </div>
                                <div className='value'> ₹ {purchaseCount.amount.toFixed(2)}</div>
                                <div className='percent'>{purchaseCount.deltaPercent.toFixed(2)}% ({countDays(filter.date.from, filter.date.to)} days)</div>
                            </div>
                            <div className='mini-card color-4'>
                                <div className='title'> Total Stocks ({stockCount.count}) </div>
                                <div className='value'> ₹ {stockCount.totalValue.toFixed(2)} </div>
                                <div className='percent'>--% (-- days)</div>
                            </div>
                        </div>
                    </div>
                </Grid>
            </Grid>

            <br />





            <Grid container spacing={2}>

                <Grid item xs={12} md={6}>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        gap: '10px',
                    }}>
                        <ExpensePieChart data={expenses} width={'50%'} height={350} />
                        <SalesVSPurchaseGraph width={'50%'} height={350} />
                    </div>
                </Grid>

                <Grid item xs={12} md={6}>
                    <SalesChart width={'100%'} height={350} />
                </Grid>

                <Grid item xs={12} md={6}>
                    <SalesNPurchaseGraph width={'100%'} height={350} />
                </Grid>

                {/* TOP SELLING PRODUCTS */}

                {/* TOP CUSTOMERS */}

                {/* BALANCE SHEET */}

                {/* PROFIT & LOSS */}



            </Grid>


            {/* <DataTesting /> */}

        </div>
    )
}

export default Dashboard