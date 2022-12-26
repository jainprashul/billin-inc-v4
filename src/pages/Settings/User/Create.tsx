import { Dialog, DialogContent, DialogContentText, DialogTitle } from '@mui/material'
import React from 'react'
import { useDataUtils } from '../../../utils/useDataUtils'
import UserForm from './UserForm'

type Props = {
    open: boolean,
    setOpen: (open: boolean) => void
}

const Create = ({ open, setOpen }: Props) => {
    const { toast } = useDataUtils()
    function handleClose() {
        setOpen(false)
    }

    return (
        <Dialog open={open} onClose={handleClose} >
            <DialogTitle>
                Create User
            </DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    <UserForm onSubmit={(value) => {
                        value.save().then(() => {
                            toast.enqueueSnackbar('User created successfully', { variant: 'success' })
                            handleClose()
                        }).catch((err) => {
                            toast.enqueueSnackbar('Error creating user', { variant: 'error' })
                            console.log(err)
                        })
                    }} />
                </DialogContentText>
            </DialogContent>
        </Dialog>
    )
}

export default Create