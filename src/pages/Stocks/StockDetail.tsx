import MaterialTable, { Action, Column } from '@material-table/core';
import { Delete, Print, RemoveRedEye } from '@mui/icons-material';
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import React from 'react'
import { useSnackbar } from 'notistack';
import AlertDialog from '../../components/shared/AlertDialog';
import { Stock } from '../../services/database/model/Stocks';
import invoicePattern from '../../components/PDF/InvoicePattern';
import FilterListIcon from '@mui/icons-material/FilterList';
import FilterListOffIcon from '@mui/icons-material/FilterListOff';
import { useDataUtils } from '../../utils/useDataUtils';


type Props = {
    data: Array<Stock>
}


const StockDetail = ({ data }: Props) => {
    const loading = !(data ? data.length !== 0 : false)
    const [open, setOpen] = React.useState(false);
    const [filter, setFilter] = React.useState(false);
    const { params, location } = useDataUtils()

    console.log(params)
    console.log(location)

    return (
        <>
        </>
    )
}

export default StockDetail
