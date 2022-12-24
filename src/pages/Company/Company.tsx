import { AddBox } from '@mui/icons-material';
import { Button, Card, CardContent, Grid, Typography } from '@mui/material';
import { useLiveQuery } from 'dexie-react-hooks';
import React, { useState } from 'react'
import AlertDialog from '../../components/shared/AlertDialog';
import db from '../../services/database/db';
import { Company as ICompany } from '../../services/database/model';
import { useDataUtils } from '../../utils/useDataUtils';
import CompanyCard from './CompanyCard';

type Props = {}

const Company = (props: Props) => {
  const { navigate, toast, companyID, setCompanyID } = useDataUtils();
  const [open, setOpen] = useState(false)

  const [dialog, setDialog] = React.useState({
    title: '',
    message: <></>,
    onCancel: () => { },
    onConfirm: () => { },
    confirmText: 'OK',
  });


  const company = useLiveQuery(async () => {
    return db.companies.toArray();
  });

  const handleDelete = (company: ICompany) => {
    setOpen(true);
    setDialog({
      title: 'Delete Company',
      message: <>
        <Typography variant="body1" color="black">
          Are you sure you want to delete {company.name} ?
        </Typography>
        <br />
        <Typography variant="caption" component="div">
          This action is irreversible and the company data will be deleted.
        </Typography>
      </>,
      onConfirm: () => {
        company.delete().then(() => {
          toast.enqueueSnackbar(`Company : ${company.name} deleted.`, {
            variant: 'error',
          });
        })
      },
      confirmText: 'Delete',
      onCancel: () => { }
    });
  }

  const handleSwitch = (company: ICompany) => {
    if (company.id === companyID) return;
    setOpen(true);
    setDialog({
      title: 'Switch Current Company',
      message: <>
        <Typography variant="body1" color="black">
          Do you want to switch the current company to <b> {company.name} </b> ?
        </Typography>
      </>,
      onConfirm: () => {
        setCompanyID(company.id!)
      },
      confirmText: 'Switch',
      onCancel: () => { }
    });
  }



  return (
    <div id="company-page">
      <Grid container spacing={3}>
        {company?.map(company => {
          return (
            <CompanyCard key={company.id} company={company} handleDelete={handleDelete} handleSwitch={handleSwitch} />
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

      <AlertDialog message={dialog.message} open={open} setOpen={setOpen} confirmColor={dialog.confirmText === "Delete" ? 'error' : 'primary'} confirmText={dialog.confirmText} title={dialog.title} onConfirm={dialog.onConfirm} onCancel={dialog.onCancel} />
    </div>
  )
}

export default Company