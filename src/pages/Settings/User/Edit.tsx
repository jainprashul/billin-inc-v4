import { Dialog, DialogContent, DialogContentText, DialogTitle } from '@mui/material'
import React, { useMemo } from 'react'
import { User } from '../../../services/database/model'
import { useDataUtils } from '../../../utils/useDataUtils'
import UserForm from './UserForm'

type Props = {
    open: boolean,
    user: User,
    setOpen: (open: boolean) => void
}

const Edit = ({ open, setOpen, user }: Props) => {
    const { toast } = useDataUtils()
    function handleClose() {
        setOpen(false)
    }
    const userData = useMemo(() =>  new User(user) , [user])

    return (
        <Dialog open={open} onClose={handleClose} >
            <DialogTitle>
                Edit User
            </DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    <UserForm user={userData} onSubmit={(value) => {
                        value.update().then(() => {
                            toast.enqueueSnackbar('User updated successfully', { variant: 'success' })
                            handleClose()
                        }).catch((err) => {
                            toast.enqueueSnackbar('Error updating user', { variant: 'error' })
                            console.log(err)
                        })
                    }} />
                </DialogContentText>
            </DialogContent>
        </Dialog>
    )
}

export default Edit