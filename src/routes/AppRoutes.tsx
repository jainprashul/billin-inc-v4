import React from 'react'
import { Route, BrowserRouter, Routes, Navigate } from 'react-router-dom'
import { Layout, NotFound } from '../components'
import { HOME, INVOICES, INVOICE_CREATE, INVOICE_DETAIL, LOGIN, SIGNUP, NOT_FOUND, INVOICE_EDIT, PURCHASE, PURCHASE_CREATE, PURCHASE_EDIT, STOCKS, STOCK_DETAIL, LEDGER, LEDGER_DETAIL, COMPANY, COMPANY_CREATE, COMPANY_EDIT, PURCHASE_DETAIL, SETTINGS, EXPENSES, NOTIFICATIONS, REPORTS, INTERNAL_CONFIG, WELCOME, LISENSE, BANK_ACCOUNT, BANK_ACCOUNT_CREATE, BANK_ACCOUNT_EDIT, BANK_ACCOUNT_DETAIL } from '../constants/routes'
import ErrorBoundary from '../components/shared/ErrorBoundary'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import { onStart, selectIsLoggedIn } from '../utils/utilsSlice'
import { CompanyDBProvider } from '../utils/useCompanyDB'
import { DashboardProvider } from '../pages/Dashboard/useDashboard'
import { useLocalStorage } from '../utils'
import { checkLicense } from '../services/lisensing'
import { checktheNetworkStatus, selectServiceWorker, selectSWIsUpdated } from '../utils/service/swSlice'
import AlertDialog from '../components/shared/AlertDialog'
import LoadingX from '../components/shared/LoadingX'

// Use Lazy Loading for large components
const Dashboard = React.lazy(() => import('../pages/Dashboard'));

const Invoices = React.lazy(() => import('../pages/Invoices'));
const InvoiceCreate = React.lazy(() => import('../pages/Invoices/Create'));
const InvoiceDetail = React.lazy(() => import('../pages/Invoices/Details'));
const InvoiceEdit = React.lazy(() => import('../pages/Invoices/Edit'));

const Purchases = React.lazy(() => import('../pages/Purchases'));
const PurchaseCreate = React.lazy(() => import('../pages/Purchases/Create'));
const PurchaseEdit = React.lazy(() => import('../pages/Purchases/Edit'));
const PurchaseDetails = React.lazy(() => import('../pages/Purchases/Details'));

const Login = React.lazy(() => import('../pages/Login'));

const Stocks = React.lazy(() => import('../pages/Stocks/Stocks'));
const StockDetail = React.lazy(() => import('../pages/Stocks/StockDetail'));

const Company = React.lazy(() => import('../pages/Company'));
const CompanyCreate = React.lazy(() => import('../pages/Company/Create'));
const CompanyEdit = React.lazy(() => import('../pages/Company/Edit'));

const Ledger = React.lazy(() => import('../pages/Ledger'));
const LedgerDetails = React.lazy(() => import('../pages/Ledger/LedgerDetails'));

const Settings = React.lazy(() => import('../pages/Settings'));
const Expenses = React.lazy(() => import('../pages/Expenses'));
const Notifications = React.lazy(() => import('../pages/Notifications'));
const Reports = React.lazy(() => import('../pages/Reports'));
const Config = React.lazy(() => import('../pages/Config'));

const Welcome = React.lazy(() => import('../pages/Welcome'));
const Signup = React.lazy(() => import('../pages/Signup'));
const Lisense = React.lazy(() => import('../pages/Lisense'));

const BankAccount = React.lazy(() => import('../pages/Bank/Bank'));
const BankAccountCreate = React.lazy(() => import('../pages/Bank/Create'));
const BankAccountEdit = React.lazy(() => import('../pages/Bank/Edit'));
const BankAccountDetail = React.lazy(() => import('../pages/Bank/Details'));


type Props = {}

