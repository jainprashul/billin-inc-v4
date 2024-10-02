import MaterialTable, { Column } from '@material-table/core';
import { StockLog } from '../../../services/database/model';
import { Link } from 'react-router-dom';
import { theme } from '../../../styles/theme';



type Props = {
    data: Array<StockLog>
}


const LogTable = ({ data }: Props) => {
    const loading = !(data ? data.length !== 0 : false)

    const columns: Array<Column<StockLog>> = [
        {
            title: 'Date',
            field: 'date',
            type: 'date',
        },
        {
            title: 'Voucher',
            field: 'voucherNo',
            render: (data) => {
                const link = data.logType === 'PURCHASE' ? `/purchase/${data.voucherNo}` : `/invoice/${data.voucherNo}`;

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
                    pageSize: 7,
                    pageSizeOptions: [5, 10, 20, 30, 50],
                    draggable: true,
                    headerStyle: {
                        fontWeight: 'bold',
                    },
                    showTitle: false,

                }}
                style={{
                    maxWidth: '100%',
                    overflowX: 'auto',
                }}
            />
        </>
    )
}

export default LogTable
