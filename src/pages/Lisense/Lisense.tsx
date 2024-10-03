import LockOutlined from '@mui/icons-material/LockOutlined';
import { Alert, Avatar, Box, Button, TextField, Typography } from '@mui/material';
import React, { useEffect } from 'react'
import { getConfig } from '../../services/database/db';
import { checkLicense, checkLicenseKey, CreateLicense } from '../../services/lisensing';
import { useDataUtils } from '../../utils/useDataUtils';

type Props = {}

const Lisense = (props: Props) => {
    const { toast } = useDataUtils()
    const [error, setError] = React.useState<string | null>(null);
    const [serial, setSerial] = React.useState<string | null>(null);

    useEffect(() => {
        // getSerial 
        async function getSerial() {
            const confg = await getConfig();
            if (confg) {
                setSerial(confg.serialKey);
            }
        }
        getSerial()
    }, [])

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setError(null);
        const data = new FormData(event.currentTarget);
        const creds = {
            name: data.get('name')?.toString() ?? '',
            key: data.get('key')?.toString() ?? '',
        };

        const isValid = await checkLicenseKey(creds.key , creds.name)

        // if isLisenseValid
        if (isValid) {
            const lisense = await CreateLicense({
                license: creds.key as string,
                licenseeName: creds.name as string,
            })

            // check from db
            const confg = await getConfig();
            if (confg.lisenseKey && confg.lisenseKey === lisense.license) {
                console.log('lisense has been updated');
                toast.enqueueSnackbar('Lisense has been updated', {
                    variant: 'success',
                });
                // redirect to home
                setTimeout(async () => {
                    await checkLicense()
                    window.location.href = '/'
                }, 3000);
                
            }
            else {
                setError('Invalid Lisense Key');
            }
        }
        else {
            setError('Invalid Lisense Key');
        }
        console.log(creds, isValid);
    }
    return (
        <div className='random-image flex'>
            <div className='flex' style={{
                backgroundColor: '#fbece6',
                padding: 'clamp(.3rem, 1rem, 3rem)',
                margin: 'clamp(.2rem, 1rem, 3rem)',
                borderRadius: 10,
                width: 'clamp(300px, 50%, 100%)',
                boxShadow: '0px 0px 0.5rem 0px rgba(0,0,0,0.75)',
                textAlign: 'center',
                overflow: 'hidden',
                minHeight: '85vh',
            }}>
                <Typography variant="h5" color='primary'>Billin&apos; Inc</Typography>
                <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
                    <LockOutlined />
                </Avatar>

                <Typography variant='h6'>
                    It seems like your demo has been expired.
                </Typography>
                <Typography variant='subtitle1'>
                    Please contact at <a target={'_blank'} href={`https://wa.me/+919406707245?text=My Billin' Subscription has been expired. Serial : ${serial?.replace(/-/g, '')}`} rel="noreferrer">+91-9406707245</a> to get a lisense.
                </Typography>

                <Typography variant='subtitle1'>
                    Serial : <span onClick={() => {
                        const val = serial?.replace(/-/g, '') ?? '';
                        navigator.clipboard.writeText(val)
                    }}>{serial}</span>
                </Typography>

                <Box component="form" onSubmit={handleSubmit} sx={{}}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="name"
                        label="Name"
                        placeholder='Licensee Name'
                        name="name"
                        type={'text'}
                        autoComplete="name"
                        autoFocus
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="key"
                        label="License Key"
                        placeholder='License Key'
                        name="key"
                        type={'text'}
                        autoComplete="key"
                    />

                    {
                        error && <Alert severity="error">{error}</Alert>
                    }
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 2, mb: 2 }}
                    >
                        Submit
                    </Button>
                </Box>

            </div>

        </div>
    )
}

export default Lisense