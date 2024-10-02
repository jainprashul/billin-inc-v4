import MaterialTable, { Action, Column } from '@material-table/core';
import { Delete, Print, RemoveRedEye } from '@mui/icons-material';
import React from 'react'
import { useSnackbar } from 'notistack';
import AlertDialog from '../../components/shared/AlertDialog';
import FilterListIcon from '@mui/icons-material/FilterList';
import FilterListOffIcon from '@mui/icons-material/FilterListOff';
import { useDataUtils } from '../../utils/useDataUtils';
import { Purchase } from '../../services/database/model';
import purchasePattern from '../../components/PDF/PurchasePattern';
import { Link } from 'react-router-dom';
import { theme } from '../../styles/theme';
import db from '../../services/database/db';
import { ExportCsv, ExportPdf } from '@material-table/exporters';
import moment from 'moment';

type Props = {
    data: Array<Purchase>
}


const PurchaseTable = ({ data }: Props) => {
    const { enqueueSnackbar } = useSnackbar();
    const [open, setOpen] = React.useState(false);
    const [filter, setFilter] = React.useState(false);
    const { navigate, companyID } = useDataUtils()

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

    const deletePurchase = async (purchase: Purchase) => {
        await new Purchase(purchase).delete();
    };

    const viewPurchase = React.useCallback(async (purchase: Purchase) => {

        const company = await db.companies.get(companyID)!;
        console.log('company', company)
        // navigate(`/purchase/${invoice.id}`, {
        //     state: invoice
        // });

        const w = window.open('', `Purchase Bill ${purchase.voucherNo}`, 'width=800,height=720');
        if (w) {
            const data: any = {
                ...purchase,
                company,
            }
            w.document.write(purchasePattern(data));
            w.document.close();
        }
    }, [companyID]);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const editPurchase = async (purchase: Purchase) => {
        navigate(`/purchase/${purchase.id}/edit`, {
            state: purchase
        });
    }

    const printPurchaseBill = React.useCallback(async(purchase: Purchase) => {
        console.log('printBill', purchase)
        const company = await db.companies.get(companyID)!;
        const iframe = document.createElement('iframe');
        iframe.style.display = 'none';
        document.body.appendChild(iframe);

        const data: any = {
            ...purchase,
            company,
        }


        iframe.contentDocument?.write(purchasePattern(data));
        iframe.contentDocument?.close();
        iframe.contentWindow?.focus();
        iframe.contentWindow?.print();
    }, [companyID]);

    const columns: Array<Column<Purchase>> = React.useMemo(() => [
        {
            title: 'Invoice Number',
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

    const actions: Array<Action<Purchase>> = React.useMemo(() => [
        {
            icon: () => <Print />,
            tooltip: 'Print Purchase Entry',
            position: 'row',
            onClick: (event, rowData) => {
                console.log(rowData)
                printPurchaseBill(rowData as Purchase);
            },
        },
        {
            icon: () => <RemoveRedEye />,
            tooltip: 'View Purchase Entry',
            position: 'row',
            onClick: (event, rowData) => {
                console.log(rowData)
                viewPurchase(rowData as Purchase);
            },
        },
        // {
        //     icon: () => <EditTwoToneIcon />,
        //     tooltip: 'Edit Purchase Entry',
        //     position: 'row',
        //     onClick: (event, rowData) => {
        //         console.log(rowData)
        //         editPurchase(rowData as Purchase);
        //     },
        // },
        {
            icon: () => <Delete />,
            tooltip: 'Delete Purchase Entry',
            position: 'row',
            onClick: (event, rowData) => {
                const prchs = rowData as Purchase;
                setOpen(true);
                setDialog({
                    title: 'Delete Purchase Entry',
                    message: `Are you sure you want to delete this entry ${prchs.voucherNo} ?`,
                    onConfirm: () => {
                        deletePurchase(prchs).then(() => {
                            enqueueSnackbar(`Invoice : ${prchs.voucherNo} deleted.`, {
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
            tooltip: 'Delete Purchase Entries',
            position: 'toolbarOnSelect',
            onClick: (event, rowData) => {
                const purchases = rowData as Purchase[];
                setOpen(true);
                setDialog({
                    title: 'Delete Selected Purchase Entries',
                    message: 'Are you sure you want to delete selected entries ?',
                    onConfirm: () => {
                        purchases.forEach(prchs => {
                            deletePurchase(prchs).then(() => {
                                enqueueSnackbar(`Purchase : ${prchs.voucherNo} deleted.`, {
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
            icon: () => filter ? <FilterListOffIcon /> : <FilterListIcon />,
            tooltip: (filter ? 'Hide Filters' : 'Show Filters'),
            position: 'toolbar',
            onClick: (event, rowData) => {
                setFilter(!filter);
            },

        }
     
    ], [ filter]);

    return (
        <>
            <MaterialTable
                isLoading={loading}
                columns={columns}
                title="Purchases"
                data={data}
                actions={actions}
                options={{
                    actionsColumnIndex: -1,
                    pageSize: 5,
                    pageSizeOptions: [5, 10, 20, 30, 50],
                    selection: true,
                    draggable: true,
                    filtering: filter,
                    headerStyle: {
                        fontWeight: 'bold',
                    },
                    exportMenu: [
                        {
                          label: "Export PDF",
                          exportFunc: (cols, datas) => ExportPdf(cols, datas, `Purchase ${moment().format('ll')}`),
                        },
                        {
                          label: "Export CSV",
                          exportFunc: (cols, datas) => ExportCsv(cols, datas, `Purchase ${moment().format('ll')}`),
                        },
                      ],
                }}
            />

            <AlertDialog message={dialog.message} open={open} setOpen={setOpen} title={dialog.title} onConfirm={dialog.onConfirm} onCancel={dialog.onCancel} />

        </>
    )
}

export default PurchaseTable
