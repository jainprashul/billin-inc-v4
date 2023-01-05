import {  Button, Typography } from '@mui/material'
import React from 'react'
import { checkLicense } from '../../services/lisensing'
import Lottie from 'lottie-react';
import animationDate from '../../assets/mario-coin-animation.json';
import { LISENSE, SIGNUP } from '../../constants/routes';
import { useAppSelector } from '../../app/hooks';
import { selectPromptEvent, selectShowInstallPrompt } from '../../utils/service/swSlice';

type Props = {
}

const Welcome = (props: Props) => {

    const handleStart = async () => {
        const isValid = await checkLicense();
        console.log(isValid);
        if (isValid) {
            console.log('valid');
            setTimeout(() => {
                window.location.href = SIGNUP;
            }, 2000);
        } else {
            window.location.href = LISENSE;
        }
    }

    const showInstall = useAppSelector(selectShowInstallPrompt)
    const installPrompt = useAppSelector(selectPromptEvent)

    function handleInstall() {
        if (installPrompt) {
            installPrompt.prompt()
            installPrompt.userChoice.then((choiceResult: any) => {
                if (choiceResult.outcome === 'accepted') {
                    console.log('User accepted the A2HS prompt');
                } else {
                    console.log('User dismissed the A2HS prompt');
                }
            })
        }
    }


    return (
        <div className='random-image flex'>
            <div style={{
                backgroundColor: '#fbece6',
                padding: 'clamp(.3rem, 1rem, 3rem)',
                margin: 'clamp(.2rem, 1rem, 3rem)',
                borderRadius: 10,
                width: 'clamp(300px, 50%, 100%)',
                boxShadow: '0px 0px 0.5rem 0px rgba(0,0,0,0.75)',
                textAlign: 'center',
                overflow: 'hidden',
            }}>
                <div style={{
                    zIndex: 1,
                    position: 'relative',
                }}>
                    <Typography variant="h6">Welcome to</Typography>
                    <Typography variant="h4" color='primary'>Billin' Inc</Typography>
                    <Typography variant="h6">A simple and easy to use billing software</Typography>
                    {
                        showInstall && <Button variant="text" color="primary" onClick={() => {
                        handleInstall();
                    }}>Install Now
                    </Button>
                    }
                </div>
                {/* <img src={'/assets/billicon.jpg'} style={{
                width: 'clamp(100px, 20%, 200px)',
            }}  alt="error" /> */}
                {/* <Box sx={{
                height: {
                    xs : '300px',
                    md : '500px',
                    lg : '700px',
                },
                marginTop : {
                    xs : '-6rem',
                    md : '-8rem',
                    lg : '-12rem',
                },
                marginBottom : '1rem',
                }}> */}
                <Lottie style={{
                    width: 'clamp(300px, 700px, 100%)',
                    marginTop: 'clamp(-25%, -12rem, -12rem)',
                    display: 'block',
                    marginLeft: 'auto',
                    marginRight: 'auto',
                }}
                    animationData={animationDate} loop />
                {/* </Box> */}
                <Typography variant="body1">
                    <Button variant="contained" color="primary" onClick={() => {
                        handleStart();
                    }}>Get Started
                    </Button>
                    <Button disableRipple color='inherit'>Thank you for choosing the Billin'Inc for your business! Our app is designed to help you create and manage invoices, track inventory, and run reports, all in one place.</Button>
                </Typography>


            </div>

        </div>
    )
}

export default Welcome