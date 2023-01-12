import { AddBox, InstallDesktop } from '@mui/icons-material'
import { Button, Grid, Stack, Typography } from '@mui/material'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import Filters from '../../components/shared/Filters'
import LoadingX from '../../components/shared/LoadingX'
import Time from '../../components/shared/Time'
import { COMPANY_CREATE, INVOICE_CREATE, PURCHASE_CREATE } from '../../constants/routes'
import authService from '../../services/authentication/auth.service'
import { countDays } from '../../utils'
import { selectExpenseCount, selectPurchaseCount, selectSalesCount, selectStockCount } from '../../utils/utilsSlice'
import ExpensePieChart from '../Expenses/ExpensePieChart'
import SalesChart from '../Invoices/SalesChart'
import SalesNPurchaseGraph from '../Invoices/SalesNPurchaseGraph'
import SalesVSPurchaseGraph from '../Invoices/SalesVSPurchaseGraph'
import useDashboard from './useDashboard'
import animationData from '../../assets/office.json'
import Lottie from 'lottie-react';
import { selectPromptEvent, selectShowInstallPrompt, setInstallPrompt } from '../../utils/service/swSlice'
import TopSellingProducts from '../Stocks/TopSellingProducts'


type Props = {}

const Dashboard = (props: Props) => {
    const user = authService.getUser();
    const dispatch = useAppDispatch()

    const salesCount = useAppSelector(selectSalesCount);
    const purchaseCount = useAppSelector(selectPurchaseCount);
    const expenseCount = useAppSelector(selectExpenseCount);
    const stockCount = useAppSelector(selectStockCount);

    const { filterList, handleFilterChange, expenses, filter, companyDB, navigate, notificationCount, isMobile } = useDashboard()

    const showInstall = useAppSelector(selectShowInstallPrompt)
    const installPrompt = useAppSelector(selectPromptEvent)

    function handleInstall() {
        if (installPrompt) {
            installPrompt.prompt()
            installPrompt.userChoice.then((choiceResult: any) => {
                if (choiceResult.outcome === 'accepted') {
                    dispatch(setInstallPrompt({
                        showInstallPrompt: false,
                        promptEvent: null,
                    }))
                    console.log('User accepted the A2HS prompt');
                } else {
                    console.log('User dismissed the A2HS prompt');
                }
            })
        }
    }

    if (!companyDB) {
        return <>
            <div style={{
                display: 'flex',
                height: '100%',
                flexWrap: 'wrap',
                justifyContent: 'space-between',
                minWidth: '110%',
                alignItems: 'center',
                flexDirection: isMobile ? 'column' : 'row',
            }}>
                <div style={{
                    flex: '1',
                }}>
                    <Typography variant='h5'> Welcome , <b>{user?.name}</b></Typography>
                    <br />
                    <Typography variant='h4'>
                        Looks like you have not setup your company yet!
                    </Typography>
                    <br />
                    <Typography variant='h5'>
                        Please setup your company to continue.
                    </Typography>
                    <br />
                    <Button variant='contained' color='primary' onClick={() => navigate(COMPANY_CREATE)}>Getting Started</Button>

                </div>

                <Lottie animationData={animationData} style={{
                    width: 'clamp(300px, 700px, 900px)',
                    maxWidth: isMobile ? '68dvw' : '',
                    marginTop: '1rem',
                    flex: '1',
                }} />


            </div>
            <LoadingX />
        </>
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

                <div style={{
                    display: 'flex',
                    gap: '1rem',
                    alignItems: 'baseline'
                }}>
                    { showInstall && <Button variant="contained" color='primary' startIcon={<InstallDesktop />} onClick={() => handleInstall()}>Install App</Button>}
                    <Button variant="contained" color='primary' startIcon={<AddBox />} onClick={() => navigate(INVOICE_CREATE)}>New Invoice</Button>
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
                <Grid item xs={12} md={6}>
                    <TopSellingProducts width={'100%'} height={350} />
                </Grid>

                {/* TOP CUSTOMERS */}

                {/* BALANCE SHEET */}

                {/* PROFIT & LOSS */}



            </Grid>


            {/* <DataTesting /> */}

        </div>
    )
}

export default Dashboard