import { useLiveQuery } from 'dexie-react-hooks'
import React, { useEffect } from 'react'
import invoicePattern from '../../components/PDF/InvoicePattern'
import AlertDialog from '../../components/shared/AlertDialog'
import { Purchase } from '../../services/database/model'
import { useDataUtils } from '../../utils/useDataUtils'

type Props = {}
const iframe = document.createElement('iframe');

const Details = (props: Props) => {
  const { company, params, companyDB, navigate } = useDataUtils()
  const purchaseID = params.id as string

  const purchase = useLiveQuery(async () => {
    const prchs = await companyDB?.purchases.where('voucherNo').equals(purchaseID).first()
    await prchs?.loadClient();
    await prchs?.loadProducts();
    return prchs
  }, [companyDB, purchaseID]) as Purchase;

  // console.log(invoice);

  const handleClose = () => {
    navigate(-1);
  }


  const ref = React.useRef<HTMLDivElement>(null)

  const showPurchase = (bill: Purchase) => {
    console.log('printBill', bill)

    iframe.style.border = 'none'
    iframe.style.height = '580px';
    iframe.style.width = '100%';

    const data: any = {
      ...bill,
      company,
    }

    if (bill) {
      iframe.contentDocument?.write(invoicePattern(data));
      iframe.contentDocument?.close();
      iframe.contentWindow?.focus();
    }
  }

  useEffect(() => {
    ref.current?.appendChild(iframe);
  }, [])


  showPurchase(purchase as Purchase)


  return (
    <div>
      <div ref={ref} className="ref"></div>
      <AlertDialog
        open={typeof purchase !== 'object'}
        setOpen={() => {}}
        title={`Bill doesn't exist.`}
        message={`Bill you are looking for is either deleted or unavailable.`}
        confirmText={`GO Back`}
        onCancel={handleClose}
        onConfirm={handleClose}
      />
    </div>
  )
}

export default Details