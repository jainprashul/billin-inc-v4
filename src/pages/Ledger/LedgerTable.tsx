import MaterialTable, { Column } from '@material-table/core';
import React from 'react';
import { Link } from 'react-router-dom';
import { Ledger } from '../../services/database/model';
import { theme } from '../../styles/theme';



type Props = {
    data: Array<Ledger>

}


const LedgerTable = ({ data }: Props) => {
    let loading = !(data ? data.length > 0 : false);

    const columns: Array<Column<Ledger>> = [
        {
            title: 'Date',
            field: 'date',
            type: 'date',
        },
        {
            title: 'Voucher',
            field: 'voucherNo',
            render: (data) => {
                let link = data.voucherType === 'PURCHASE' ? `/purchase/${data.voucherNo}` : `/invoice/${data.voucherNo}`;

                return <Link style={{
                    textDecoration: 'none',
                    color: theme.palette.primary.main,
                }} to={link}>
                    {data.voucherNo}
                </Link>
            }
        },
        {
            title: 'Voucher Type',
            field: 'voucherType',
            type: 'string',
        },
        {
            title: 'Debit',
            field: 'debit',
            type: 'currency',
            currencySetting: {
                currencyCode: 'INR',
            }
        },
        {
            title: "Credit",
            field: 'credit',
            type: 'currency',
            currencySetting: {
                currencyCode: 'INR',
            }
        },

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
        </>
    )
}

export default LedgerTable
