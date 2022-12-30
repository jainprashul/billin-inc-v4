import { Grid, Stack, Typography } from '@mui/material'
import { useAppSelector } from '../../app/hooks'
import { DataTesting } from '../../components'
import Filters from '../../components/shared/Filters'
import LoadingX from '../../components/shared/LoadingX'
import Time from '../../components/shared/Time'
import authService from '../../services/authentication/auth.service'
import { countDays } from '../../utils'
import { selectExpenseCount, selectNotificationCount, selectPurchaseCount, selectSalesCount } from '../../utils/utilsSlice'
import ExpensePieChart from '../Expenses/ExpensePieChart'
import SalesChart from '../Invoices/SalesChart'
import SalesNPurchaseGraph from '../Invoices/SalesNPurchaseGraph'
import useDashboard from './useDashboard'

type Props = {}

const Dashboard = (props: Props) => {
    const user = authService.getUser();

    const notificationCount = useAppSelector(selectNotificationCount);
    const salesCount = useAppSelector(selectSalesCount);
    const purchaseCount = useAppSelector(selectPurchaseCount);
    const expenseCount = useAppSelector(selectExpenseCount);

    const { filterList, handleFilterChange, expenses, filter, companyDB } = useDashboard()

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
                <Filters filters={filterList} getFilters={handleFilterChange} />
            </Stack>



            <Grid container spacing={2} mt={1}>
                {/* Dashboard Summary */}
                <Grid item xs={12} md={6}>
                    <div style={{
                        backgroundImage: 'url("./assets/people.svg")',
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'center',
                        backgroundSize: 'contain',
                        minHeight: 300,
                        borderRadius: '1rem',
                        position: 'relative',
                    }}>
                        <div style={{
                            position: 'absolute',
                            top: '1rem',
                            right: '1rem',
                        }}>
                            <Typography variant="h6"><Time /></Typography>
                        </div>
                    </div>
                </Grid>

                <Grid item xs={12} md={6}>
                    <div className='dashboard-overall' style={{
                        minHeight: 300,
                    }}>
                        <div>
                            <div className='mini-card color-1'>
                                <div className='title'> Total Sales ({salesCount.count})</div>
                                <div className='value'> ₹ {salesCount.amount}  </div>
                                <div className='percent'>{salesCount.deltaPercent}% ({countDays(filter.date.from, filter.date.to)} days)</div>
                            </div>
                            <div className='mini-card color-2'>
                                <div className='title'> Total Expense ({expenseCount?.count}) </div>
                                <div className='value'> ₹ {expenseCount?.amount} </div>
                                <div className='percent'>{expenseCount?.deltaPercent}% ({countDays(filter.date.from, filter.date.to)} days)</div>
                            </div>
                        </div>


                        <div>
                            <div className='mini-card color-3'>
                                <div className='title'> Total Purchase ({purchaseCount.count}) </div>
                                <div className='value'> ₹ {purchaseCount.amount}</div>
                                <div className='percent'>{purchaseCount.deltaPercent}% ({countDays(filter.date.from, filter.date.to)} days)</div>
                            </div>
                            <div className='mini-card color-4'>
                                <div className='title'> Total Sales </div>
                                <div className='value'> ₹ 1,00,000 </div>
                                <div className='percent'>10% (30 days)</div>
                            </div>
                        </div>

                    </div>

                </Grid>


            </Grid>





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
                            <SalesChart width={300} height={330} />
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