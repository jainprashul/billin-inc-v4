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


const StockTable = ({ data }: Props) => {
    const loading = !(data ? data.length !== 0 : false)
    const [open, setOpen] = React.useState(false);
    const [filter, setFilter] = React.useState(false);
    const { company, navigate, toast } = useDataUtils()



    const [dialog, setDialog] = React.useState({
        title: '',
        message: '',
        onCancel: () => { },
        onConfirm: () => { },
    });

    const deleteStock = async (stock: Stock) => {
        await new Stock(stock).delete();
    };

    const viewStock = async (stock: Stock) => {
        // navigate(`/stock/${stock.id}`, {
        //     state: stock
        // });
    }

    const editStock = async (stock: Stock) => {
        console.log(stock)
        // navigate(`/stock/${stock.id}/edit`, {
        //     state: stock
        // });
    }

    const printStock = (stock: Stock) => {
        console.log('printBill', stock)
        const iframe = document.createElement('iframe');
        iframe.style.display = 'none';
        document.body.appendChild(iframe);

        const data : any = {
            ...stock,
            company,
        }


        iframe.contentDocument?.write(invoicePattern(data));
        iframe.contentDocument?.close();
        iframe.contentWindow?.focus();
        iframe.contentWindow?.print(); 
    }

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

    const actions: Array<Action<Stock>> = [
        {
            icon: () => <Print />,
            tooltip: 'Print Stock',
            position: 'row',
            onClick: (event, rowData) => {
                console.log(rowData)
                printStock(rowData as Stock);
            },
        },
        {
            icon: () => <RemoveRedEye />,
            tooltip: 'View Stock',
            position: 'row',
            onClick: (event, rowData) => {
                console.log(rowData)
                viewStock(rowData as Stock);
            },
        },
        {
            icon: () => <EditTwoToneIcon />,
            tooltip: 'Edit Stock',
            position: 'row',
            onClick: (event, rowData) => {
                console.log(rowData)
                editStock(rowData as Stock);
            },
        },
        {
            icon: () => <Delete />,
            tooltip: 'Delete Stock',
            position: 'row',
            onClick: (event, rowData) => {
                const stk = rowData as Stock;
                setOpen(true);
                setDialog({
                    title: 'Delete Stock',
                    message: 'Are you sure you want to delete this stock?',
                    onConfirm: () => {
                        deleteStock(stk).then(() => {
                            toast.enqueueSnackbar(`Stock : ${stk.name} deleted.`, {
                                variant: 'error',
                            });
                        })
                    },
                    onCancel: () => { }
                });
            },
        },
        {
            icon: () => <Delete />,
            tooltip: 'Delete Stocks',
            position: 'toolbarOnSelect',
            onClick: (event, rowData) => {
                const stocks = rowData as Stock[];
                setOpen(true);
                setDialog({
                    title: 'Delete Selected Stock',
                    message: 'Are you sure you want to delete selected stocks?',
                    onConfirm: () => {
                        stocks.forEach(stk => {
                            deleteStock(stk).then(() => {
                                toast.enqueueSnackbar(`Stock : ${stk.name} deleted.`, {
                                    variant: 'error',
                                });
                            })
                        });
                    },
                    onCancel: () => { }
                });
            },
        },
        {
            icon: () => filter ?  <FilterListOffIcon /> : <FilterListIcon />,
            tooltip: (filter ? 'Hide Filters' : 'Show Filters'),
            position: 'toolbar',
            onClick: (event, rowData) => {
                setFilter(!filter);
            },

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
                    navigate(`/stock/${row?.id}`, {
                        state: row
                    })
                }}
                options={{
                    actionsColumnIndex: -1,
                    pageSize: 10,
                    pageSizeOptions: [5, 10, 20, 30, 50],
                    draggable: true,
                    filtering : filter,
                    headerStyle: {
                        fontWeight: 'bold',    
                    },
                }}
            />

            <AlertDialog message={dialog.message} open={open} setOpen={setOpen} title={dialog.title} onConfirm={dialog.onConfirm} onCancel={dialog.onCancel} />

        </>
    )
}

export default StockTable
