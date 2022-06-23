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

type Props = {
    data: Array<Invoice>
}


const InvoiceTable = ({ data }: Props) => {
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

    const deleteInvoice = async (invoice: Invoice) => {
        await new Invoice(invoice).delete();
    };

    const viewInvoice = async (invoice: Invoice) => {
        // navigate(`/invoice/${invoice.id}`, {
        //     state: invoice
        // });

        const w = window.open( '', `Invoice ${invoice.voucherNo}`, 'width=800,height=720');
        if (w) {
            const data : any = {
                ...invoice,
                company,
            }
            w.document.write(invoicePattern(data));
            w.document.close(); 
        }
    }

    const editInvoice = async (invoice: Invoice) => {
        navigate(`/invoice/${invoice.id}/edit`, {
            state: invoice
        });
    }

    const printInvoice = (invoice: Invoice) => {
        console.log('printBill', invoice)
        const iframe = document.createElement('iframe');
        iframe.style.display = 'none';
        document.body.appendChild(iframe);

        const data : any = {
            ...invoice,
            company,
        }


        iframe.contentDocument?.write(invoicePattern(data));
        iframe.contentDocument?.close();
        iframe.contentWindow?.focus();
        iframe.contentWindow?.print(); 
    }

    const columns: Array<Column<Invoice>> = [
        {
            title: 'Invoice Number',
            field: 'voucherNo',
        },
        {
            title: 'Invoice Date',
            field: 'billingDate',
            type: 'date',
        },
        {
            title: 'Customer',
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

    const actions: Array<Action<Invoice>> = [
        {
            icon: () => <Print />,
            tooltip: 'Print Invoice',
            position: 'row',
            onClick: (event, rowData) => {
                console.log(rowData)
                printInvoice(rowData as Invoice);
            },
        },
        {
            icon: () => <RemoveRedEye />,
            tooltip: 'View Invoice',
            position: 'row',
            onClick: (event, rowData) => {
                console.log(rowData)
                viewInvoice(rowData as Invoice);
            },
        },
        {
            icon: () => <EditTwoToneIcon />,
            tooltip: 'Edit Invoice',
            position: 'row',
            onClick: (event, rowData) => {
                console.log(rowData)
                editInvoice(rowData as Invoice);
            },
        },
        {
            icon: () => <Delete />,
            tooltip: 'Delete Invoice',
            position: 'row',
            onClick: (event, rowData) => {
                const inv = rowData as Invoice;
                setOpen(true);
                setDialog({
                    title: 'Delete Invoice',
                    message: 'Are you sure you want to delete this invoice?',
                    onConfirm: () => {
                        deleteInvoice(inv).then(() => {
                            enqueueSnackbar(`Invoice : ${inv.voucherNo} deleted.`, {
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
            tooltip: 'Delete Invoices',
            position: 'toolbarOnSelect',
            onClick: (event, rowData) => {
                const invoices = rowData as Invoice[];
                setOpen(true);
                setDialog({
                    title: 'Delete Selected Invoice',
                    message: 'Are you sure you want to delete selected invoices?',
                    onConfirm: () => {
                        invoices.forEach(inv => {
                            deleteInvoice(inv).then(() => {
                                enqueueSnackbar(`Invoice : ${inv.voucherNo} deleted.`, {
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

export default InvoiceTable
