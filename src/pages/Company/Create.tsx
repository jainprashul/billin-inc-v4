import { Typography } from '@mui/material'
import React from 'react'
import AlertDialog from '../../components/shared/AlertDialog'
import { useDataUtils } from '../../utils/useDataUtils'
import CompanyForm from './CompanyForm'

type Props = {}

const Create = (props: Props) => {
    const { toast, setCompanyID } = useDataUtils();
    const [open , setOpen] = React.useState(false)
    return (
        <div id='create-company' style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
        }}>
            <Typography variant='h5'>Create Company</Typography>
            <CompanyForm onSubmit={(company) => {
                console.log(company)
                company.save().then((id) => {
                    setCompanyID(id)
                    // navigate('/company')
                    console.log('Saved', id)
                    toast.enqueueSnackbar('Company Created Successfully', {
                        variant: 'success'
                    })
                    setOpen(true)
                }).catch((err) => {
                    console.log(err);
                    toast.enqueueSnackbar('Company Creation Failed.', {
                        variant: 'error'
                    })
                })
            }} />

            <AlertDialog 
                title={'Company Created Successfully'}
                message={'You need to restart the application for the changes to take effect.'}
                open={open}
                setOpen={() => {}}
                onConfirm={() => {
                    window.location.reload();
                }}
                showCancel={false}
                confirmText={'Restart'}
            />
        </div>
    )
}

export default Create