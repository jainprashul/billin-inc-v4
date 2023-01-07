import { Button, FormControl, Grid, InputLabel, MenuItem, Select, TextField } from '@mui/material'
import { useFormik } from 'formik'
import React from 'react'
import { BankAccount } from '../../services/database/model/BankAccount'

type Props = {
    bank?: BankAccount
    onSubmit: (bank: BankAccount) => void
}

const BankForm = ({
    onSubmit, bank = new BankAccount({
        accountHolder: '',
        accountNo: '',
        bankName: '',
        branch: '',
        ifsc: '',
        accountType: 'SAVINGS',
        companyID: parseInt(localStorage.getItem("companyID") ?? '1'),
    })
}: Props) => {

    const formik = useFormik({
        initialValues: bank,
        onSubmit: (values) => {
            onSubmit(values)
        },
    })

    const {
        accountHolder, accountNo, accountType, bankName, branch, ifsc
    } = formik.values
    return (
        <div id="bank-form">
            <form onSubmit={formik.handleSubmit}>
                <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            label="Account Holder"
                            name="accountHolder"
                            value={accountHolder}
                            onChange={formik.handleChange}
                        />

                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            label="Account No"
                            name="accountNo"
                            value={accountNo}
                            onChange={formik.handleChange}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            label="Bank Name"
                            name="bankName"
                            value={bankName}
                            onChange={formik.handleChange}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            label="Branch"
                            name="branch"
                            value={branch}
                            onChange={formik.handleChange}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            label="IFSC"
                            name="ifsc"
                            value={ifsc}
                            onChange={formik.handleChange}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <FormControl fullWidth>
                            <InputLabel id="demo-simple-select-label">Account Type</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                fullWidth
                                value={accountType}
                                label="Account Type"
                                name="accountType"
                                onChange={formik.handleChange}
                            >
                                <MenuItem value="SAVINGS">Savings</MenuItem>
                                <MenuItem value="CURRENT">Current</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                </Grid>

                <br />

                <Button type="submit" variant="contained" color="primary">Submit</Button>
            </form>

        </div >
    )
}

export default BankForm