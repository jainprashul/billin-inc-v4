import React from 'react'
import { Route, BrowserRouter, Routes } from 'react-router-dom'
import { Layout, NotFound } from '../components'
import { HOME, INVOICES, INVOICE_CREATE, INVOICE_DETAIL, LOGIN, SIGNUP, NOT_FOUND } from '../constants/routes'

type Props = {}

const AppRoutes = (props: Props) => {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path={HOME} element={<h1>Home</h1>} />
          <Route path={LOGIN} element={<h1>Login</h1>} />
          <Route path={SIGNUP} element={<h1>Signup</h1>} />
          <Route path={INVOICES} element={<h1>Invoices</h1>} />
          <Route path={INVOICE_CREATE} element={<h1>Invoices Create</h1>} />
          <Route path={INVOICE_DETAIL} element={<h1>Invoices Detail</h1>} />
          <Route path={NOT_FOUND} element={<NotFound />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}

export default AppRoutes