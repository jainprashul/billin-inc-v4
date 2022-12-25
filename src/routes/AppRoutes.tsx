import React from 'react'
import { Route, BrowserRouter, Routes, Navigate } from 'react-router-dom'
import { Layout, NotFound } from '../components'
import { HOME, INVOICES, INVOICE_CREATE, INVOICE_DETAIL, LOGIN, SIGNUP, NOT_FOUND, INVOICE_EDIT, PURCHASE, PURCHASE_CREATE, PURCHASE_EDIT, STOCKS, STOCK_DETAIL, LEDGER, LEDGER_DETAIL, COMPANY, COMPANY_CREATE, COMPANY_EDIT, PURCHASE_DETAIL,SETTINGS } from '../constants/routes'
import Dashboard from '../pages/Dashboard'
import Invoices, { InvoiceCreate, InvoiceDetail, InvoiceEdit } from '../pages/Invoices'
import Purchases, { PurchaseCreate, PurchaseDetails, PurchaseEdit } from '../pages/Purchases'
import Login from '../pages/Login'
import { StockDetail, Stocks } from '../pages/Stocks'
import Ledger, { LedgerDetails } from '../pages/Ledger'
import ErrorBoundary from '../components/shared/ErrorBoundary'
import Company, { CompanyCreate, CompanyEdit } from '../pages/Company'
import Settings from '../pages/Settings'

type Props = {}

const AppRoutes = (props: Props) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isAuthenticated, setIsAuthenticated] = React.useState(true);


  return (
    <ErrorBoundary>
      <BrowserRouter >
        {/* <ErrorBoundary> */}
        {
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
                <Route path={COMPANY} element={<Company />} />
                <Route path={COMPANY_CREATE} element={<CompanyCreate />} />
                <Route path={COMPANY_EDIT} element={<CompanyEdit />} />
                <Route path={SETTINGS} element={<Settings />} />
                <Route path={NOT_FOUND} element={<NotFound />} />
              </Routes>
            </Layout>
          ) : (
            <Routes>
              <Route path={LOGIN} element={<Login />} />
              <Route path={SIGNUP} element={<h1>Signup</h1>} />
              <Route path={NOT_FOUND} element={<Navigation path={LOGIN} />} />
            </Routes>
          )
        }

      </BrowserRouter>
    </ErrorBoundary>

  )
}

type NavigateProp = {
  path?: string
}
const Navigation = ({ path = HOME }: NavigateProp) => {
  return (
    <Navigate to={path} replace />
  )
}

export default AppRoutes