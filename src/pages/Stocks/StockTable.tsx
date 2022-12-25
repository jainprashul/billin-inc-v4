import MaterialTable, { Column } from '@material-table/core';
import React from 'react'
import { Stock } from '../../services/database/model/Stocks';
import { useDataUtils } from '../../utils/useDataUtils';


type Props = {
    data: Array<Stock>
}


const StockTable = ({ data }: Props) => {
    const loading = !(data ? data.length !== 0 : false)
    const { navigate } = useDataUtils()

    const columns: Array<Column<Stock>> = [
        {
            title: 'Stock Name',
            field: 'name',
        },
        {
            title: 'HSN Code',
            field: 'hsn',
        },
        {
            title: 'In Stocks',
            field: 'quantity',
            type: 'numeric',
        },
        {
            title: 'Unit',
            field: 'unit',
        },
        {
            title: 'Purchase Price',
            field: 'purchasePrice',
            type: 'currency',
            currencySetting: {
                currencyCode: 'INR',
            }
        },
        {
            title: 'Sales Price',
            field: 'salesPrice',
            type: 'currency',
            currencySetting: {
                currencyCode: 'INR',
            }
        },
        {
            title: "Stock Value",
            field: 'stockValue',
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
                title="Stocks"
                data={data}
                onRowClick={ (event , row) => {
                    navigate(`/stocks/${row?.id}`, {
                        state: row
                    })
                }}
                options={{
                    actionsColumnIndex: -1,
                    pageSize: 10,
                    pageSizeOptions: [5, 10, 20, 30, 50],
                    draggable: true,
                    // filtering : filter,
                    headerStyle: {
                        fontWeight: 'bold',    
                    },
                }}
            />
        </>
    )
}

export default StockTable
