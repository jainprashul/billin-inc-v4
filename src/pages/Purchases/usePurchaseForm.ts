import { nanoid } from '@reduxjs/toolkit';
import { useLiveQuery } from 'dexie-react-hooks';
import { useEffect, useState } from 'react'
import purchasePattern from '../../components/PDF/PurchasePattern';
import db from '../../services/database/db';
import { Client, Company, Ledger, Product, Purchase, Stock, StockLog } from '../../services/database/model';
import { useDataUtils } from '../../utils/useDataUtils';

// Create client ID if it doesn't exist yet
let cid = `c_${nanoid(12)}`

const usePurchaseForm = (purchase: Purchase) => {
  const { companyID } = useDataUtils();
  // console.log(purchase)
  const [date, setDate] = useState<Date | null>(new Date())
  const [products, setProducts] = useState<Product[]>(purchase?.products || []);
  const [total, setTotal] = useState<number>(purchase?.totalAmount);
  const [gross, setGross] = useState<number>(purchase?.grossTotal);
  const [gstAmt, setGstAmt] = useState<number>(purchase?.gstTotal);
  const [amountPaid, setAmountPaid] = useState<number>(purchase?.amountPaid || 0);
  const [discount, setDiscount] = useState<number>(purchase?.discountValue || 0);
  
  const [clientID, setClientID] = useState<string | undefined>(purchase?.clientID);

  const [clientOpen, setClientOpen] = useState<boolean>(false);
  const [customerName, setCustomerName] = useState<string>(purchase?.client?.name || '');
  const [customerGST, setCustomerGST] = useState<string>('');
  const [customerContact, setCustomerContact] = useState<string>('');

  const companyDB = db.getCompanyDB(purchase?.companyID);

  const query = useLiveQuery(async () => {
    return {
      company: await db.companies.get(purchase?.companyID) as Company,
      // gstInvoiceNo: await db.companies.get(invoice?.companyID).then(company => company?.lastGSTInvoiceNo) as number,
      clientNames: await companyDB?.clients.orderBy("name").keys() ?? [],
    }
  }, [companyDB]);

  const purchaseNo = query ? `P-${query.company.lastPurchaseNo + 1}` : `P-${1}`;
  const gstPurchaseNo = query ? `PG-${query.company.lastGSTPurchaseNo + 1}` : `PG-${1}`;

  const client = useLiveQuery(async () => {
    if (clientID) {
      const res = await db.getCompanyDB(purchase?.companyID)?.clients.get(clientID);
      // res && setCustomerName(res.name) ;
      res ? setCustomerContact(res.contacts[0].phone as string) : setCustomerContact('');
      res ? setCustomerGST(res.gst as string) : setCustomerGST('');
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
    isCustomer : false,
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
      setGross(purchase.grossTotal);
      setTotal(purchase.totalAmount);
      setGstAmt(gstTotal);
    }
  }, [purchase.grossTotal, purchase.gstTotal, purchase.totalAmount, products])

  const onAddProduct = (product: Product) => {
    // product.voucherID = invoice.id;
    console.log('usePurFOrm', product)
    setProducts([...products, product])
  }

  const onDeleteProduct = (product: Product) => {
    setProducts(products.filter(p => p.id !== product.id))
  }

  const updatePurchaseVoucher = () => {
    const obj = purchase.gstEnabled ? {
      lastGSTPurchaseNo: Number(gstPurchaseNo.replace('PG-', '')),
    } : {
      lastPurchaseNo: Number(purchaseNo.replace('P-', '')),
    }
    db.companies.update(purchase.companyID, obj)
  }

  const validatePurchase = () => {
    let err = '';

    if (customerName === '') {
      err += 'Please enter vendor name. \n';
    }

    if (purchase.gstEnabled && customerGST === '') {
      err += 'Please enter vendor GST. \n';
    }

    if (products.length === 0) {
      err += 'Please add atleast one product. \n';
    }

    if (amountPaid < 0) {
      err += 'Please enter valid amount paid.';
    }

    return err.trim().length > 0 ? err : null;
  }

  /** Print Bill from PDF
 * @param bill
 */
  const printBill = (bill: any) => {
    console.log('printBill', bill)
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    document.body.appendChild(iframe);
    iframe.contentDocument?.write(purchasePattern(bill));
    iframe.contentDocument?.close();
    iframe.contentWindow?.focus();
    iframe.contentWindow?.print();
  }

  const printPurchase = (purchase: Purchase) => {
    const printInv = {
      ...purchase,
      products,
      client : clientX,
      company: query?.company,
      amountPaid: amountPaid,
    }
    printBill(printInv);
  }

  const getVoucherType = () => {
    let companyGST = query?.company.gst.substring(0, 2);
    let clientGST = client?.gst.substring(0, 2);
    if (companyGST === clientGST) {
      return "INTER_STATE";
    }
    return "INTRA_STATE";
  }

  const updateLedger = async () => {
    const newLedger = new Ledger({
      companyID: purchase.companyID,
      date: date as Date,
      voucherNo: purchase.gstEnabled ? gstPurchaseNo : purchaseNo,
      voucherType: 'PURCHASE',
      clientID: clientID as string,
      clientType: 'VENDOR',
      credit: total - discount,
      debit: amountPaid,
      payable: total - (discount + amountPaid),
      payableType: 'CASH',
      receivable: 0,
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
      const stock = await db.getCompanyDB(purchase.companyID)?.stocks.get({ name: product.name, companyID: purchase.companyID });
      if (stock) {
        db.getCompanyDB(purchase.companyID)?.stocks.update(stock.id, {
          quantity: stock.quantity + product.quantity,
        });

        // create stock log
        const stockLog = new StockLog({
          companyID: purchase.companyID,
          clientID: clientID as string,
          clientName : client?.name as string,

          date: date as Date,
          logType: 'PURCHASE',
          quantity: product.quantity,
          rate: product.price,
          amount: product.totalAmount,
          voucherNo: purchase.gstEnabled ? gstPurchaseNo : purchaseNo,
          stockID: stock.id,
        })
        // save stock log and update stock quantity and log ids
        stockLog.save();

        stock.logIDs.add(stockLog.id);
        stock.quantity += product.quantity;
        stock.save();

      } else {
        // create stock and its opening stock log
        const newStock = new Stock({
          name: product.name,
          quantity: product.quantity,
          companyID: purchase.companyID,
          gstRate: product.gstRate,
          unit: product.unit,
          purchasePrice: product.price,
          salesPrice: 0,
          hsn: product.hsn,
          stockValue: product.price * product.quantity,
          logIDs: new Set([]),
        })

        const openingStockLog = new StockLog({
          companyID: purchase.companyID,
          clientID: clientID as string,
          clientName : client?.name as string,
          date: date as Date,
          logType: 'PURCHASE',
          quantity: product.quantity,
          rate: product.price,
          amount: product.totalAmount,
          voucherNo: purchase.gstEnabled ? gstPurchaseNo : purchaseNo,
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
    invoiceNo: purchaseNo,
    gstInvoiceNo: gstPurchaseNo,
    clientNames: query ? query.clientNames : [],
    client : clientX,
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
    updateInvoiceVoucher: updatePurchaseVoucher,
    updateStock,
    updateLedger,
    validateInvoice: validatePurchase,
    printInvoice: printPurchase,
    getVoucherType,
  }
}


export default usePurchaseForm;