import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';

import Typography from '@mui/material/Typography';
import authService from '../../services/authentication/auth.service';
import { Alert } from '@mui/material';
import { AccountCircleOutlined } from '@mui/icons-material';
import { getConfig } from '../../services/database/db';
import { Customer } from '../../services/database/model/Customer';

function Copyright(props: any) {
    return (
        <Typography variant="body2" color="text.secondary" align="center" {...props}>
            {'Copyright © '}
            <Link color="inherit" target={'_blank'} href="https://billinginc.now.sh/">
                Billin&apos; Inc
            </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}

type Props = {
    setFirstTime: React.Dispatch<React.SetStateAction<boolean>>

}
export default function Signup(props: Props) {
    const [error, setError] = React.useState<string | null>(null);
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        try {
            const data = new FormData(event.currentTarget);
            const creds = {
                name: data.get('name') as string,
                username: data.get('username') as string,
                email: data.get('email') as string,
                password: data.get('password') as string,
                password_confirmation: data.get('repeat-password') as string,
            }
            // console.log(creds);
            if (creds.password !== creds.password_confirmation) {
                setError('Passwords do not match');
                return;
            }

            const confg = await getConfig()

            const customer: Customer = {
                name: creds.name,
                email: creds.email,
                phone: data.get('phone') as string,
                address: data.get('address') as string,
                license: {
                    serialKey: confg.serialKey,
                    key: confg.lisenseKey!,
                    lisenseType: confg.lisenseType!,
                    validationDate: confg.lisenseValidationDate!,
                    validTill: confg.lisenseValidTill!
                }
            }

            const customerRes = await updateCustomer(customer)

            const response = await authService.register(creds)

            console.log(response, customerRes);
            props.setFirstTime(false);
            window.location.href = "/";

        } catch (error: any) {
            setError(error.message);

        }


    };

    async function updateCustomer(data: Customer) {
        const res = await fetch('https://console-billin-inc.vercel.app/api/customers', {
            method: "POST",
            body: JSON.stringify(data),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        })

        const response = await res.json()

        if (response.result !== 'success') {
            throw Error('Something went wrong.')
        }

        return true
    }

    return (
        <Grid container component="main" sx={{ height: '100vh' }}>
            <CssBaseline />
            <Grid item xs={false} sm={4} md={7} sx={{
                backgroundImage: 'url(https://source.unsplash.com/random), url("../assets/bg.jpg")',
                backgroundRepeat: 'no-repeat',
                backgroundColor: (t) =>
                    t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
                backgroundSize: 'cover',
                backgroundPosition: 'center',
            }} />
            <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
                <Box sx={{
                    my: 4,
                    mx: 4,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
                >
                    <Typography component="h1" color={'primary'} variant="h4">
                        Billin&apos; Inc
                    </Typography>
                    <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
                        <AccountCircleOutlined />
                    </Avatar>
                    <Typography component="h2" variant="h5">
                        Create a new user
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit} sx={{}}>
                        <TextField
                            margin="dense"
                            required
                            fullWidth
                            id="name"
                            label="Name"
                            placeholder='Name'
                            name="name"
                            type={'text'}
                            autoComplete="name"
                            autoFocus
                        />
                        <TextField
                            margin="dense"
                            required
                            fullWidth
                            id="username"
                            label="Username"
                            placeholder='Username'
                            name="username"
                            type={'text'}
                            autoComplete="username"
                        />
                        <TextField
                            margin="dense"
                            required
                            fullWidth
                            id="email"
                            label="E-mail"
                            placeholder='E-mail'
                            name="email"
                            type={'email'}
                            autoComplete="email"
                        />
                        <TextField
                            margin="dense"
                            required
                            fullWidth
                            id="phone"
                            label="Phone"
                            placeholder='Phone no.'
                            name="phone"
                            type={'tel'}
                            autoComplete="tel"
                        />
                        <TextField
                            margin="dense"
                            required
                            fullWidth
                            id="address"
                            label="Address"
                            placeholder='Address'
                            name="address"
                            type={'text'}
                            autoComplete="address"
                        />
                        <TextField
                            margin="dense"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                        />
                        <TextField
                            margin="dense"
                            required
                            fullWidth
                            name="repeat-password"
                            label="Repeat Password"
                            type="password"
                            id="repeat-password"
                            autoComplete="current-password"
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
                            Create User
                        </Button>
                        {/* <Grid container>
                            <Grid item xs>
                                <Link href="#" variant="body2">
                                    Forgot password?
                                </Link>
                            </Grid>
                            <Grid item>
                                <Link href={'#'} variant="body2">
                                    {"Don't have an account? Sign Up"}
                                </Link>
                            </Grid>
                        </Grid> */}
                        <Copyright sx={{ mt: 5 }} />
                    </Box>
                </Box>
            </Grid>
        </Grid>
    );
}