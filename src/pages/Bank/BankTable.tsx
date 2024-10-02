import MaterialTable, { Action, Column } from '@material-table/core';
import { ExportCsv, ExportPdf } from '@material-table/exporters';
import { Edit } from '@mui/icons-material';
import Delete from '@mui/icons-material/Delete';
import moment from 'moment';
import React from 'react'
import AlertDialog from '../../components/shared/AlertDialog';
import { BankAccount } from '../../services/database/model/BankAccount';
import { useDataUtils } from '../../utils/useDataUtils';


type Props = {
    data: Array<BankAccount>
}


const BankAccountTable = ({ data }: Props) => {
    const { navigate, companyDB, toast } = useDataUtils()

    const [loading, setLoading] = React.useState(true)
    React.useEffect(() => {
        setLoading(!(data ? data.length !== 0 : false))
        setTimeout(() => {
            setLoading(false)
        }, 2000);
    }, [data])

    const [open, setOpen] = React.useState(false);
    const [dialog, setDialog] = React.useState({
        title: '',
        message: '',
        onCancel: () => { },
        onConfirm: () => { },
    });

    function deleteAccount(prchs: BankAccount) {
        return companyDB!.bankAccounts.delete(prchs.id)
    }

    const columns: Array<Column<BankAccount>> = React.useMemo(() => [
        {
            title: 'Bank Account Holder',
            field: 'accountHolder',
        },
        {
            title: 'Bank Name',
            field: 'bankName',
        },
        {
            title: 'Account No',
            field: 'accountNo',
        },
        {
            title: 'IFSC Code',
            field: 'ifsc',

        },
        {
            title: 'Account Type',
            field: 'accountType',
        },
    ], [])

    const actions: Array<Action<BankAccount>> = React.useMemo(() => ([
        {
            icon: () => <Edit />,
            tooltip: 'Edit Bank Account',
            onClick: (event, rowData) => {
                const data = rowData instanceof Array ? rowData[0] : rowData
                navigate(`/bank-account/${data.id}/edit`, {
                    state: data
                })
            }
        },
        {
            icon: () => <Delete />,
            tooltip: 'Delete Bank Account',
            onClick: (event, rowData) => {
                const prchs = rowData instanceof Array ? rowData[0] : rowData
                setOpen(true);
                setDialog({
                    title: 'Delete Purchase Entry',
                    message: `Are you sure you want to delete this account ${prchs.bankName} , ${prchs.accountHolder} ?`,
                    onConfirm: () => {
                        deleteAccount(prchs).then(() => {
                            toast.enqueueSnackbar(`Account : ${prchs.accountHolder} deleted.`, {
                                variant: 'error',
                            });
                        })
                    },
                    onCancel: () => { }
                });
            }
        }
    ]),
         
        [])

    return (
        <>
            <MaterialTable
                isLoading={loading}
                columns={columns}
                actions={actions}
                title="Bank Accounts"
                data={data}
                onRowClick={(event, row) => {
                    navigate(`/bank-account/${row?.id}`, {
                        state: row
                    })
                }}
                options={{
                    actionsColumnIndex: -1,
                    pageSize: 7,
                    pageSizeOptions: [5,7, 10, 20, 30, 50],
                    draggable: true,
                    // filtering : filter,
                    headerStyle: {
                        fontWeight: 'bold',
                    },
                    exportMenu: [
                        {
                          label: "Export PDF",
                          exportFunc: (cols, datas) => ExportPdf(cols, datas, `Accounts ${moment().format('ll')}`),
                        },
                        {
                          label: "Export CSV",
                          exportFunc: (cols, datas) => ExportCsv(cols, datas, `Accounts ${moment().format('ll')}`),
                        },
                      ],
                }}
            />

            <AlertDialog message={dialog.message} open={open} setOpen={setOpen} title={dialog.title} onConfirm={dialog.onConfirm} onCancel={dialog.onCancel} />

        </>
    )
}

export default BankAccountTable
