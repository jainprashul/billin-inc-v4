import { AddBox, CheckCircle, Delete } from '@mui/icons-material';
import Add from '@mui/icons-material/Add';
import { Button, Card, CardActions, CardContent, Grid, IconButton, Typography } from '@mui/material';
import { useLiveQuery } from 'dexie-react-hooks';
import React, { useState } from 'react'
import AlertDialog from '../../components/shared/AlertDialog';
import db from '../../services/database/db';
import { useDataUtils } from '../../utils/useDataUtils';

type Props = {}

const Company = (props: Props) => {
  const { navigate, toast, companyID, setCompanyID } = useDataUtils();
  const [open, setOpen] = useState(false)

  const [dialog, setDialog] = React.useState({
    title: '',
    message: '',
    onCancel: () => { },
    onConfirm: () => { },
  });


  const company = useLiveQuery(async () => {
    return db.companies.toArray();
  });

  return (
    <div id="company-page">
      <Grid container spacing={3}>
        {company?.map(company => {
          return (
            <Grid item xs={4} key={company.id}>
              <Card key={company.id}>
                <CardContent style={{
                  minHeight: '16rem',
                }}>
                  <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                    Company
                  </Typography>
                  <Typography variant="h5" component="div">
                    {company.name}
                  </Typography>
                  <Typography sx={{ mb: 1.5 }} color="text.secondary">
                    {company.contacts[0]?.name}
                    {company.contacts[0]?.phone}
                  </Typography>
                  <Typography variant="body2">
                    {company.address.address}
                    <br />
                    {company.address.city}
                    <br />
                    {company.address.state}
                    <br />
                    {company.gst && <>GST: {company.gst}</>}
                  </Typography>
                </CardContent>

                <CardActions>
                  <Button size="small" onClick={() => {
                    navigate(`/company/${company.id}/edit`, {
                      state: company
                    });
                  }}>Update</Button>
                  <Button size="small" color="primary"> View </Button>
                  <IconButton size="small" color="primary" onClick={() => {
                    setOpen(true);
                    setDialog({
                      title: 'Delete Company',
                      message: `Are you sure you want to delete ${company.name} ?`,
                      onConfirm: () => {
                        company.delete().then(() => {
                          toast.enqueueSnackbar(`Company : ${company.name} deleted.`, {
                            variant: 'error',
                          });
                        })
                      },
                      onCancel: () => { }
                    });
                  }}>
                    <Delete />
                  </IconButton>
                  <IconButton onClick={()=> {
                    setCompanyID(company.id as number)
                  }}>
                    <CheckCircle color={ company.id  === companyID ? 'success' : 'inherit' }/>
                  </IconButton>
                  
                </CardActions>

              </Card>
            </Grid>
          )
        }
        )}
        <Grid item xs={4}>
          <Card>
            <CardContent sx={{
              minHeight: '19rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
              <Button variant="outlined" color="primary" style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '1rem '
              }} onClick={() => {
                navigate('/company/create');
              }}>
                <AddBox color='primary' fontSize='large' />
                <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                  Add Company
                </Typography>
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <AlertDialog message={dialog.message} open={open} setOpen={setOpen} title={dialog.title} onConfirm={dialog.onConfirm} onCancel={dialog.onCancel} />
    </div>
  )
}

export default Company