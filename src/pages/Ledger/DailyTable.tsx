import MaterialTable, { Column } from '@material-table/core';
import { useLiveQuery } from 'dexie-react-hooks';
import React from 'react';
import { Link } from 'react-router-dom';
import { Ledger } from '../../services/database/model';
import { theme } from '../../styles/theme';
import { useDataUtils } from '../../utils/useDataUtils';



type Props = {
    data: Array<Ledger>
}


const DailyLedgerTable = ({ data }: Props) => {

    const { companyDB } = useDataUtils()

    const Clients = useLiveQuery(async ()=> {
        return companyDB?.clients.toArray();
    }, [companyDB]);

    const columns: Array<Column<Ledger>> = [
        {
            title: 'Date',
            field: 'date',
            type: 'date',
        },
        {
            title: 'Name',
            field: 'clientID',
            render: (data) => {
                const link = `/ledger/${data.clientID}`;
                const clientName = Clients?.find(client => client.id === data.clientID)?.name ?? '';

                return <Link style={{
                    textDecoration: 'none',
                    cursor : 'pointer',
                    color: theme.palette.primary.main,
                }} to={link}>
                    {clientName}
                </Link>
            }
        },
        {
            title: 'Voucher',
            field: 'voucherNo',
            render: (data) => {
                const link = `/invoice/${data.voucherNo}`;

                return <Link style={{
                    textDecoration: 'none',
                    color: theme.palette.primary.main,
                }} to={link}>
                    {data.voucherNo}
                </Link>
            }
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
                columns={columns}
                title=""
                data={data}
                options={{
                    toolbar: false,
                    actionsColumnIndex: -1,
                    pageSize: 8,
                    pageSizeOptions: [5, 10, 20, 30, 50],
                    draggable: true,
                    headerStyle: {
                        fontWeight: 'bold',
                    },
                    showTitle: false,
                    paging: false,
                }}
            />
        </>
    )
}

export default DailyLedgerTable
