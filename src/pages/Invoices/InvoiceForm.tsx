import { Add } from '@mui/icons-material'
import TextField from '@mui/material/TextField';
import { Autocomplete, Button, Grid, InputAdornment, Typography } from '@mui/material'
import NavigationIcon from '@mui/icons-material/Navigation';
import { Invoices } from '../../services/database/model';
import ProductTable from './Products/ProductTable';
import { nanoid } from '@reduxjs/toolkit';
import useInvoiceForm from './useInvoiceForm';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import db from '../../services/database/db';
import ClientModel from './Client';
import { useSnackbar } from 'notistack';
import { useAppSelector } from '../../app/hooks';
import { selectGstEnabled } from '../../utils/utilsSlice';
import { useEffect } from 'react';
import moment from 'moment';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import DateProvider from '../../components/shared/DateProvider';
import { useDataUtils } from '../../utils/useDataUtils';


type Props = {
  onSubmit: (values: Invoices) => void
  invoice?: Invoices
  submitText?: string
}


let id = `inv_${nanoid(8)}`
let cid = `c_${nanoid(12)}`

const invoiceSchema = Yup.object().shape({
  // productIDs: Yup.array().of(Yup.string()).min(1, 'At least one product is required').required(),
})

const InvoiceForm = ({ onSubmit: handleSubmit, submitText = 'Generate Invoice', invoice = new Invoices({
  id,
  billingDate: new Date(),
  clientID: cid,
  companyID: parseInt(localStorage.getItem("companyID") ?? '1'),
  discount: false,
  discountValue: 0,
  gstEnabled: JSON.parse(localStorage.getItem("gstEnabled") || "false"),
  gstTotal: 0,
  productIDs: new Set<string>([]),
  subTotal: 0,
  voucherNo: '',
  voucherType: 'NON_GST'
}) }: Props) => {
  // console.log(invoice)
  const { enqueueSnackbar } = useSnackbar();

  const gstEnable = useAppSelector(selectGstEnabled)

  useEffect(() => {
    formik.setFieldValue('gstEnabled', gstEnable)
    return () => {

    }

  }, [gstEnable])

  const formik = useFormik({
    initialValues: invoice,
    onSubmit: onSubmit,
    validationSchema: invoiceSchema,
  });


  const { date, gross, gstAmt, total, clientOpen, setClientOpen,
    setDate, onAddProduct, onDeleteProduct,
    products, setProducts,
    customerGST, setCustomerGST,
    updateLedger, amountPaid, setAmountPaid,
    discount, setDiscount,
    invoiceNo, gstInvoiceNo, clientNames,
    setClientID, client, customerContact, customerName, setCustomerContact, setCustomerName,
    updateInvoiceVoucher, updateStock, validateInvoice, getVoucherType, printInvoice } = useInvoiceForm(formik.values)

  const { isMobile } = useDataUtils()

  // console.log(client, clientID);

  const clearForm = () => {
    formik.resetForm()
    setClientID('')
    setCustomerContact('')
    setCustomerName('')
    setCustomerGST('')
    setAmountPaid(0)
    setDiscount(0)
    setDate(new Date())
    setClientOpen(false)
    setProducts([])
    id = `inv_${nanoid(8)}`
    cid = `c_${nanoid(12)}`
  }


  function onSubmit(values: Invoices) {

    // check if invoice is valid
    const err = validateInvoice();
    if (err) {
      // alert(err)
      enqueueSnackbar(err, {
        variant: 'error',
        autoHideDuration: 2000,
        style: { whiteSpace: 'pre-line' },
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'center',
        },
      });
      return;
    }

    const companyDB = db.getCompanyDB(values.companyID);
    companyDB.transaction('rw', [...companyDB.tables], async () => {
      // save products to db
      products.forEach(product => {
        product.voucherID = values.id;
        product.companyID = values.companyID;
        product.save();
        values.productIDs.add(product.id);
        formik.setFieldValue('productIDs', values.productIDs);
      });

      const invoice = new Invoices({
        ...values,
        clientID: client.id,
        subTotal: gross,
        gstTotal: gstAmt,
        voucherNo: values.voucherNo.length > 0 ? values.voucherNo : gstEnabled ? gstInvoiceNo : invoiceNo.toFixed(0),
        voucherType: gstEnabled ? getVoucherType() : "NON_GST",
        discount: discount > 0,
        discountValue: discount,
        amountPaid: amountPaid,
      });

      console.log('inv', invoice);

      // update client data
      client.save();
      console.log(client);


      // check if invoice is valid
      updateLedger();
      updateStock();

      // update ledger done
      // update stock done
      // print invoice done
      // clear form done
      // send invoice to server 
      // send to whatsapp phone number
      console.log(invoice);
      printInvoice(invoice);
      handleSubmit(invoice);
      updateInvoiceVoucher();

      // once all done, clear form
      clearForm();
    });
  }

  if (Object.entries(formik.errors).length > 0) console.log(formik.errors)

  const { gstEnabled, voucherNo: billNo } = formik.values
  return (
    <div className="invoice-form">
      <Grid className='form-header' container direction='row' justifyContent='space-between' component="main" >
        <Grid item xs={12} sm={4} md={3}>
          <Autocomplete
            id="client-name"
            freeSolo
            value={customerName}
            options={clientNames}
            onChange={(event, value, reason, detail) => {
              console.log('auto', value, reason, detail);
              if (reason === 'selectOption') {
                setCustomerName(value as string)
                db.getCompanyDB(invoice.companyID).clients.get({ name: value }).then(client => {
                  // console.log(client);
                  setClientID(client?.id)
                })
              } else if (reason === 'clear') {
                setCustomerName('')
                setCustomerContact('')
                setCustomerGST('')
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
                setClientID(client.id)
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
              client.contacts[0].phone = event.target.value
            }}
          />
          <TextField variant='standard'
            margin="dense"
            fullWidth
            id="client_gst"
            name="client_gst"
            label="Customer GST"
            value={customerGST}
            onChange={(event) => {
              // console.log(event.target.value);
              setCustomerGST(event.target.value)
              client.gst = event.target.value
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
            value={billNo.length > 0 ? billNo : gstEnabled ? gstInvoiceNo : invoiceNo}
            disabled={true}
            InputProps={{
              startAdornment: <InputAdornment position="start">Inv.</InputAdornment>,
            }}
          />

          <div className="date" style={{
            marginTop: '0.5rem',
          }}>

            {/* <TextField variant='standard'
              margin="dense"
              required
              fullWidth
              id="billing_date"
              label="Billing Date"
              name="billing_date"
              type={'date'}
              value={moment(date).format('YYYY-MM-DD')}
              onChange={(event) => {
                console.log(event.target.value);
                setDate(new Date(event.target.value))
              }}
            /> */}
            <DateProvider>
            <DatePicker
              label="Billing Date"
              value={moment(date)}
              onChange={(newValue) => {
                setDate(moment(newValue).toDate())
                formik.setFieldValue('billingDate', moment(newValue).toDate())
              }}           
            >
              
            </DatePicker>
            </DateProvider>

          </div>

        </Grid>
      </Grid>
      <br />

      <div className="totals" style={{
        marginTop: '1rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
      }}>

        <div className="balances">
          <div className="subtotal">
            <Typography variant='inherit' color='textSecondary'>Subtotal: ₹{gross.toFixed(2)}</Typography>
          </div>

          <div className="tax">
            <Typography variant='inherit' color='textSecondary'>Tax : ₹{gstAmt.toFixed(2)}</Typography>
          </div>

          {discount > 0 ? (
            <>
              <div className="gross">
                <Typography variant='inherit' color='textSecondary'>Gross Amount: ₹{total.toFixed(2)}</Typography>
              </div>
              <div className="discount">
                <Typography variant='inherit' color='textSecondary'>Discount: ₹{discount.toFixed(2)}</Typography>
              </div>
              <div className="total">
                <Typography variant='inherit' color='textSecondary'>Total: ₹{(total - discount).toFixed(2)}</Typography>
              </div>
            </>
          ) : (<div className="total">
            <Typography variant='inherit' color='textSecondary'>Total: ₹{total.toFixed(2)}</Typography>
          </div>)}



        </div>

        <div className="submitBtn" style={{
          marginTop: isMobile ? 0 : '-3rem',
        }}>

          <TextField variant='standard' style={{
            maxWidth: '12rem',
            marginBottom: '1rem',
            marginRight: '1rem',
          }}
            margin="dense"
            fullWidth
            id="discount"
            name="discount"
            label="Discount"
            type="number"
            value={discount}
            onChange={(event) => {
              // console.log(event.target.value);
              setDiscount(Number(event.target.value))
            }}
          />
          <TextField variant='standard' style={{
            maxWidth: '12rem',
            marginBottom: '1rem',
          }}
            margin="dense"
            fullWidth
            id="amount_paid"
            name="amount_paid"
            label="Amount Paid"
            type="number"
            value={amountPaid}
            onChange={(event) => {
              // console.log(event.target.value);
              setAmountPaid(Number(event.target.value))
            }}
          />
          <br />

          <Button style={{
            float: isMobile ? 'inherit' : 'right',
          }} onClick={() => formik.handleSubmit()} variant="contained" color="primary" startIcon={<NavigationIcon />}>
            {submitText}
          </Button>

        </div>

      </div>
      <ProductTable gstEnabled={gstEnabled} products={products}
        eventFunctions={{
          onAddProduct,
          onDeleteProduct,
        }} />

      <ClientModel open={clientOpen} client={client} setOpen={setClientOpen} onClose={() => setClientOpen(false)} />
    </div>
  )
}

export default InvoiceForm