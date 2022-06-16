
import { useLiveQuery } from 'dexie-react-hooks';
import { useFormik } from 'formik';
import { useEffect, useState } from 'react'
import db from '../../services/database/db';
import { Client, Invoices, Product } from '../../services/database/model';


const useInvoiceForm = (invoice: Invoices) => {
  const [date, setDate] = useState<Date | null>(new Date())
  const [products, setProducts] = useState<Product[]>(invoice?.products || []);
  const [total, setTotal] = useState<number>(invoice?.totalAmount);
  const [gross, setGross] = useState<number>(invoice?.grossTotal);
  const [gstAmt, setGstAmt] = useState<number>(invoice?.gstTotal);

  const [clientID, setClientID] = useState<string | undefined>(invoice?.clientID);

  const [clientOpen, setClientOpen] = useState<boolean>(false);
  const [customerName, setCustomerName] = useState<string>('');
  const [customerGST, setCustomerGST] = useState<string>('');
  const [customerContact, setCustomerContact] = useState<string>('');

  // console.log(invoice?.companyID);

  const query = useLiveQuery(async () => {
    return {
      invoiceNo: await db.companies.get(invoice?.companyID).then(company => company?.lastInvoiceNo) as number,
      gstInvoiceNo: await db.companies.get(invoice?.companyID).then(company => company?.lastGSTInvoiceNo) as number,
      clientNames: await db.getCompanyDB(invoice?.companyID).clients.orderBy("name").keys(),
    }
  })

  const client = useLiveQuery(async () => {
    if (clientID) {
      const res = await db.getCompanyDB(invoice?.companyID)?.clients.get(clientID);
      res ? setCustomerContact(res.contacts[0].phone as string) : setCustomerContact('');
      return res;
    }
    return new Client({
      name: customerName,
      address: { address: '', city: '', state: '', },
      companyID: 1,
      contacts: [{ name: customerName, email: '', phone: customerContact, mobile: '' }],
      details: '',
      gst: '',
    })
  }, [clientID, customerName, customerContact])

  useEffect(() => {
    const { grossTotal, totalAmount, gstTotal } = products.reduce(
      (acc, cur) => {
        acc.grossTotal += cur.grossAmount;
        acc.totalAmount += cur.totalAmount;
        acc.gstTotal += cur.gstAmount;
        return acc;
      }
      , { grossTotal: 0, totalAmount: 0, gstTotal: 0 }
    );

    setGross(grossTotal);
    setTotal(totalAmount);
    setGstAmt(gstTotal);
    return () => {
      setGross(invoice.grossTotal);
      setTotal(invoice.totalAmount);
      setGstAmt(invoice.gstTotal);
    }
  }, [invoice.grossTotal, invoice.gstTotal, invoice.totalAmount, products])

  const onAddProduct = (product: Product) => {
    product.voucherID = invoice.id;
    console.log('useInvFOrm', product)

    setProducts([...products, product])
  }

  const onDeleteProduct = (product: Product) => {
    setProducts(products.filter(p => p.id !== product.id))
  }

  const updateInvoiceVoucher = ({ invoiceNo, gstInvoiceNo }: any) => {
    const obj = invoice.gstEnabled ? {
        lastGSTInvoiceNo: gstInvoiceNo,
      } : {
        lastInvoiceNo: invoiceNo,
      }
    db.companies.update(invoice.companyID, obj)
  }

  return {
    invoiceNo: query ? query.invoiceNo + 1 : 1,
    gstInvoiceNo: query ? `G-${query.gstInvoiceNo + 1}` : `G-${1}`,
    clientNames: query ? query.clientNames : [],
    client: client ? client : new Client({
      name: customerName,
      address: { address: '', city: '', state: '', },
      companyID: 1,
      contacts: [{ name: customerName, email: '', phone: customerContact, mobile: '' }],
      details: '',
      gst: '',
    }),
    customerContact, customerGST, customerName,
    setCustomerName, setCustomerGST, setCustomerContact,
    date, setDate,
    clientID, setClientID,
    clientOpen, setClientOpen,
    products, setProducts,
    gross, setGross,
    total, setTotal,
    gstAmt, setGstAmt,
    onAddProduct,
    onDeleteProduct,
    updateInvoiceVoucher,
  }
}


export default useInvoiceForm;