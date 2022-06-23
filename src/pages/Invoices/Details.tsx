import React, { useEffect } from 'react'
import { useLocation, useParams } from 'react-router-dom'
import invoicePattern from '../../components/PDF/InvoicePattern'
import { Invoice } from '../../services/database/model/Invoices'
import { useDataUtils } from '../../utils/useDataUtils'

type Props = {}
const iframe = document.createElement('iframe');

const Details = (props: Props) => {
  const location = useLocation()
  const params = useParams()
  const { company } = useDataUtils()

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

    iframe.contentDocument?.write(invoicePattern(data));
    iframe.contentDocument?.close();
    iframe.contentWindow?.focus();
  }

  useEffect(()=> {
    ref.current?.appendChild(iframe);
  }, [])

  printInvoice(location.state as Invoice)

  return (
    <div>
      <div ref={ref} className="ref"></div>
    </div>
  )
}

export default Details