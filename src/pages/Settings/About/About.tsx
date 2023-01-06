import { Typography } from '@mui/material'
import React from 'react'
import Lisenses from './Lisenses'

type Props = {}

const About = (props: Props) => {
  return (
    <div style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between'
    }}>
        {/* <Typography variant='h4'>About</Typography> */}
        <Lisenses/>

        <div>
        <Typography variant='body1'>About Us</Typography>
        <Typography variant='caption'>This software is developed by <a href='https://www.linkedin.com/in/jainprashul/' target='_blank' rel="noreferrer">Prashul Jain</a></Typography>
        <br />
        <br />
        <Typography variant='body1'>Contact Us</Typography>
        <Typography variant='caption'>Email : <a href='mailto:jainprashul@gmail.com'>jainprashul@gmail.com</a> </Typography> 
        </div>
    </div>
  )
}

export default About