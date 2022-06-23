import MaterialTable, { Action, Column } from '@material-table/core';
import { Delete, Print, RemoveRedEye } from '@mui/icons-material';
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import React from 'react'
import { useSnackbar } from 'notistack';
import AlertDialog from '../../components/shared/AlertDialog';
import { Invoice } from '../../services/database/model/Invoices';
import invoicePattern from '../../components/PDF/InvoicePattern';
import FilterListIcon from '@mui/icons-material/FilterList';
import FilterListOffIcon from '@mui/icons-material/FilterListOff';
import { useDataUtils } from '../../utils/useDataUtils';
import { Purchase } from '../../services/database/model';

type Props = {
    data: Array<Purchase>;
}


const PurchaseTable = ({ data }: Props) => {
    const loading = !(data ? data.length !== 0 : false)
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const [open, setOpen] = React.useState(false);
    const [filter, setFilter] = React.useState(false);
    const { company, navigate } = useDataUtils()



    const [dialog, setDialog] = React.useState({
        title: '',
        message: '',
        onCancel: () => { },
        onConfirm: () => { },
    });

    const deletePurchase = async (purchase: Purchase) => {
        await new Purchase(purchase).delete();
    };

    const viewPurchase = async (purchase: Purchase) => {
        // navigate(`/invoice/${invoice.id}`, {
        //     state: invoice
        // });

        const w = window.open( '', `Purchase ${purchase.voucherNo}`, 'width=800,height=720');
        if (w) {
            const data : any = {
                ...purchase,
                company,
            }
            w.document.write(invoicePattern(data));
            w.document.close(); 
        }
    }

    const editPurchase = async (purchase: Purchase) => {
        navigate(`/purchase/${purchase.id}/edit`, {
            state: purchase
        });
    }

    const printPurchase = (purchase: Purchase) => {
        console.log('printBill', purchase)
        const iframe = document.createElement('iframe');
        iframe.style.display = 'none';
        document.body.appendChild(iframe);

        const data : any = {
            ...purchase,
            company,
        }


        iframe.contentDocument?.write(invoicePattern(data));
        iframe.contentDocument?.close();
        iframe.contentWindow?.focus();
        iframe.contentWindow?.print(); 
    }

    const columns: Array<Column<Purchase>> = [
        {
            title: 'Purchase Number',
            field: 'voucherNo',
        },
        {
            title: 'Purchase Date',
            field: 'billingDate',
            type: 'date',
        },
        {
            title: 'Vendor',
            field: 'client.name',

        },
        {
            title: 'Product Count',
            field: 'products.length',
        },
        {
            title: 'Taxable Value',
            field: 'grossTotal',
            type: 'currency',
            currencySetting: {
                currencyCode: 'INR',
            }
        },
        {
            title: 'Discount',
            field: 'discountValue',
            type: 'currency',
            currencySetting: {
                currencyCode: 'INR',
            }
        },
        {
            title: 'Total',
            field: 'totalAmount',
            type: 'currency',
            currencySetting: {
                currencyCode: 'INR',
            }
        },
    ];

    const actions: Array<Action<Purchase>> = [
        {
            icon: () => <Print />,
            tooltip: 'Print Purchase',
            position: 'row',
            onClick: (event, rowData) => {
                console.log(rowData)
                printPurchase(rowData as Purchase);
            },
        },
        {
            icon: () => <RemoveRedEye />,
            tooltip: 'View Purchase',
            position: 'row',
            onClick: (event, rowData) => {
                console.log(rowData)
                viewPurchase(rowData as Purchase);
            },
        },
        {
            icon: () => <EditTwoToneIcon />,
            tooltip: 'Edit Purchase',
            position: 'row',
            onClick: (event, rowData) => {
                console.log(rowData)
                editPurchase(rowData as Purchase);
            },
        },
        {
            icon: () => <Delete />,
            tooltip: 'Delete Purchase',
            position: 'row',
            onClick: (event, rowData) => {
                const pur = rowData as Purchase;
                setOpen(true);
                setDialog({
                    title: 'Delete Purchase',
                    message: 'Are you sure you want to delete this purchase bill?',
                    onConfirm: () => {
                        deletePurchase(pur).then(() => {
                            enqueueSnackbar(`Purchase Bill : ${pur.voucherNo} deleted.`, {
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
            tooltip: 'Delete Purchases',
            position: 'toolbarOnSelect',
            onClick: (event, rowData) => {
                const purchases = rowData as Purchase[];
                setOpen(true);
                setDialog({
                    title: 'Delete Selected Purchase',
                    message: 'Are you sure you want to delete selected purchase bills?',
                    onConfirm: () => {
                        purchases.forEach(inv => {
                            deletePurchase(inv).then(() => {
                                enqueueSnackbar(`Purchase : ${inv.voucherNo} deleted.`, {
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
                title="Invoices"
                data={data}
                actions={actions}
                options={{
                    actionsColumnIndex: -1,
                    pageSize: 5,
                    pageSizeOptions: [5, 10, 20, 30, 50],
                    selection: true,
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

export default PurchaseTable