import MaterialTable, { Action, Column } from '@material-table/core'
import React, { useMemo } from 'react'
import AlertDialog from '../../components/shared/AlertDialog'
import { Expense } from '../../services/database/model'
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useDataUtils } from '../../utils/useDataUtils'
import { ExpenseEdit } from '.';
import { ExportCsv, ExportPdf } from '@material-table/exporters';
import moment from 'moment';

type Props = {
    data: Array<Expense>
}



const ExpenseTable = ({ data }: Props) => {
    const { toast } = useDataUtils()
    const [edit, setEdit] = React.useState({
        open: false,
        expense: undefined as Expense | undefined
    })
    
    const [dialog, setDialog] = React.useState({
        open: false,
        title: "",
        message: "",
        onConfirm: () => { }
    });

    const deleteExpense = async (expense: Expense) => {
        await new Expense(expense).delete();
    }

    const columns: Array<Column<Expense>> = useMemo(() => [
        {
            title: 'Date',
            field: 'date',
            type: 'date',
        }, {
            title: 'Description',
            field: 'description',
        }, {
            title: 'Expense Type',
            field: 'expenseType',
        }, {
            title : "Expense Mode",
            field: "expenseMode",
        },{
            title: 'Amount',
            field: 'amount',
            type: 'currency',
            currencySetting: {
                currencyCode: 'INR',
                minimumFractionDigits: 2,
                locale: 'en-IN',
            },
        },
    ], [])

    const actions : Array<Action<Expense>> = useMemo(() => [
        {
            icon: () => <EditIcon />,
            tooltip: 'Edit Expense',
            onClick: (event, rowData) => {
                let expense = rowData as Expense
                setEdit({
                    open: true,
                    expense
                })
                // console.log('edit', rowData)
            },
        },
        {
            icon: () => <DeleteIcon />,
            tooltip: 'Delete Expense',
            onClick: (event, rowData) => {
                let expense = rowData as Expense
                setDialog({
                    open: true,
                    title: "Delete Expense",
                    message: `Are you sure you want to delete ${expense.description}?`,
                    onConfirm: async () => {
                        await deleteExpense(expense)
                        toast.enqueueSnackbar(`Expense ${expense.description} deleted successfully`, { variant: 'success' })
                    }
                })
            },
        }
    ], [toast])

    return (
        <>
            <MaterialTable
                columns={columns}
                data={data}
                actions={actions}
                options={{
                    actionsColumnIndex: -1,
                    pageSize: 5,
                    pageSizeOptions: [5, 10, 20, 30, 50],
                    draggable: true,
                    headerStyle: {
                        fontWeight: 'bold',
                    },       
                    exportMenu: [
                        {
                          label: "Export PDF",
                          exportFunc: (cols, datas) => ExportPdf(cols, datas, `Expense ${moment().format('ll')}`),
                        },
                        {
                          label: "Export CSV",
                          exportFunc: (cols, datas) => ExportCsv(cols, datas, `Expense ${moment().format('ll')}`),
                        },
                      ],
                         }}
                title={`Expenses`}
            
            />
            {/* Dialogs  */}
            <AlertDialog
                open={dialog.open}
                setOpen={(open) => setDialog({ ...dialog, open })}
                title={dialog.title}
                message={dialog.message}
                onConfirm={dialog.onConfirm}
                backdropClose={false}
            />

            {
                edit.open && <ExpenseEdit open={edit.open} setOpen={(opem) => {
                    setEdit({ ...edit, open: opem })
                }} expense={edit.expense!} />
            }
        </>
    )
}

export default ExpenseTable