import { CheckCircle, Delete } from '@mui/icons-material';
import { Button, Card, CardActions, CardContent, Grid, IconButton, Typography } from '@mui/material';
import { Company } from '../../services/database/model';
import { useDataUtils } from '../../utils/useDataUtils';
type Props = {
    company: Company;
    handleDelete: (company: Company) => void;
    handleSwitch: (company: Company) => void;
}

const CompanyCard = ({company, handleDelete, handleSwitch}: Props) => {
    const { navigate, companyID } = useDataUtils()
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
                  <Button size="small" onClick={() => {
                    navigate(`/company/${company.id}/edit`, {
                      state: company
                    });
                  }}>Update</Button>
                  {/* <Button size="small" color="primary"> View </Button> */}
                  <IconButton size="small" color="primary" onClick={() => { handleDelete(company) }}>
                    <Delete />
                  </IconButton>
                  <IconButton onClick={() => { handleSwitch(company) }}>
                    <CheckCircle color={company.id === companyID ? 'success' : 'inherit'} />
                  </IconButton>

                </CardActions>

              </Card>
            </Grid>
  )
}

export default CompanyCard