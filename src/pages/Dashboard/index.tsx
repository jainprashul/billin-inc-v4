import { Card, CardContent, Grid, Typography } from '@mui/material'
import { DataTesting } from '../../components'
import Notifications from './Notifications'

type Props = {}

const Dashboard = (props: Props) => {
  return (
    <div>
      {/* <Typography variant="h4">Dashboard</Typography> */}

      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Card className='minHeight-300'>
            <CardContent>
              <Typography variant="h5">Expenses</Typography>
              </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
              <Notifications />
        </Grid>
        </Grid>

      
        <DataTesting />
    </div>
  )
}

export default Dashboard