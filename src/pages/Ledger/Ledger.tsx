import { AccountBalance, Folder, NorthEast, SearchTwoTone, SouthWest, TrendingDown, TrendingUp } from '@mui/icons-material'
import { Avatar, Box, Button, Card, CardContent, Chip, Divider, IconButton, Typography } from '@mui/material'
import { green, red, amber } from '@mui/material/colors';
import React, { useEffect } from 'react'
import Search from '../../components/shared/Search';
import ClientList from './Client/ClientList';

type Props = {}

const Ledger = (props: Props) => {
  const [open, setOpen] = React.useState(false);
  // const [query, setQuery] = React.useState('');

  function onKeyPress(e: KeyboardEvent) {
    e.preventDefault();
    if (e.ctrlKey && e.key === 'k') {
      setOpen(true);
    }
  }

  useEffect(() => {
    document.addEventListener('keydown', onKeyPress);
    return () => {
      document.removeEventListener('keydown', onKeyPress);
    }
  }, [])

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

      <Box display="flex" justifyContent='end' py={1}>
          <Button variant="text" color="primary" startIcon={<SearchTwoTone />} onClick={() => setOpen(true)}>
            Search Ledger
            <Chip size='small' variant='outlined' label={
              <Typography variant="caption" color='text.secondary'> Ctrl + K </Typography>
            } />
          </Button>
      </Box>
      <ClientList open={open} setOpen={setOpen} />

    </div>
  )
}

export default Ledger