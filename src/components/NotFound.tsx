import React from 'react'
import '../styles/NotFound.css'
import { Button, Typography } from '@mui/material'

type Props = {}

const NotFound = (props: Props) => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      height: '70vh'
  }}>
      
      <img src={'/assets/404.png'} width={400}  alt="error" />
      <Typography variant="h4" >
          The page you are looking for is not available.
      </Typography>
      <br/>

      <Button variant="contained" color="primary" onClick={() => {
          window.location.href = '/';
      }}>
          Go Back to Dashboard
      </Button>
      
  </div>

  )
}

export default NotFound