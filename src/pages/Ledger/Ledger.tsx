import { AccountBalance, Folder, NorthEast, SouthWest, TrendingDown, TrendingUp } from '@mui/icons-material'
import { Avatar, Box, Button, Card, CardContent, Divider, Typography } from '@mui/material'
import { green, red, amber } from '@mui/material/colors';
import React from 'react'
import Search from '../../components/shared/Search';
import ClientList from './ClientList';

type Props = {}

const Ledger = (props: Props) => {
    const [open, setOpen] = React.useState(false);
    const [query, setQuery] = React.useState('');

  const DetailCards = () => (
    <Card sx={{ minWidth: 800, minHeight: 100 }}>
      <CardContent >
        <Box display="flex" alignItems="center" justifyContent={'space-around'}>
          <Box display="flex" alignItems="center" justifyContent='space-around' minWidth={200}>
            <Avatar sx={{
              bgcolor: red[500],
            }} > <NorthEast /> </Avatar>
            <div>
              <Typography variant="h6"> Debit</Typography>
              <Typography variant="h5"> ₹ 10000</Typography>
            </div>
          </Box>
          <Divider orientation="vertical" flexItem />
          <Box display="flex" alignItems="center" justifyContent='space-around' minWidth={200}>
            <Avatar sx={{
              bgcolor: green[500],
            }}> <SouthWest /> </Avatar>
            <div>
              <Typography variant="h6"> Credit</Typography>
              <Typography variant="h5"> ₹ 10000</Typography>
            </div>
          </Box>
          <Divider orientation="vertical" flexItem />
          <Box display="flex" alignItems="center" justifyContent='space-around' minWidth={200}>
            <Avatar sx={{
              bgcolor: amber[500],
            }}> <AccountBalance /> </Avatar>
            <div>
              <Typography variant="h6"> Balance</Typography>
              <Typography variant="h5"> ₹ 10000</Typography>
            </div>
          </Box>
          <Divider orientation="vertical" flexItem />
          <Box display="flex" alignItems="center" justifyContent='space-around' minWidth={200}>
            <Avatar sx={{
              bgcolor: green[500],
            }}> <SouthWest /> </Avatar>
            <div>
              <Typography variant="h6"> Receivable</Typography>
              <Typography variant="h5"> ₹ 10000</Typography>
            </div>
          </Box>
          <Divider orientation="vertical" flexItem />
          <Box display="flex" alignItems="center" justifyContent='space-around' minWidth={200}>
            <Avatar sx={{
              bgcolor: red[500],
            }}> <NorthEast /> </Avatar>
            <div>
              <Typography variant="h6"> Payable</Typography>
              <Typography variant="h5"> ₹ 10000</Typography>
            </div>
          </Box>
        </Box>
      </CardContent>
    </Card>
  )

  return (
    <div>
      <DetailCards />
      <Search onSearch={(q)=>{
        setQuery(q)
        setTimeout(() => {
          setOpen(true)
        }, 100);
      }} />
      
      <ClientList q={query} open={open} setOpen={setOpen} />

    </div>
  )
}

export default Ledger