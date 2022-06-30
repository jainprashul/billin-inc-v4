import { useLiveQuery } from 'dexie-react-hooks'
import React, { useEffect } from 'react'
import invoicePattern from '../../components/PDF/InvoicePattern'
import { Invoice } from '../../services/database/model/Invoices'
import { useDataUtils } from '../../utils/useDataUtils'

type Props = {}
const iframe = document.createElement('iframe');

const Details = (props: Props) => {
  const { company, params, companyDB } = useDataUtils()
  const invoiceID = params.id as string

  const invoice = useLiveQuery(async () => {
    const inv = await companyDB?.invoices.where('voucherNo').equals(invoiceID).first()
    await inv?.loadClient();
    await inv?.loadProducts();
    return inv
  }, [companyDB, invoiceID]) as Invoice

  console.log(invoice);


  const ref = React.useRef<HTMLDivElement>(null)

  const printInvoice = (invoice: Invoice) => {
    console.log('printBill', invoice)

    iframe.style.border = 'none'
    iframe.style.height = '580px';
    iframe.style.width = '100%';

    const data: any = {
      ...invoice,
      company,
      amountPaid: 0,
    }

    if (invoice) {
      iframe.contentDocument?.write(invoicePattern(data));
      iframe.contentDocument?.close();
      iframe.contentWindow?.focus();
    }
  }

  useEffect(() => {
    ref.current?.appendChild(iframe);
  }, [])

  printInvoice(invoice as Invoice)

  return (
    <div>
      <div ref={ref} className="ref"></div>
    </div>
  )
}

export default Details