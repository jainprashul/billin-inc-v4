import { Typography } from '@mui/material'
import React from 'react'
import { useDataUtils } from '../../utils/useDataUtils'
import CompanyForm from './CompanyForm'

type Props = {}

const Create = (props: Props) => {
    const { navigate, toast } = useDataUtils();
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
                    navigate('/company')
                    console.log('Saved', id)
                    toast.enqueueSnackbar('Company Created Successfully', {
                        variant:'success'
                    })
                }).catch((err)=> {
                    console.log(err);
                    toast.enqueueSnackbar('Company Creation Failed.', {
                        variant:'error'
                    })
                })
            }} />
        </div>
    )
}

export default Create