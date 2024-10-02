import MaterialTable, { Action, Column } from '@material-table/core';
import { Delete, Print, RemoveRedEye } from '@mui/icons-material';
import React from 'react'
import AlertDialog from '../../components/shared/AlertDialog';
import { Invoice } from '../../services/database/model/Invoices';
import invoicePattern from '../../components/PDF/InvoicePattern';
import FilterListIcon from '@mui/icons-material/FilterList';
import FilterListOffIcon from '@mui/icons-material/FilterListOff';
import { useDataUtils } from '../../utils/useDataUtils';
import { Link } from 'react-router-dom';
import { theme } from '../../styles/theme';
import moment from 'moment';
import { ExportCsv, ExportPdf } from '@material-table/exporters';

type Props = {
    data: Array<Invoice>
}


const InvoiceTable = ({ data }: Props) => {
    const [open, setOpen] = React.useState(false);
    const [filter, setFilter] = React.useState(false);
    const { company, navigate , toast, getAccountDetails } = useDataUtils()

    const [loading, setLoading] = React.useState(true)
    React.useEffect(() => {
        setLoading(!(data ? data.length !== 0 : false))
        setTimeout(() => {
            setLoading(false)
        }, 2000);
    }, [data])

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

        const account = await getAccountDetails();
        const w = window.open( '', `Invoice ${invoice.voucherNo}`, 'width=800,height=720');
        if (w) {
            const data : any = {
                ...invoice,
                company,
                account,
            }
            w.document.write(invoicePattern(data));
            w.document.close(); 
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const editInvoice = async (invoice: Invoice) => {
        navigate(`/invoice/${invoice.id}/edit`, {
            state: invoice
        });
    }

    const printInvoice = async (invoice: Invoice) => {
        console.log('printBill', invoice)
        const iframe = document.createElement('iframe');
        iframe.style.display = 'none';
        document.body.appendChild(iframe);

        const account = await getAccountDetails();

        const data : any = {
            ...invoice,
            company,
            account,
        }


        iframe.contentDocument?.write(invoicePattern(data));
        iframe.contentDocument?.close();
        iframe.contentWindow?.focus();
        iframe.contentWindow?.print(); 
    }

    const columns: Array<Column<Invoice>> = React.useMemo(() => [
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
            render: (data) => {
                const link = `/ledger/${data.client?.id}`;
                return <Link style={{
                    textDecoration: 'none',
                    color: theme.palette.primary.main,
                }} to={link}>
                    {data.client?.name}
                </Link>
            }

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
    ], []);

    const actions: Array<Action<Invoice>> = React.useMemo(() => [
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
        // {
        //     icon: () => <EditTwoToneIcon />,
        //     tooltip: 'Edit Invoice',
        //     position: 'row',
        //     onClick: (event, rowData) => {
        //         console.log(rowData)
        //         editInvoice(rowData as Invoice);
        //     },
        // },
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
                            toast.enqueueSnackbar(`Invoice : ${inv.voucherNo} deleted.`, {
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
                                toast.enqueueSnackbar(`Invoice : ${inv.voucherNo} deleted.`, {
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
     
    ], [filter, toast]);

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
                    exportMenu: [
                        {
                          label: "Export PDF",
                          exportFunc: (cols, datas) => ExportPdf(cols, datas, `Invoice ${moment().format('ll')}`),
                        },
                        {
                          label: "Export CSV",
                          exportFunc: (cols, datas) => ExportCsv(cols, datas, `Invoice ${moment().format('ll')}`),
                        },
                      ],
                }}
            />

            <AlertDialog message={dialog.message} open={open} setOpen={setOpen} title={dialog.title} onConfirm={dialog.onConfirm} onCancel={dialog.onCancel} />

        </>
    )
}

export default InvoiceTable
