import MaterialTable, { Column } from '@material-table/core';
import React from 'react'
import { useAppSelector } from '../../app/hooks';
import { Stock } from '../../services/database/model/Stocks';
import { useDataUtils } from '../../utils/useDataUtils';
import { selectIsAdmin } from '../../utils/utilsSlice';
import { ExportCsv, ExportPdf } from "@material-table/exporters";
import moment from 'moment';


type Props = {
    data: Array<Stock>
}


const StockTable = ({ data }: Props) => {
    const { navigate } = useDataUtils()
    const isAdmin = useAppSelector(selectIsAdmin)


    const [loading, setLoading] = React.useState(true)
    React.useEffect(() => {
        setLoading(!(data ? data.length !== 0 : false))
        setTimeout(() => {
            setLoading(false)
        }, 2000);
    }, [data])



    const columns: Array<Column<Stock>> = React.useMemo(() => [
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
            },
        }
    ], [])

    return (
        <>
            <MaterialTable
                isLoading={loading}
                columns={columns}
                title="Stocks"
                data={data}
                onRowClick={(event, row) => {
                    if (!isAdmin) return;
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
                    exportMenu: [
                        {
                          label: "Export PDF",
                          exportFunc: (cols, datas) => ExportPdf(cols, datas, `Stock ${moment().format('ll')}`),
                        },
                        {
                          label: "Export CSV",
                          exportFunc: (cols, datas) => ExportCsv(cols, datas, `Stock ${moment().format('ll')}`),
                        },
                      ],
                }}
            />
        </>
    )
}

export default StockTable
