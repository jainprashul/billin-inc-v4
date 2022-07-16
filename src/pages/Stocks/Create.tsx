import React from 'react'
import { Stock, StockLog } from '../../services/database/model';
import { useDataUtils } from '../../utils/useDataUtils';
import StockForm from './StockForm'

type Props = {
    open: boolean;
    setOpen: (open: boolean) => void;
}

const Create = ({ open, setOpen }: Props) => {
    const { toast } = useDataUtils();
    const onClose = () => {
        setOpen(false);
    }

    const onSubmit = (stk: Stock) => {

        const openingStockLog = new StockLog({
            companyID: stk.companyID,
            clientID: 'none',
            clientName: 'Created',
            date: new Date(),
            logType: 'OPENING_STOCK',
            quantity: 1 * stk.quantity,
            rate: stk.purchasePrice,
            amount: stk.purchasePrice * stk.quantity,
            voucherNo: '',
            stockID: stk.id, 
        })

        openingStockLog.save();      
        stk.logIDs.add(openingStockLog.id);
        // console.log("eift ",data);      
        stk.save().then(() => {
            console.log("saved");
            toast.enqueueSnackbar(`Stock ${stk.name} Created`, { variant: 'success' });
        }).catch((err) => {
            console.log(err);
            toast.enqueueSnackbar(`Stock ${stk.name} Save Failed`, { variant: 'error' });
        });

    }

    return (
        <StockForm open={open} setOpen={setOpen} onClose={onClose} onSubmit={onSubmit} />
    )
}

export default Create