import { Button, Grid, Typography } from '@mui/material'
import { useLiveQuery } from 'dexie-react-hooks'
import React from 'react'
import { ExpenseCreate } from '.'
import { useDataUtils } from '../../utils/useDataUtils'
import ExpensePieChart from './ExpensePieChart'
import ExpenseTable from './ExpenseTable'

type Props = {}

const Expenses = (props: Props) => {
    const { companyDB } = useDataUtils();
    const [open, setOpen] = React.useState(false)


    const expenses = useLiveQuery(async () => {
        if (companyDB) {
            const expense = (await companyDB?.expenses.toArray())
            return expense;
        }
    }, [companyDB], []) ?? [];
    return (
        <div id="expenses">
            <Typography variant="h6">Expenses</Typography>
            <div className='rightContent' >
                <Button variant='contained' onClick={() => { setOpen(true) }} color='primary' >Add Expense</Button>
            </div>
            <Grid container spacing={2}>
                <Grid item xs={12} sm={3}>
                    <ExpensePieChart data={expenses}/>
                </Grid>
                <Grid item xs={12} sm={9}>
                    <ExpenseTable data={expenses} />
                </Grid>
            </Grid>
            
            {open && <ExpenseCreate open={open} setOpen={setOpen} />}
        </div>
    )
}

export default Expenses