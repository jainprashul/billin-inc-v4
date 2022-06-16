import { Add } from '@mui/icons-material'
import TextField from '@mui/material/TextField';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { Autocomplete, Button, Grid, InputAdornment, Typography } from '@mui/material'
import Fab from '@mui/material/Fab';
import NavigationIcon from '@mui/icons-material/Navigation';
import { Invoices } from '../../services/database/model';
import ProductTable from './Products/ProductTable';
import { nanoid } from '@reduxjs/toolkit';
import useInvoiceForm from './useInvoiceForm';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import db from '../../services/database/db';
import ClientModel from './Client/Client';

type Props = {
  onSubmit: (values: Invoices) => void
  invoice?: Invoices
  submitText?: string
}

const id = `inv_${nanoid(8)}`

const invoiceSchema = Yup.object().shape({
  // productIDs: Yup.array().of(Yup.string()).min(1, 'At least one product is required').required(),
})

const InvoiceForm = ({ onSubmit: handleSubmit, submitText = 'Generate Invoice', invoice = new Invoices({
  id,
  billingDate: new Date(),
  clientID: nanoid(),
  companyID: 1,
  discount: false,
  discountValue: 0,
  gstEnabled: true,
  gstTotal: 0,
  productIDs: new Set<string>([]),
  subTotal: 0,
  voucherNo: '',
  voucherType: 'NON_GST'
}) }: Props) => {
  // console.log(invoice)


  const { date, gross, gstAmt, total, clientOpen, setClientOpen, setDate, onAddProduct, onDeleteProduct, products, setProducts, invoiceNo, gstInvoiceNo, clientNames, setClientID, client, customerContact, customerName, setCustomerContact, setCustomerName, updateInvoiceVoucher } = useInvoiceForm(invoice)

  // console.log(client, clientID);

  const clearForm = () => {
    setClientID('')
    setCustomerContact('')
    setCustomerName('')
    setDate(new Date())
    setClientOpen(false)
    setProducts([])
    formik.resetForm()
  }
  

  const onSubmit = (values: Invoices) => {
    
    products.forEach(product => {
      product.save()
      values.productIDs.add(product.id)
      formik.setFieldValue('productIDs', values.productIDs)
    })

    const invoice = new Invoices({
      ...values,
      clientID: client.id,
      subTotal: gross,
      gstTotal: gstAmt,
      voucherNo: gstEnabled ? gstInvoiceNo : invoiceNo.toFixed(0),
    })

    updateInvoiceVoucher({
      invoiceNo,
      gstInvoiceNo: Number(gstInvoiceNo.replace('G-', ''))
    })
    
    console.log(invoice);
    handleSubmit(invoice)
    clearForm()
  }



  const formik = useFormik({
    initialValues: invoice,
    onSubmit: onSubmit,
    validationSchema: invoiceSchema,
  });

  Object.entries(formik.errors).length > 0 && console.log(formik.errors)

  const { gstEnabled } = formik.values
  return (
    <div className="invoice-form">
      <Grid className='form-header' container direction='row' justifyContent='space-between' component="main" >
        <Grid item xs={12} sm={4} md={3}>
          {/* <TextField variant='standard'
            margin="dense"
            required
            fullWidth
            id="client_name"
            label="Customer Name"
            name="client_name"
            autoComplete="name"
            autoFocus
          /> */}
          <Autocomplete
            id="client-name"
            freeSolo
            value={customerName}
            options={clientNames}
            onChange={(event, value, reason ,detail ) => {
              console.log(value, reason, detail);
              if (reason === 'selectOption') {
                setCustomerName(value as string)
                db.getCompanyDB(invoice.companyID).clients.get({ name : value }).then(client => {
                  // console.log(client);
                  setClientID(client?.id)
                })
              } else if (reason === 'clear') {
                setCustomerName('')
                setCustomerContact('')
                setClientID('')
              }
            }}
            renderInput={(params) => <TextField {...params} variant='standard'
              margin="dense"
              required
              fullWidth
              id="client_name"
              label="Customer Name"
              name="client_name"
              autoComplete="name"
              autoFocus
              onChange={(event) => {
                // console.log(event.target.value);
                setCustomerName(event.target.value)
              }}
            />}
          />
          <TextField variant='standard'
            margin="dense"
            fullWidth
            id="client_contact"
            name="client_contact"
            label="Customer Contact"
            type="tel"
            autoComplete="phone"
            value={customerContact}
            onChange={(event) => {
              // console.log(event.target.value);
              setCustomerContact(event.target.value)
            }}
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
          <Button variant="text" color="secondary" size='small' startIcon={<Add />} onClick={() => setClientOpen(true)}>
            <Typography variant='caption' color='secondary'>Customer Details </Typography>
          </Button>
        </Grid>
        <Grid item xs={12} sm={4} md={3}>
          <TextField variant='standard'
            margin="dense"
            required
            fullWidth
            id="invoice_number"
            label="Invoice No."
            name="invoice_number"
            autoComplete="invoiceNo"
            value={gstEnabled ? gstInvoiceNo : invoiceNo}
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
          <Typography variant='inherit' color='textSecondary'>Subtotal: ₹{gross.toFixed(2)}</Typography>
        </div>

        <div className="tax">
          <Typography variant='inherit' color='textSecondary'>Tax : ₹{gstAmt.toFixed(2)}</Typography>
        </div>

        <div className="total">
          <Typography variant='h6' color='textSecondary'>Total: ₹{total.toFixed(2)}</Typography>

        </div>

      </div>
      <ProductTable products={products}
        eventFunctions={{
          onAddProduct,
          onDeleteProduct,
        }} />

      <Fab onClick={() => formik.handleSubmit()} style={{
        position: 'absolute',
        bottom: '1rem',
        right: '1rem',
        marginTop: '1rem',
        marginBottom: '1rem',
      }} variant="extended">
        <NavigationIcon sx={{ mr: 1 }} />
        {submitText}
      </Fab>

      <ClientModel open={clientOpen} client={client} setOpen={setClientOpen} onClose={() => setClientOpen(false)} />
    </div>
  )
}

export default InvoiceForm