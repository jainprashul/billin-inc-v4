import { AddBox, CheckCircle, Delete } from '@mui/icons-material';
import { Button, Card, CardActions, CardContent, Grid, IconButton, Typography } from '@mui/material';
import { useAppSelector } from '../../app/hooks';
import { Company } from '../../services/database/model';
import { useDataUtils } from '../../utils/useDataUtils';
import { selectIsAdmin } from '../../utils/utilsSlice';
type Props = {
  company: Company;
  companyID: number;
  handleDelete: (company: Company) => void;
  handleSwitch: (company: Company) => void;
}

const CompanyCard = ({ company, companyID, handleDelete, handleSwitch }: Props) => {
  const { navigate } = useDataUtils()
  const isAdmin = useAppSelector(selectIsAdmin)
  return (
    <Grid item xs={12} sm={6} md={4} key={company.id}>
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
            {company.contacts[0]?.name} &nbsp;
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
          {isAdmin && <>
            <Button size="small" onClick={() => {
              navigate(`/company/${company.id}/edit`, {
                state: company
              });
            }}>Update</Button>
            <IconButton size="small" color="primary" onClick={() => { handleDelete(company) }}>
              <Delete />
            </IconButton></>}
          <IconButton onClick={() => { handleSwitch(company) }}>
            <CheckCircle color={company.id! === companyID ? 'success' : 'inherit'} />
          </IconButton>
        </CardActions>

      </Card>
    </Grid>
  )
}

export const CompanyCardAdd = () => {
  const { navigate } = useDataUtils()
  const isAdmin = useAppSelector(selectIsAdmin)

  if (!isAdmin) {
    return null;
  }

  return (
    <Grid item xs={12} sm={6} md={4}>
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
  )

}

export default CompanyCard