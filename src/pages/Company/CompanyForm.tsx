import { Alert, Autocomplete, Button, FormControl, FormLabel, Grid, TextField, Typography } from '@mui/material'
import { useFormik } from 'formik'
import AddCircleIcon from '@mui/icons-material/AddCircle';
import React from 'react'
import * as Yup from 'yup';
import { gstPattern } from '../../constants';
import { getStateCites, stateList } from '../../constants/states';
import { Company } from '../../services/database/model'

type Props = {
    company?: Company
    onSubmit: (company: Company) => void
}

const initCompany: Company = new Company({
    name: '',
    address: {
        address: '',
        city: '',
        state: '',
    },
    contacts: [
        {
            name: '',
            email: '',
            phone: '',
        }
    ],
    gst: '',
    lastGSTInvoiceNo: 0,
    lastInvoiceNo: 0,
    userIDs: new Set([]),
})

const CompanyForm = ({ company = initCompany, onSubmit }: Props) => {

    const submitHandler = (values: Company) => {
        values.createdAt = new Date();
        values.createdBy = 'admin';
        onSubmit(values);
    }
    const formik = useFormik({
        initialValues: company,
        onSubmit: submitHandler,
        validationSchema: Yup.object().shape({
            name: Yup.string().required('Name is required'),
            address: Yup.object().shape({
                address: Yup.string().required('Address is required'),
                city: Yup.string().required('City is required'),
                state: Yup.string().required('State is required'),
            }),
            contacts: Yup.array().of(Yup.object().shape({
                name: Yup.string().required('Name is required'),
                email: Yup.string().email('Invalid email'),
                phone: Yup.string().required('Phone is required'),
                mobile: Yup.string(),
            })).min(1, 'At least one contact is required'),

        }),
        validateOnChange: false,
    })
    const { name, address, contacts, gst, email } = formik.values;
    const cityOptions = getStateCites(address.state) || [];
    const stateOptions = stateList || [];
    return (
        <form onSubmit={formik.handleSubmit}>
            {Object.keys(formik.errors).length ? <Alert severity="error" >
                {JSON.stringify(formik.errors)}
            </Alert> : <></>}

            <FormControl component="fieldset" className='form-border' style={{
                border: '1px solid #ddd',
                borderRadius: 5,
                padding: 10,
                marginBottom: 10,
                maxWidth: 800,
            }} >
                <FormLabel component="legend" >&nbsp;Contact Details &nbsp;</FormLabel>
                <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                        <TextField variant='standard'
                            required
                            fullWidth
                            id="name"
                            label="Company Name"
                            name="name"
                            autoComplete="name"
                            autoFocus
                            value={name}
                            onChange={
                                e => {
                                    formik.setFieldValue('name', e.target.value);
                                }
                            }
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField variant='standard'
                            fullWidth
                            id="email"
                            label="Company Email"
                            name="email"
                            autoComplete="email"
                            type={'email'}
                            autoFocus
                            value={email}
                            onChange={
                                e => {
                                    formik.setFieldValue('email', e.target.value);
                                }
                            }
                        />
                    </Grid>
                    <Grid item xs={12} md={10}>
                        <TextField variant='standard'
                            fullWidth
                            id="address"
                            name="address"
                            label="Address"
                            required
                            multiline
                            minRows={2}
                            value={address.address}
                            error={formik.errors.address ? true : false}
                            helperText={formik.errors.address?.address}
                            onChange={
                                e => formik.setFieldValue('address.address', e.target.value)
                            }
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>

                        <Autocomplete
                            disablePortal
                            id="combo-box-demo"
                            options={stateOptions}
                            value={address.state}
                            onChange={(e, value, reason, detail) => {
                                formik.setFieldValue('address.state', value);
                            }}
                            renderInput={(params) => <TextField {...params}
                                variant='standard'
                                fullWidth
                                required
                                id="state"
                                name="state"
                                label="State"
                                type="text"
                                error={formik.errors.address?.state ? true : false}
                                helperText={formik.errors.address?.state}

                            />}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Autocomplete
                            disablePortal
                            id="combo-box-demo"
                            options={cityOptions}
                            value={address.city}
                            onChange={(e, value, reason, detail) => {
                                formik.setFieldValue('address.city', value);
                            }}
                            renderInput={(params) => <TextField {...params}
                                variant='standard'
                                required
                                fullWidth
                                id="city"
                                name="city"
                                label="City"
                                type="text"
                                error={formik.errors.address?.city ? true : false}
                                helperText={formik.errors.address?.city}
                            />}
                        />

                    </Grid>
                    <Grid item xs={6} md={6}>
                        <TextField variant='standard'
                            fullWidth
                            id="gst"
                            name="gst"
                            label="GST"
                            type="text"
                            autoComplete="gst"
                            value={gst}
                            inputProps={{
                                
                            }}
                            onChange={formik.handleChange}
                        />
                    </Grid>
                </Grid>
            </FormControl>

            <FormControl component="fieldset" style={{
                border: '1px solid #ddd',
                borderRadius: 5,
                padding: 10,
                marginBottom: 10,
                maxWidth: 800,
            }} >
                <FormLabel component="legend" >&nbsp;Contact Details &nbsp;</FormLabel>
                <Grid container spacing={3} >
                    {
                        contacts.map((contact, i) => (<>
                            <Grid item xs={12} md={6}>
                                <TextField variant='standard'
                                    required
                                    fullWidth
                                    id="name"
                                    label="Contact Name"
                                    name="name"
                                    autoComplete="name"
                                    autoFocus
                                    value={contact.name}
                                    onChange={
                                        e => {
                                            formik.setFieldValue(`contacts[${i}].name`, e.target.value);
                                        }
                                    }
                                />
                            </Grid>
                            <Grid item xs={12} md={6} >
                                <TextField variant='standard'
                                    fullWidth
                                    id="contact"
                                    name="contact"
                                    label="Contact"
                                    type="tel"
                                    required
                                    autoComplete="phone"
                                    value={contact.phone}
                                    error={formik.errors.contacts ? true : false}
                                    // helperText={formik.errors.contacts[0]?.phone}
                                    inputProps={{
                                        // pattern: "[0-9]{10}"
                                    }}
                                    onChange={
                                        e => formik.setFieldValue(`contacts[${i}].phone`, e.target.value)
                                    }
                                />
                            </Grid>
                            <Grid item xs={12} md={6} >
                                <TextField variant='standard'
                                    fullWidth
                                    id="contact2"
                                    name="contact2"
                                    label="Contact 2"
                                    type="tel"
                                    autoComplete="phone"
                                    inputProps={{
                                        // pattern: "[0-9]{10}"
                                    }}
                                    value={contact.mobile}
                                    onChange={
                                        e => formik.setFieldValue(`contacts[${i}].mobile`, e.target.value)
                                    }
                                />
                            </Grid>
                            <Grid item xs={12} md={6} >
                                <TextField variant='standard'

                                    fullWidth
                                    id="email"
                                    name="email"
                                    label="Contact Email"
                                    type="email"
                                    autoComplete="email"
                                    value={contact.email}
                                    onChange={
                                        e => formik.setFieldValue(`contacts[${i}].email`, e.target.value)
                                    }
                                />
                            </Grid>
                        </>))
                    }
                </Grid>
            </FormControl>
            <br />
            <div className="company-footer" >
                <Button style={{
                    marginRight: '10px'
                }} type="reset" onClick={() => formik.resetForm()} variant="contained" color="primary">
                    Clear
                </Button>
                <Button type="submit" variant="contained" color="primary" startIcon={<AddCircleIcon />}>
                    Save
                </Button>
            </div>
        </form >
    )
}

export default CompanyForm