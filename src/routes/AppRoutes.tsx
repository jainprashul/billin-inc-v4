import React from 'react'
import { Route, BrowserRouter, Routes, Navigate } from 'react-router-dom'
import { Layout, NotFound } from '../components'
import { HOME, INVOICES, INVOICE_CREATE, INVOICE_DETAIL, LOGIN, SIGNUP, NOT_FOUND } from '../constants/routes'
import Invoices, { InvoiceCreate, InvoiceDetail } from '../pages/Invoices'
import Login from '../pages/Login'

type Props = {}

const AppRoutes = (props: Props) => {
  const [isAuthenticated, setIsAuthenticated] = React.useState(false)
  return (
    <BrowserRouter>
      {
        isAuthenticated ? (
          <Layout>
            <Routes>
              <Route path={HOME} element={<h1>Home</h1>} />
              <Route path={LOGIN} element={<Navigation/>} />
              <Route path={SIGNUP} element={<Navigation/>} />
              <Route path={INVOICES} element={<Invoices />} />
              <Route path={INVOICE_CREATE} element={<InvoiceCreate />} />
              <Route path={INVOICE_DETAIL} element={<InvoiceDetail />} />
              <Route path={NOT_FOUND} element={<NotFound />} />
            </Routes>
          </Layout>
        ) : (
          <Routes>
            <Route path={LOGIN} element={<Login />} />
            <Route path={SIGNUP} element={<h1>Signup</h1>} />
            <Route path={NOT_FOUND} element={<Navigation path={LOGIN}/>} />
          </Routes>
        )
      }

    </BrowserRouter>
  )
}

type NavigateProp = {
  path?: string
}
const Navigation = ({ path = HOME  }: NavigateProp) => {
  return (
    <Navigate to={path} replace />
  )
}

export default AppRoutes