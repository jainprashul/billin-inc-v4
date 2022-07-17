import { Alert, Autocomplete, Button, Grid, TextField } from '@mui/material'
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { Client } from '../../services/database/model';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { getStateCites, stateList } from '../../constants/states';
import { gstPattern } from '../../constants';

type Props = {
    client?: Client
    onSubmit: (client: Client) => void
}

const ClientForm = ({
    client = new Client({
        name: '',
        address: {
            address: '',
            city: '',
            state: '',
        },
        companyID: 1,
        contacts: [{
            name: '',
            email: '',
            phone: '',
            mobile: '',
        }],
        details: '',
        gst: '',
    }), onSubmit
}: Props) => {

    const submitHandler = (values: Client) => {
        onSubmit(values);
        // onSubmit(values)
    }
    const formik = useFormik({
        initialValues: client,
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
    })

    const { name, address, contacts, details, gst } = formik.values;
    console.log(address);

    const cityOptions = getStateCites(address.state) || [];
    const stateOptions = stateList || [];

    return (
        <form onSubmit={formik.handleSubmit}>
            {Object.keys(formik.errors).length ? <Alert severity="error" >
                {JSON.stringify(formik.errors)}
            </Alert> : <></>}
            <Grid container spacing={2}>
                <Grid item xs={6} md={6}>
                    <TextField variant='standard'
                        margin="dense"
                        required
                        fullWidth
                        id="name"
                        label="Name"
                        name="name"
                        autoComplete="name"
                        autoFocus
                        value={name}
                        onChange={
                            e => {
                                formik.setFieldValue('name', e.target.value);
                                formik.setFieldValue('contacts[0].name', e.target.value);
                            }
                        }
                    />

                    <TextField variant='standard'
                        margin="dense"
                        fullWidth
                        id="address"
                        name="address"
                        label="Address"
                        multiline
                        minRows={2}
                        value={address.address}
                        error={formik.errors.address ? true : false}
                        helperText={formik.errors.address?.address}
                        onChange={
                            e => formik.setFieldValue('address.address', e.target.value)
                        }
                    />

                    {/* <TextField variant='standard'
                        margin="dense"
                        fullWidth
                        id="state"
                        name="state"
                        label="State"
                        type="text"
                        autoComplete="state"
                        value={address.state}
                        onChange={
                            e => formik.setFieldValue('address.state', e.target.value)
                        }
                    /> */}

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
                            margin="dense"
                            fullWidth
                            id="state"
                            name="state"
                            label="State"
                            type="text"
                            error={formik.errors.address?.state ? true : false}
                            helperText={formik.errors.address?.state}

                        />}
                    />

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
                            margin="dense"
                            fullWidth
                            id="city"
                            name="city"
                            label="City"
                            type="text"
                            error={formik.errors.address?.city ? true : false}
                            helperText={formik.errors.address?.city}
                        />}
                    />

                    <TextField variant='standard'
                        margin="dense"
                        fullWidth
                        id="gst"
                        name="gst"
                        label="GST"
                        type="text"
                        autoComplete="gst"
                        value={gst}
                        inputProps={{
                            // pattern : gstPattern
                        }}
                        onChange={formik.handleChange}
                    />
                </Grid>
                <Grid item xs={6} md={6}>
                    <TextField variant='standard'
                        margin="dense"
                        fullWidth
                        id="contact"
                        name="contact"
                        label="Contact"
                        type="tel"
                        autoComplete="phone"
                        value={contacts[0].phone}
                        error={formik.errors.contacts ? true : false}
                        // helperText={formik.errors.contacts[0]?.phone}
                        inputProps={{
                            // pattern: "[0-9]{10}"
                        }}
                        onChange={
                            e => formik.setFieldValue('contacts[0].phone', e.target.value)
                        }
                    />
                    <TextField variant='standard'
                        margin="dense"
                        fullWidth
                        id="contact2"
                        name="contact2"
                        label="Contact 2"
                        type="tel"
                        autoComplete="phone"
                        inputProps={{
                            // pattern: "[0-9]{10}"
                        }}
                        value={contacts[0].mobile}
                        onChange={
                            e => formik.setFieldValue('contacts[0].mobile', e.target.value)
                        }
                    />

                    <TextField variant='standard'
                        margin="dense"
                        fullWidth
                        id="email"
                        name="email"
                        label="Email"
                        type="email"
                        autoComplete="email"
                        value={contacts[0].email}
                        onChange={
                            e => formik.setFieldValue('contacts[0].email', e.target.value)
                        }
                    />

                    <TextField variant='standard'
                        margin="dense"
                        fullWidth
                        id="details"
                        name="details"
                        label="Details"
                        multiline
                        minRows={3}
                        value={details}
                        onChange={formik.handleChange}
                    />
                </Grid>
            </Grid>
            <div className="client-footer" >
                <Button style={{
                    marginRight: '10px'
                }} type="reset" onClick={() => formik.resetForm()} variant="contained" color="primary">
                    Clear
                </Button>
                <Button type="submit" variant="contained" color="primary" startIcon={<AddCircleIcon />}>
                    Save
                </Button>
            </div>
        </form>
    )
}

export default ClientForm