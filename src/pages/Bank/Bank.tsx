import { Button, Grid } from '@mui/material'
import { useLiveQuery } from 'dexie-react-hooks'
import React from 'react'
import { BANK_ACCOUNT_CREATE } from '../../constants/routes'
import { useDataUtils } from '../../utils/useDataUtils'
import BankAccountTable from './BankTable'

type Props = {}

const Bank = (props: Props) => {
    const { navigate, companyDB } = useDataUtils()
    const accounts = useLiveQuery(async () => {
        if (!companyDB) return []
        const bankAccounts = await companyDB.bankAccounts.toArray()
        return bankAccounts
    }, [companyDB])!

  return (
    <div id="bank">
        <Grid justifyContent={'end'} container spacing={2} marginBottom={2  }>
        <Button  variant='contained' onClick={()=> navigate(BANK_ACCOUNT_CREATE)} color='primary'>Add Bank Account</Button>
        </Grid>
        <BankAccountTable data={accounts} />

    </div>
  )
}

export default Bank