
import { useLiveQuery } from 'dexie-react-hooks';
import { useFormik } from 'formik';
import { useEffect, useState } from 'react'
import db from '../../services/database/db';
import { Client, Invoices, Ledger, Product, Stock, StockLog } from '../../services/database/model';


const useInvoiceForm = (invoice: Invoices) => {
  const [date, setDate] = useState<Date | null>(new Date())
  const [products, setProducts] = useState<Product[]>(invoice?.products || []);
  const [total, setTotal] = useState<number>(invoice?.totalAmount);
  const [gross, setGross] = useState<number>(invoice?.grossTotal);
  const [gstAmt, setGstAmt] = useState<number>(invoice?.gstTotal);
  const [amountPaid , setAmountPaid] = useState<number>(0);

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
  });

  const invoiceNo = query ? query.invoiceNo + 1 : 1;
  const gstInvoiceNo =  query ? `G-${query.gstInvoiceNo + 1}` : `G-${1}`;

  const client = useLiveQuery(async () => {
    if (clientID) {
      const res = await db.getCompanyDB(invoice?.companyID)?.clients.get(clientID);
      res ? setCustomerContact(res.contacts[0].phone as string) : setCustomerContact('');
      res ? setCustomerGST(res.gst as string) : setCustomerGST('');
      return res;
    }
    return new Client({
      name: customerName,
      address: { address: '', city: '', state: '', },
      companyID: 1,
      contacts: [{ name: customerName, email: '', phone: customerContact, mobile: '' }],
      details: '',
      gst: customerGST,
    })
  }, [clientID, customerName, customerContact, customerGST]);

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

  const updateInvoiceVoucher = () => {
    const obj = invoice.gstEnabled ? {
        lastGSTInvoiceNo:  Number(gstInvoiceNo.replace('G-', '')),
      } : {
        lastInvoiceNo: invoiceNo,
      }
    db.companies.update(invoice.companyID, obj)
  }

  const updateLedger = async ()=> {
    const newLedger = new Ledger({
      companyID: invoice.companyID,
      date : date as Date,
      voucherNo: invoice.gstEnabled ? gstInvoiceNo : invoiceNo.toFixed(0),
      voucherType: 'SALES',
      clientID: clientID as string,
      clientType: 'CUSTOMER',
      credit: amountPaid,
      debit: total,
      payable: 0,
      payableType: 'CASH',
      receivable: total - amountPaid,
      receivableType: 'CASH',
      cash : 0,
    })

    if (newLedger.receivableType === 'CASH') {
      newLedger.cash = newLedger.credit;
    }

    newLedger.save();
  }

  const updateStock = async () => {
    products.forEach(async (product) => {
      const stock = await db.getCompanyDB(invoice.companyID)?.stocks.get({name : product.name, companyID: invoice.companyID});
      if (stock) {
        db.getCompanyDB(invoice.companyID)?.stocks.update(stock.id, {
          quantity: stock.quantity - product.quantity,
        });

        // create stock log
        const stockLog = new StockLog({
          companyID: invoice.companyID,
          clientID: clientID as string,
          date: new Date(),
          logType:'SALE',
          quantity: product.quantity,
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
        const openingStockLog = new StockLog({
          companyID: invoice.companyID,
          clientID: clientID as string,
          date: new Date(),
          logType:'OPENING_STOCK',
          quantity: product.quantity,
          rate: product.price,
          amount: product.totalAmount,
          voucherNo: invoice.gstEnabled ? gstInvoiceNo : invoiceNo.toFixed(0),
          stockID: '',
        })

        openingStockLog.save();

        const newStock = new Stock({
          name: product.name,
          quantity: -product.quantity,
          companyID: invoice.companyID,
          gstRate: product.gstRate,
          unit: product.unit,
          purchasePrice: 0,
          salesPrice: product.price,
          hsn: product.hsn,
          stockValue: 0,
          logIDs: new Set([]),
        }) 

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
    client: client ? client : new Client({
      name: customerName,
      address: { address: '', city: '', state: '', },
      companyID: 1,
      contacts: [{ name: customerName, email: '', phone: customerContact, mobile: '' }],
      details: '',
      gst: customerGST,
    }),
    customerContact, customerGST, customerName,
    setCustomerName, setCustomerGST, setCustomerContact,
    amountPaid, setAmountPaid,
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
  }
}


export default useInvoiceForm;