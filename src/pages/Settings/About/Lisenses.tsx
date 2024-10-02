import { Button, Typography } from '@mui/material';
import moment from 'moment';
import React from 'react'
import { LISENSE } from '@/constants/routes';
import authService from '@/services/authentication/auth.service';
import { getConfig } from '@/services/database/db'
import { Config } from '@/services/database/model';
import Lottie from 'lottie-react';
import animationFile from "@/assets/about.json";

type Props = {}

const Lisenses = (props: Props) => {
  const [confg, setConfig] = React.useState<Config | null>(null);

  React.useEffect(() => {
    getConfig().then((config) => {
      setConfig(config);
    });
  }, []);

  const handleLisenseRenew = () => {
    authService.logout(LISENSE)
  }


  return (
    <div id='lisenses-page'>
      <div style={{
        width: 600,
        float: 'right',
      }}>
        <Lottie
          animationData={animationFile}
          loop={true}
          autoPlay={true}
          style={{ width: '100%', height: '100%' }}
        />
      </div>

      <Typography variant='h6'>Lisenses Details</Typography>
      <Typography variant='body1'>This software is licensed under the {confg?.lisenseType} license.</Typography>

      <Typography variant='caption'>Serial Number : </Typography>
      <Typography component={'span'} variant='caption'>{confg?.serialKey}</Typography>

      <br />
      <Typography variant='caption'>Lisense Key : </Typography>
      <Typography component={'span'} variant='caption'>{confg?.lisenseKey}</Typography>

      <br />
      <Typography variant='caption'>Lisense Registration Date : </Typography>
      <Typography component={'span'} variant='caption'>{moment(confg?.lisenseValidationDate).format('ll')}</Typography>

      <br />
      <Typography variant='caption'>Lisense Expiry : </Typography>
      <Typography component={'span'} variant='caption'>{moment(confg?.lisenseValidTill).format('ll')}</Typography>

      <br />
      <Typography variant='caption'>Lisense Owner : </Typography>
      <Typography component={'span'} variant='caption'>{confg?.lisenseeName}</Typography>

      <br />
      <Typography variant='caption'>Lisense Version : </Typography>
      <Typography component={'span'} variant='caption'>{confg?.lisenseVersion}</Typography>

      <br />

      <Typography variant='caption'>Lisense Type : </Typography>
      <Typography component={'span'} variant='caption'>{confg?.lisenseType}</Typography>

      <br />
      <br />

      <Button variant='contained' color='primary' onClick={handleLisenseRenew}>
        {confg?.lisenseType === 'trial' ? 'Buy Lisense' : 'Renew Lisense'}
      </Button>





    </div>
  )
}

export default Lisenses