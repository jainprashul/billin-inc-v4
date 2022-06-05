import { Add } from '@mui/icons-material'
import TextField from '@mui/material/TextField';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { Button, Grid, Icon, InputAdornment, Typography } from '@mui/material'
import Fab from '@mui/material/Fab';
import NavigationIcon from '@mui/icons-material/Navigation';
import React, { useState } from 'react'
import { Invoices, Product } from '../../services/database/model';
import ProductTable from './Products/ProductTable';
import { nanoid } from '@reduxjs/toolkit';
import useInvoiceForm from './useInvoiceForm';

type Props = {
  onSubmit: () => void
  invoice?: Invoices
  submitText?: string
}

const InvoiceForm = ({ onSubmit: handleSubmit, submitText = 'Generate Invoice', invoice }: Props) => {

  const { date, setDate, onAddProduct , onDeleteProduct , products } = useInvoiceForm(invoice)

  const onSubmit = () => {
    handleSubmit()
  }

  return (
    <div className="invoice-form">
      <Grid className='form-header' container direction='row' justifyContent='space-between' component="main" >
        <Grid item xs={false} sm={4} md={3}>
          <TextField variant='standard'
            margin="dense"
            required
            fullWidth
            id="client_name"
            label="Customer Name"
            name="client_name"
            autoComplete="name"
            autoFocus
          />
          <TextField variant='standard'
            margin="dense"
            fullWidth
            id="client_contact"
            name="client_contact"
            label="Customer Contact"
            type="tel"
            autoComplete="phone"
          />
          {/* <TextField
          margin="dense"
          fullWidth
          id="client_details"
          name="client_details"
          label="Customer Description"
          multiline
          minRows={3}
        /> */}
          <Button variant="text" color="secondary" size='small' startIcon={<Add />}><Typography variant='caption' color='secondary'>Customer Details </Typography></Button>
        </Grid>
        <Grid item xs={false} sm={4} md={3}>
          <TextField variant='standard'
            margin="dense"
            required
            fullWidth
            id="invoice_number"
            label="Invoice No."
            name="invoice_number"
            autoComplete="invoiceNo"
            value={1}
            disabled={true}
            InputProps={{
              startAdornment: <InputAdornment position="start">Inv.</InputAdornment>,
            }}
          />

          <div className="date" style={{
            marginTop: '0.5rem',
          }}>
            <LocalizationProvider dateAdapter={AdapterMoment}>
              <DatePicker
                label="Billing Date"
                value={date}
                onChange={(newValue) => {
                  setDate(newValue)

                }}
                renderInput={(params) => <TextField {...params} />}
              />
            </LocalizationProvider>
          </div>

        </Grid>
      </Grid>

      <div className="totals" style={{
        marginTop: '1rem',
        display: 'flex',
        justifyContent: 'space-between',
      }}>

        <div className="subtotal">
          <Typography variant='inherit' color='textSecondary'>Subtotal: ₹0.00</Typography>
        </div>

        <div className="tax">
          <Typography variant='inherit' color='textSecondary'>Tax : ₹0.00</Typography>
        </div>

        <div className="total">
          <Typography variant='h6' color='textSecondary'>Total: ₹0.00</Typography>

        </div>

      </div>
      <ProductTable products={products} 
        eventFunctions={{
          onAddProduct,
          onDeleteProduct,
        }}/>

      <Fab onClick={handleSubmit} style={{
        position: 'absolute',
        bottom: '1rem',
        right: '1rem',
        marginTop: '1rem',
        marginBottom: '1rem',
      }} variant="extended">
        <NavigationIcon sx={{ mr: 1 }} />
        {submitText}
      </Fab>
    </div>
  )
}

export default InvoiceForm