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

function Copyright(props: any) {
    return (
        <Typography variant="body2" color="text.secondary" align="center" {...props}>
            {'Copyright © '}
            <Link color="inherit" target={'_blank'} href="https://billinginc.now.sh/">
                Billin' Inc
            </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}


export default function Signup() {
    const [error, setError] = React.useState<string | null>(null);
    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        let creds = {
            name : data.get('name') as string,
            username : data.get('username') as string,
            email: data.get('email') as string,
            password: data.get('password') as string,
            password_confirmation: data.get('repeat-password') as string,
        }
        // console.log(creds);
        if (creds.password !== creds.password_confirmation) {
            setError('Passwords do not match');
            return;
        }
        
        authService.register(creds).then((response) => {
            console.log(response);
            window.location.href = "/";
        }).catch((error) => {
            setError(error.message);
        });

    };

    return (
        <Grid container component="main" sx={{ height: '100vh' }}>
            <CssBaseline />
            <Grid item xs={false} sm={4} md={7} sx={{
                    backgroundImage: 'url(https://source.unsplash.com/random)',
                    backgroundRepeat: 'no-repeat',
                    backgroundColor: (t) =>
                        t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}/>
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
                        Billin' Inc
                    </Typography>
                    <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
                        <AccountCircleOutlined />
                    </Avatar>
                    <Typography component="h2" variant="h5">
                        Create a new user
                    </Typography>
                    <Box component="form"  onSubmit={handleSubmit} sx={{  }}>
                        <TextField
                            margin="normal"
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
                            margin="normal"
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
                            margin="normal"
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
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                        />
                        <TextField
                            margin="normal"
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