import { Dialog, DialogContent, DialogContentText, DialogTitle } from '@mui/material'
import Dexie from 'dexie'
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
    const [errors, setErrors] = React.useState<any>()

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
                            toast.enqueueSnackbar('Error creating User ', { variant: 'error' })
                            console.error(err)
                            console.log(err.message, err.type , err.name,  err instanceof Dexie.ConstraintError)
                            setErrors(err.message)
                        })
                    }}  errors={errors} />
                </DialogContentText>
            </DialogContent>
        </Dialog>
    )
}

export default Create