const AppRoutes = (props: Props) => {

  const dispatch = useAppDispatch()
  const isAuthenticated = useAppSelector(selectIsLoggedIn)
  const [isFirstTime, setFirstTime] = useLocalStorage('ft', true)
  const [lisenseValid, setLisenseValid] = useLocalStorage('lv', true)

  const isAppUpdateAvailable = useAppSelector(selectSWIsUpdated)
  const sw = useAppSelector(selectServiceWorker)

  function updateApp() {
      const registrationWaiting = sw?.waiting;
      if (registrationWaiting) {
        registrationWaiting.postMessage({ type: 'SKIP_WAITING' });
        registrationWaiting.addEventListener('statechange', e => {
          if (e.target && (e.target as any).state === 'activated') {
            window.location.reload();
          }
        });
      }
  }

  React.useEffect(() => {
    dispatch(onStart())
    async function validation() {
      const valid = await checkLicense()
      console.log('valid ', valid)
      setLisenseValid(valid)
    }
    validation()

    checktheNetworkStatus()

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch])

  // if (isFirstTime) {
  //   return <Welcome/>
  // }
  return (
    <ErrorBoundary>
      <React.Suspense fallback={<LoadingX />}>
      <BrowserRouter >
        {/* <ErrorBoundary> */}
        <CompanyDBProvider>
          <DashboardProvider>          {
            isAuthenticated ? (
              <Layout>
                <Routes>
                  <Route path={HOME} element={<Dashboard />} />
                  <Route path={LOGIN} element={<Navigation />} />
                  <Route path={SIGNUP} element={<Navigation />} />
                  
                  <Route path={INVOICES} element={<Invoices />} />
                  <Route path={INVOICE_CREATE} element={<InvoiceCreate />} />
                  <Route path={INVOICE_EDIT} element={<InvoiceEdit />} />
                  <Route path={INVOICE_DETAIL} element={<InvoiceDetail />} />

                  <Route path={PURCHASE} element={<Purchases />} />
                  <Route path={PURCHASE_CREATE} element={<PurchaseCreate />} />
                  <Route path={PURCHASE_EDIT} element={<PurchaseEdit />} />
                  <Route path={PURCHASE_DETAIL} element={<PurchaseDetails />} />

                  <Route path={STOCKS} element={<Stocks />} />
                  <Route path={STOCK_DETAIL} element={<StockDetail />} />

                  <Route path={LEDGER} element={<Ledger />} />
                  <Route path={LEDGER_DETAIL} element={<LedgerDetails />} />

                  <Route path={EXPENSES} element={<Expenses />} />
                  <Route path={COMPANY} element={<Company />} />
                  <Route path={COMPANY_CREATE} element={<CompanyCreate />} />
                  <Route path={COMPANY_EDIT} element={<CompanyEdit />} />

                  <Route path={SETTINGS} element={<Settings />} />
                  <Route path={REPORTS} element={<Reports />} />
                  <Route path={NOTIFICATIONS} element={<Notifications />} />
                  <Route path={INTERNAL_CONFIG} element={<Config />} />

                  <Route path={BANK_ACCOUNT} element={<BankAccount/>} />
                  <Route path={BANK_ACCOUNT_CREATE} element={<BankAccountCreate/>} />
                  <Route path={BANK_ACCOUNT_EDIT} element={<BankAccountEdit/>} />
                  <Route path={BANK_ACCOUNT_DETAIL} element={<BankAccountDetail/>} />

                  <Route path={NOT_FOUND} element={<NotFound />} />
                </Routes>
              </Layout>
            ) : (
              <Routes>
                {
                  (!isFirstTime && lisenseValid) && (<>
                    <Route path={LOGIN} element={<Login />} />
                  </>)
                }
                <Route path={INTERNAL_CONFIG} element={<Config />} />
                <Route path={SIGNUP} element={isFirstTime ? <Signup setFirstTime={setFirstTime} /> : <Navigation />} />
                <Route path={WELCOME} element={<Welcome />} />
                <Route path={LISENSE} element={<Lisense />} />
                <Route path={NOT_FOUND} element={<Navigation path={LOGIN} firstTime={isFirstTime} valid={lisenseValid} />} />
              </Routes>
            )
          }
          </DashboardProvider>
        </CompanyDBProvider>
      </BrowserRouter>
      <AlertDialog
        open={isAppUpdateAvailable}
        setOpen={() => { }}
        title="Update Available"
        message="New version of the app is available. Please refresh the page to update."
        confirmText='Refresh'
        onConfirm={() => updateApp()}
        showCancel={false}
      />
      </React.Suspense>
    </ErrorBoundary>

  )
}

type NavigateProp = {
  path?: string
  firstTime?: boolean
  valid?: boolean
}
const Navigation = ({ path = HOME, firstTime = false, valid = true }: NavigateProp) => {
  if (!valid) {
    return <Navigate to={LISENSE} replace />
  }
  if (firstTime) {
    return <Navigate to={WELCOME} replace />
  }
  return (
    <Navigate to={path} replace />
  )
}

export default AppRoutes