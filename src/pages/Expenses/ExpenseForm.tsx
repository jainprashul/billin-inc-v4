import { Alert, Button, Grid, MenuItem, Select, TextField } from '@mui/material'
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import DateProvider from '../../components/shared/DateProvider';
import { useFormik } from 'formik'
import React from 'react'
import { ExpenseModes, ExpenseTypes } from '../../constants'
import { Expense } from '../../services/database/model'
import moment from 'moment';

type Props = {
    expense?: Expense,
    onSubmit: (expense: Expense) => void
}

const ExpenseForm = ({ onSubmit, expense = new Expense({
    description: '',
    amount: 0,
    date: new Date(),
    expenseType: 'OTHER',
    companyID: parseInt(localStorage.getItem("companyID") ?? '1'),
    expenseMode: 'CASH',
}) }: Props) => {

    const formik = useFormik({
        initialValues: expense,
        onSubmit: onSubmit,
        validationSchema: Expense.validationSchema,
    })

    const { description, amount, date, expenseType, expenseMode } = formik.values
    return (
        <div id='expense-form'>
            <form id="user-form" onSubmit={formik.handleSubmit}>
                {Object.keys(formik.errors).length ? <Alert severity="error" >
                    {JSON.stringify(formik.errors)}
                </Alert> : <></>}

                <Grid container spacing={2}>
                    <Grid item xs={12} md={10}>
                        <TextField variant='standard'
                            margin="dense"
                            required
                            minRows={3}
                            multiline
                            fullWidth
                            id="description"
                            label="Description"
                            name="description"
                            value={description}
                            onChange={formik.handleChange}
                            error={formik.touched.description && Boolean(formik.errors.description)}
                            helperText={formik.touched.description && formik.errors.description}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <DateProvider>
                            <DatePicker
                                label="Date"
                                value={date}
                                onChange={(newValue) => {
                                    formik.setFieldValue('date', moment(newValue).toDate())
                                }}
                                renderInput={(params) => <TextField variant='standard' fullWidth {...params} />}
                            />
                        </DateProvider>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField variant='standard'
                            margin="dense"
                            required
                            fullWidth
                            id="amount"
                            label="Amount"
                            name="amount"
                            type={'number'}
                            value={amount}
                            inputProps={{ min: 0 }}
                            onChange={formik.handleChange}
                            error={formik.touched.amount && Boolean(formik.errors.amount)}
                            helperText={formik.touched.amount && formik.errors.amount}
                        />
                    </Grid>

                    <Grid item xs={6} md={6}>
                        <Select variant='standard'
                            margin="dense"
                            required
                            fullWidth
                            id="expenseType"
                            label="Expense Type"
                            name="expenseType"
                            value={expenseType}
                            onChange={e => {
                                formik.setFieldValue('expenseType', e.target.value);
                            }}
                        >
                            {ExpenseTypes.map((type) => (
                                <MenuItem key={type.value} value={type.value}>{type.label}</MenuItem>
                            ))}
                        </Select>
                    </Grid>
                    <Grid item xs={6} md={6}>
                        <Select variant='standard'
                            margin="dense"
                            required
                            fullWidth
                            id="expenseMode"
                            label="Expense Mode"
                            name="expenseMode"
                            value={expenseMode}
                            onChange={e => {
                                formik.setFieldValue('expenseMode', e.target.value);
                            }}
                        >
                            {ExpenseModes.map((type) => (
                                <MenuItem key={type.value} value={type.value}>{type.label}</MenuItem>
                            ))}
                        </Select>
                    </Grid>
                </Grid>
                <br />

                <div className='float-right'>
                    <Button style={{
                        marginRight: '10px'
                    }} type="reset" onClick={() => formik.resetForm()} variant="contained" color="primary">
                        Clear
                    </Button>
                    <Button type="submit" variant="contained" color="primary" >
                        Save
                    </Button>
                </div>
            </form>
        </div>
    )
}

export default ExpenseForm