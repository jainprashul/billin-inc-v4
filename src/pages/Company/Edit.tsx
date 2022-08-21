import { Typography } from '@mui/material'
import React from 'react'
import { useLocation } from 'react-router-dom'
import { Company, ICompany } from '../../services/database/model'
import { useDataUtils } from '../../utils/useDataUtils'
import CompanyForm from './CompanyForm'

type Props = {}

const Edit = (props: Props) => {
    const { navigate, toast } = useDataUtils();
    const location = useLocation()
    const company = new Company(location.state as ICompany)

    return (
        <div id='create-company'>
            <Typography variant='h5'>Edit Company</Typography>
            <CompanyForm company={company} onSubmit={(company) => {
                console.log(company)
                company.save().then((id) => {
                    navigate('/company')
                    console.log('Saved', id)
                    toast.enqueueSnackbar('Company Updated Successfully', {
                        variant:'success'
                    })
                }).catch((err)=> {
                    console.log(err);
                    toast.enqueueSnackbar('Company Updation Failed.', {
                        variant:'error'
                    })
                })
            }} />
        </div>
    )
}

export default Edit