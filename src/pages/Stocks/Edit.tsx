import React from 'react'
import { Stock } from '../../services/database/model';
import { useDataUtils } from '../../utils/useDataUtils';
import StockForm from './StockForm'

type Props = {
    open : boolean;
    setOpen : (open : boolean) => void;
    stock : Stock;
}

const Edit = ({open , setOpen, stock}: Props) => {
    const { toast } = useDataUtils();
    const onClose = () => {
        setOpen(false);
    }

    const onSubmit = (data: Stock) => {
        console.log("eift ",data);      
        data.save().then(() => {
            console.log("saved");
            toast.enqueueSnackbar(`Stock ${data.name} Updated`, { variant: 'success' });
        }).catch((err) => {
            console.log(err);
            toast.enqueueSnackbar(`Stock ${data.name} Save Failed`, { variant: 'error' });
        });

    }

    return (
        <StockForm stock={stock} open={open} setOpen={setOpen} onClose={onClose} onSubmit={onSubmit} />
    )
}

export default Edit