import { Button, Typography } from '@mui/material'
import React from 'react'
import { checkLicense } from '../../services/lisensing'

type Props = {}

const Welcome = (props: Props) => {

    const handleStart = async () => {
        // const isValid = await checkLicense();
        if (true) {
            window.location.href = '/signup';
        } else {
            window.location.href = '/license';
        }
    }

  return (
    <div className='random-image flex'>
        <div style={{
            backgroundColor: 'white',
            padding: 'clamp(.3rem, 1rem, 3rem)',
            margin: 'clamp(.2rem, 1rem, 3rem)',
            borderRadius: 10,
            width: 'clamp(300px, 50%, 100%)',
            boxShadow: '0px 0px 0.5rem 0px rgba(0,0,0,0.75)',
            textAlign: 'center',
        }}>
            <Typography variant="h6">Welcome to</Typography>
            <Typography variant="h4" color='primary'>Billin' Inc</Typography>
            <Typography variant="h6">A simple and easy to use billing software</Typography>
            <img src={'/assets/billicon.jpg'} style={{
                width: 'clamp(100px, 20%, 200px)',
            }}  alt="error" />
            <Typography variant="body1">
            <Button variant="contained" color="primary" onClick={() => {
                handleStart();
            }}>Get Started
            </Button>
            <p>Thank you for choosing the Billin'Inc for your business! Our app is designed to help you create and manage invoices, track inventory, and run reports, all in one place.</p>
            </Typography>


        </div>
        
    </div>
  )
}

export default Welcome