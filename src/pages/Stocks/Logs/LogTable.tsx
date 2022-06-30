import MaterialTable, { Action, Column } from '@material-table/core';
import { Delete, Print, RemoveRedEye } from '@mui/icons-material';
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import React from 'react'
import FilterListIcon from '@mui/icons-material/FilterList';
import FilterListOffIcon from '@mui/icons-material/FilterListOff';
import { StockLog } from '../../../services/database/model';
import { useDataUtils } from '../../../utils/useDataUtils';
import AlertDialog from '../../../components/shared/AlertDialog';
import { Link } from 'react-router-dom';
import { theme } from '../../../styles/theme';
import { Card, CardHeader } from '@mui/material';



type Props = {
    data: Array<StockLog>
}


const LogTable = ({ data }: Props) => {
    const loading = !(data ? data.length !== 0 : false)
    const [open, setOpen] = React.useState(false);
    const [filter, setFilter] = React.useState(false);
    const { company, navigate, toast } = useDataUtils();

    const [dialog, setDialog] = React.useState({
        title: '',
        message: '',
        onCancel: () => { },
        onConfirm: () => { },
    });

    const columns: Array<Column<StockLog>> = [
        {
            title: 'Date',
            field: 'date',
            type: 'date',
        },
        {
            title: 'Voucher',
            field: 'voucherNo',
            render: (data, type) => {
                let link = `/invoice/${data.voucherNo}`;

                return <Link style={{
                    textDecoration: 'none',
                    color: theme.palette.primary.main,
                }} to={link}>
                    {data.voucherNo}
                </Link>
            }
        },
        {
            title: 'Client',
            field: 'clientName',
        },
        {
            title: 'Transaction Type',
            field: 'logType',
        },
        {
            title: 'Quantity',
            field: 'quantity',
            type: 'numeric',
        },
        {
            title: 'Price',
            field: 'rate',
            type: 'currency',
            currencySetting: {
                currencyCode: 'INR',
            }
        },
        {
            title: "StockLog Value",
            field: 'amount',
            type: 'currency',
            currencySetting: {
                currencyCode: 'INR',
            }
        }
    ];

    return (
        <>
            <MaterialTable
                isLoading={loading}
                columns={columns}
                title=""
                data={data}
                options={{
                    actionsColumnIndex: -1,
                    pageSize: 8,
                    pageSizeOptions: [5, 10, 20, 30, 50],
                    draggable: true,
                    headerStyle: {
                        fontWeight: 'bold',
                    },
                    showTitle: false,

                }}
            />

            <AlertDialog message={dialog.message} open={open} setOpen={setOpen} title={dialog.title} onConfirm={dialog.onConfirm} onCancel={dialog.onCancel} />

        </>
    )
}

export default LogTable
