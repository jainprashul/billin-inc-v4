import { Typography } from '@mui/material'
import React from 'react'
import { BANK_ACCOUNT } from '../../constants/routes'
import { useDataUtils } from '../../utils/useDataUtils'
import BankForm from './BankForm'

type Props = {}

const Create = (props: Props) => {

    const { toast, navigate } = useDataUtils()
    return (
        <div>
            <Typography variant="h6">Create Bank Account</Typography>
            <br />

            <div style={{
                maxWidth: '700px',
            }}>
                <BankForm onSubmit={(account => {
                    console.log('account ', account)
                    account.save().then(() => {
                        console.log('Saved')
                        toast.enqueueSnackbar('Bank Account Created', { variant: 'success' });
                        navigate(BANK_ACCOUNT)
                    }
                    ).catch((err) => {
                        console.log('Error', err)
                        toast.enqueueSnackbar('Error Creating Bank Account', { variant: 'error' });
                    })
                })} />
            </div>
        </div>
    )
}

export default Create