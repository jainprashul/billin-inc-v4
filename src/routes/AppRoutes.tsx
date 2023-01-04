import React from 'react'
import { Route, BrowserRouter, Routes, Navigate } from 'react-router-dom'
import { Layout, NotFound } from '../components'
import { HOME, INVOICES, INVOICE_CREATE, INVOICE_DETAIL, LOGIN, SIGNUP, NOT_FOUND, INVOICE_EDIT, PURCHASE, PURCHASE_CREATE, PURCHASE_EDIT, STOCKS, STOCK_DETAIL, LEDGER, LEDGER_DETAIL, COMPANY, COMPANY_CREATE, COMPANY_EDIT, PURCHASE_DETAIL, SETTINGS, EXPENSES, NOTIFICATIONS, REPORTS, INTERNAL_CONFIG, WELCOME, LISENSE } from '../constants/routes'
import Dashboard from '../pages/Dashboard'
import Invoices, { InvoiceCreate, InvoiceDetail, InvoiceEdit } from '../pages/Invoices'
import Purchases, { PurchaseCreate, PurchaseDetails, PurchaseEdit } from '../pages/Purchases'
import Login from '../pages/Login'
import { StockDetail, Stocks } from '../pages/Stocks'
import Ledger, { LedgerDetails } from '../pages/Ledger'
import ErrorBoundary from '../components/shared/ErrorBoundary'
import Company, { CompanyCreate, CompanyEdit } from '../pages/Company'
import Settings from '../pages/Settings'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import { onStart,selectIsLoggedIn } from '../utils/utilsSlice'
import Expenses from '../pages/Expenses'
import Notifications from '../pages/Notifications'
import Reports from '../pages/Reports'
import { CompanyDBProvider } from '../utils/useCompanyDB'
import { DashboardProvider } from '../pages/Dashboard/useDashboard'
import Config from '../pages/Config'
import Welcome from '../pages/Welcome'
import Signup from '../pages/Signup'
import { useLocalStorage } from '../utils'
import Lisense from '../pages/Lisense'
import { checkLicense } from '../services/lisensing'

type Props = {}

const AppRoutes = (props: Props) => {

  const dispatch = useAppDispatch()
  const isAuthenticated = useAppSelector(selectIsLoggedIn)
  const [isFirstTime, setFirstTime] = useLocalStorage('ft', true)
  const [lisenseValid, setLisenseValid] = useLocalStorage('lv', true)

  React.useEffect(() => {
    dispatch(onStart())
    async function validation(){
      const valid = await checkLicense()
      console.log('valid ',valid)
      setLisenseValid(valid)
    }
    validation()

  }, [dispatch, setLisenseValid])

  // if (isFirstTime) {
  //   return <Welcome/>
  // }
  return (
    <ErrorBoundary>
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
                  <Route path={INTERNAL_CONFIG} element={<Config/>} />
                  <Route path={NOT_FOUND} element={<NotFound />} />
                </Routes>
              </Layout>
            ) : (
              <Routes>
                <Route path={LOGIN} element={<Login />} />
                <Route path={INTERNAL_CONFIG} element={<Config/>} />
                <Route path={SIGNUP} element={<Signup setFirstTime={setFirstTime}/>} />
                <Route path={WELCOME} element={<Welcome/>} />
                <Route path={LISENSE} element={<Lisense/>} />
                <Route path={NOT_FOUND} element={<Navigation path={LOGIN} firstTime={isFirstTime} valid={lisenseValid} />} />
              </Routes>
            )
          }
          </DashboardProvider>
        </CompanyDBProvider>
      </BrowserRouter>
    </ErrorBoundary>

  )
}

type NavigateProp = {
  path?: string
  firstTime?: boolean
  valid?: boolean
}
const Navigation = ({ path = HOME, firstTime=false , valid=false }: NavigateProp) => {
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