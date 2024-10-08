import { nanoid } from '@reduxjs/toolkit';
import { useLiveQuery } from 'dexie-react-hooks';
import { useEffect, useState } from 'react'
import invoicePattern from '../../components/PDF/InvoicePattern';
import db from '../../services/database/db';
import { Client, Company, Invoices, Ledger, Product, Stock, StockLog } from '../../services/database/model';
import { Invoice } from '../../services/database/model/Invoices';
import { useDataUtils } from '../../utils/useDataUtils';

// Create client ID if it doesn't exist yet
const cid = `c_${nanoid(12)}`

const useInvoiceForm = (invoice: Invoices) => {
  const { companyID, getAccountDetails } = useDataUtils();
  // console.log(invoice)
  const [date, setDate] = useState<Date | null>(new Date())
  const [products, setProducts] = useState<Product[]>(invoice?.products || []);
  const [total, setTotal] = useState<number>(invoice?.totalAmount);
  const [gross, setGross] = useState<number>(invoice?.grossTotal);
  const [gstAmt, setGstAmt] = useState<number>(invoice?.gstTotal);
  const [amountPaid, setAmountPaid] = useState<number>(invoice?.amountPaid || 0);
  const [discount, setDiscount] = useState<number>(invoice?.discountValue || 0);

  const [clientID, setClientID] = useState<string | undefined>(invoice?.clientID);

  const [clientOpen, setClientOpen] = useState<boolean>(false);
  const [customerName, setCustomerName] = useState<string>(invoice?.client?.name || '');
  const [customerGST, setCustomerGST] = useState<string>('');
  const [customerContact, setCustomerContact] = useState<string>('');

  const companyDB = db.getCompanyDB(invoice?.companyID);

  const query = useLiveQuery(async () => {
    return {
      company: await db.companies.get(invoice?.companyID) as Company,
      // gstInvoiceNo: await db.companies.get(invoice?.companyID).then(company => company?.lastGSTInvoiceNo) as number,
      clientNames: await companyDB?.clients.orderBy("name").keys() ?? [],
    }
  }, [companyDB]);

  const invoiceNo = query ? query.company.lastInvoiceNo + 1 : 1;
  const gstInvoiceNo = query ? `G-${query.company.lastGSTInvoiceNo + 1}` : `G-${1}`;

  const client = useLiveQuery(async () => {
    if (clientID) {
      const res = await db.getCompanyDB(invoice?.companyID)?.clients.get(clientID);
      // res && setCustomerName(res.name) ;
      if (res) {
        // setCustomerName(res.name);
        setCustomerContact(res.contacts[0].phone as string);
        setCustomerGST(res.gst as string);
      } else {
        setCustomerContact('');
        setCustomerGST('');
      }
      return res;
    }
  }, [clientID, customerName]);

  const clientX = client ? client : new Client({
    id: cid,
    name: customerName,
    address: { address: '', city: '', state: '', },
    companyID,
    contacts: [{ name: customerName, email: '', phone: customerContact, mobile: '' }],
    details: '',
    gst: customerGST,
  })

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
      setGstAmt(gstTotal);
    }
  }, [invoice.grossTotal, invoice.gstTotal, invoice.totalAmount, products])

  const onAddProduct = (product: Product) => {
    // product.voucherID = invoice.id;
    console.log('useInvFOrm', product)
    setProducts([...products, product])
  }

  const onDeleteProduct = (product: Product) => {
    setProducts(products.filter(p => p.id !== product.id))
  }

  const updateInvoiceVoucher = () => {
    const obj = invoice.gstEnabled ? {
      lastGSTInvoiceNo: Number(gstInvoiceNo.replace('G-', '')),
    } : {
      lastInvoiceNo: invoiceNo,
    }
    db.companies.update(invoice.companyID, obj)
  }

  const validateInvoice = () => {
    let err = '';

    if (customerName === '') {
      err += 'Please enter customer name. \n';
    }

    // if (invoice.gstEnabled && customerGST === '') {
    //   err += 'Please enter customer GST. \n';
    // }

    if (products.length === 0) {
      err += 'Please add atleast one product. \n';
    }

    if (amountPaid < 0) {
      err += 'Please enter valid amount paid.';
    }

    return err.trim().length > 0 ? err : null;
  }

  /** Print Bill from PDF
 * @param invoice
 */
  const printBill = (invoice: any) => {
    console.log('printBill', invoice)
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    document.body.appendChild(iframe);
    iframe.contentDocument?.write(invoicePattern(invoice));
    iframe.contentDocument?.close();
    iframe.contentWindow?.focus();
    iframe.contentWindow?.print();
  }

  const printInvoice = async (invoice: Invoice) => {
    const account = await getAccountDetails();
    const printInv = {
      ...invoice,
      products,
      client: clientX,
      // voucherNo: invoice.gstEnabled ? gstInvoiceNo : invoiceNo.toFixed(0),
      company: query?.company,
      amountPaid: amountPaid,
      account,
    }
    printBill(printInv);
  }

  const getVoucherType = () => {
    const companyGST = query?.company.gst.substring(0, 2);
    let clientGST = client?.gst.substring(0, 2);
    if (!clientGST) {
      clientGST = companyGST;
    }
    if (companyGST === clientGST) {
      return "INTRA_STATE";
    }
    return "INTER_STATE";
  }

  const updateLedger = async () => {
    const newLedger = new Ledger({
      companyID: invoice.companyID,
      date: date as Date,
      voucherNo: invoice.gstEnabled ? gstInvoiceNo : invoiceNo.toFixed(0),
      voucherType: 'SALES',
      clientID: clientID as string,
      clientType: 'CUSTOMER',
      credit: amountPaid,
      debit: total - discount,
      payable: 0,
      payableType: 'CASH',
      receivable: total - (discount + amountPaid),
      receivableType: 'CASH',
      cash: 0,
    })

    if (newLedger.receivableType === 'CASH') {
      newLedger.cash = newLedger.credit;
    }

    newLedger.save();
  }

  const updateStock = async () => {
    products.forEach(async (product) => {
      const stock = await db.getCompanyDB(invoice.companyID)?.stocks.get({ name: product.name, companyID: invoice.companyID });
      if (stock) {
        db.getCompanyDB(invoice.companyID)?.stocks.update(stock.id, {
          quantity: stock.quantity - product.quantity,
        });

        // create stock log
        const stockLog = new StockLog({
          companyID: invoice.companyID,
          clientID: clientID as string,
          clientName: client?.name as string,

          date: date as Date,
          logType: 'SALE',
          quantity: -1 * product.quantity,
          rate: product.price,
          amount: product.totalAmount,
          voucherNo: invoice.gstEnabled ? gstInvoiceNo : invoiceNo.toFixed(0),
          stockID: stock.id,
        })
        // save stock log and update stock quantity and log ids
        stockLog.save();

        stock.logIDs.add(stockLog.id);
        stock.quantity -= product.quantity;
        stock.save();

      } else {
        // create stock and its opening stock log
        const newStock = new Stock({
          name: product.name,
          quantity: -1 * product.quantity,
          companyID: invoice.companyID,
          gstRate: product.gstRate,
          unit: product.unit,
          purchasePrice: 0,
          salesPrice: product.price,
          hsn: product.hsn,
          stockValue: 0,
          logIDs: new Set([]),
        })

        const openingStockLog = new StockLog({
          companyID: invoice.companyID,
          clientID: clientID as string,
          clientName: client?.name as string,
          date: date as Date,
          logType: 'SALE',
          quantity: -1 * product.quantity,
          rate: product.price,
          amount: product.totalAmount,
          voucherNo: invoice.gstEnabled ? gstInvoiceNo : invoiceNo.toFixed(0),
          stockID: newStock.id,
        })

        openingStockLog.save();



        newStock.logIDs.add(openingStockLog.id);
        newStock.save();

      }
    }
    )
  }

  return {
    invoiceNo,
    gstInvoiceNo,
    clientNames: query ? query.clientNames : [],
    client: clientX,
    customerContact, customerGST, customerName,
    setCustomerName, setCustomerGST, setCustomerContact,
    amountPaid, setAmountPaid,
    discount, setDiscount,
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
    updateStock,
    updateLedger,
    validateInvoice,
    printInvoice,
    getVoucherType,
  }
}


export default useInvoiceForm;