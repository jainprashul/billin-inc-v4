import { Typography } from '@mui/material'
import React from 'react'
import { BankAccount } from '../../services/database/model/BankAccount'
import { useDataUtils } from '../../utils/useDataUtils'
import BankForm from './BankForm'

type Props = {}

const Edit = (props: Props) => {
    const { toast , navigate, location } = useDataUtils()

    const account = new BankAccount(location.state as BankAccount)
  return (
    <div>
        <Typography variant="h6">Edit Bank Account</Typography>
        <br />
        <BankForm bank={account} onSubmit={(account) => {
            console.log('account ', account)
            account.save().then(()=>{
                console.log('Saved')
                toast.enqueueSnackbar('Bank Account Updated', { variant: 'success' });
                navigate('/bank')
            }
            ).catch((err)=>{
                console.log('Error', err)
                toast.enqueueSnackbar('Error Updating Bank Account', { variant: 'error' });
                })
            }
        } />
    </div>
  )
}

export default Edit