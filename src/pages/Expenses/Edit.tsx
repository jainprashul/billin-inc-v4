import { Dialog, DialogContent, DialogContentText, DialogTitle } from '@mui/material'
import React, { useMemo } from 'react'
import { Expense } from '../../services/database/model'
import { useDataUtils } from '../../utils/useDataUtils'
import ExpenseForm from './ExpenseForm'

type Props = {
    open: boolean,
    expense: Expense,
    setOpen: (open: boolean) => void
}

const Edit = ({ open, setOpen, expense }: Props) => {
    const { toast } = useDataUtils()
    function handleClose() {
        setOpen(false)
    }
    const userData = useMemo(() => new Expense(expense), [expense])
    return (
        <Dialog open={open} onClose={handleClose} >
            <DialogTitle>
                Edit User
            </DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    <ExpenseForm expense={userData} onSubmit={(value) => {
                        value.save().then(() => {
                            toast.enqueueSnackbar('Expense updated successfully', { variant: 'success' })
                            handleClose()
                        }).catch((err) => {
                            toast.enqueueSnackbar('Error updating expense', { variant: 'error' })
                            console.log(err)
                        })
                    }} />
                </DialogContentText>
            </DialogContent>
        </Dialog>
    )
}

export default Edit