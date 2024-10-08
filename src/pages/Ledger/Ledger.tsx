import { AccountBalance, NorthEast, SearchTwoTone, SouthWest, TrendingDownOutlined, TrendingUpOutlined } from '@mui/icons-material'
import { Avatar, Box, Button, Card, CardContent, Divider, Fab, Grid, Tooltip, Typography } from '@mui/material'
import { green, red, amber } from '@mui/material/colors';
import React, { useEffect } from 'react'
import ClientList from './Client/ClientList';
import DailyLedgerTable from './DailyTable';
import TextField from '@mui/material/TextField';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useLiveQuery } from 'dexie-react-hooks';
import { useDataUtils } from '../../utils/useDataUtils';
import { Ledger } from '../../services/database/model';
import { filterDataByDate } from '../../utils';
import moment from 'moment';
import AddIcon from '@mui/icons-material/Add';
import ClientCreate from './Client/Create';
import DateProvider from '../../components/shared/DateProvider';

type Total = {
  debit: number,
  credit: number
  balance: number,
  receivable: number,
  payable: number
}

const Ledgers = () => {
  const [open, setOpen] = React.useState(false);
  const [openClient, setOpenClient] = React.useState(false);
  const [date, setDate] = React.useState<Date>(new Date());
  const { companyDB } = useDataUtils();

  // TODO : Add Date Range Filter Setting in Settings

  const queries = useLiveQuery(async () => {
    const ledger = await companyDB?.ledger.orderBy('date').reverse().toArray() as Ledger[];

    return {
      ledger: filterDataByDate(ledger || [], moment(date).subtract('day', 1).toDate(), moment(date).toDate()),
      ledgerALL: ledger || [],
    }
  }, [companyDB, date], {
    ledger: [],
  }) as { ledger: Ledger[], ledgerALL: Ledger[] };


  const [total, setTotal] = React.useState<Total>({
    debit: 0,
    credit: 0,
    balance: 0,
    receivable: 0,
    payable: 0,
  });

  useEffect(() => {
    if (queries.ledgerALL) {
      const { credit, debit, balance, receivable, payable } = [...queries.ledgerALL].reduce(
        (acc, cur) => {
          acc.credit += cur.credit;
          acc.debit += cur.debit;
          acc.balance += (cur.debit - cur.credit);
          acc.receivable += cur.receivable;
          acc.payable += cur.payable;
          return acc;
        }
        , { credit: 0, debit: 0, balance: 0, receivable: 0, payable: 0 }
      );
      setTotal({
        credit,
        debit,
        balance,
        receivable,
        payable
      });
    }
  }, [queries.ledgerALL]);

  const [currentTotal, setCurrentTotal] = React.useState<Total>({
    debit: 0,
    credit: 0,
    balance: 0,
    receivable: 0,
    payable: 0,
  });

  useEffect(() => {
    if (queries.ledger) {
      const { credit, debit, balance, receivable, payable } = [...queries.ledger].reduce(
        (acc, cur) => {
          acc.credit += cur.credit;
          acc.debit += cur.debit;
          acc.balance += (cur.debit - cur.credit);
          acc.receivable += cur.receivable;
          acc.payable += cur.payable;
          return acc;
        }
        , { credit: 0, debit: 0, balance: 0, receivable: 0, payable: 0 }
      );
      setCurrentTotal({
        credit,
        debit,
        balance,
        receivable,
        payable
      });
    }
  }, [queries.ledger]);


  // Will add keyboard shortcuts with useKeyboardShortcuts

  // function onKeyPress(e: KeyboardEvent) {
  //   e.preventDefault();
  //   if (e.ctrlKey && e.key === 'k') {
  //     setOpen(true);
  //   }
  // }

  // useEffect(() => {
  //   document.addEventListener('keydown', onKeyPress);
  //   return () => {
  //     document.removeEventListener('keydown', onKeyPress);
  //   }
  // }, [])

  const DetailCards = ({ total, orientation = 'row' }: {
    total: Total,
    orientation?: 'row' | 'column'
  }) => (
    <Card sx={orientation === 'row' ? { minWidth: 800, minHeight: 100 } : {}}>
      <CardContent >
        <Box display="flex" flexDirection={orientation} alignItems="center" justifyContent={'space-around'}>
          <Box display="flex" alignItems="center" justifyContent={orientation === 'row' ? 'space-evenly' : ''} minWidth={200}>
            <Avatar sx={{
              mx: orientation === 'row' ? 0 : 3,
              bgcolor: red[500],
            }} > <NorthEast /> </Avatar>
            <div>
              <Typography variant="h6"> Debit</Typography>
              <Typography variant="h5"> ₹ {total.debit}</Typography>
            </div>
          </Box>
          <Divider orientation="vertical" flexItem />
          <Box display="flex" alignItems="center" justifyContent={orientation === 'row' ? 'space-evenly' : ''} minWidth={200}>
            <Avatar sx={{
              mx: orientation === 'row' ? 0 : 3,
              bgcolor: green[500],
            }}> <SouthWest /> </Avatar>
            <div>
              <Typography variant="h6"> Credit</Typography>
              <Typography variant="h5"> ₹ {total.credit}</Typography>
            </div>
          </Box>
          <Divider orientation="vertical" flexItem />
          <Box display="flex" alignItems="center" justifyContent={orientation === 'row' ? 'space-evenly' : ''} minWidth={200}>
            <Avatar sx={{
              mx: orientation === 'row' ? 0 : 3,
              bgcolor: amber[500],
            }}> <AccountBalance /> </Avatar>
            <div>
              <Typography variant="h6"> Balance</Typography>
              <Typography variant="h5"> ₹ {total.balance}</Typography>
            </div>
          </Box>
          <Divider orientation="vertical" flexItem />
          <Box display="flex" alignItems="center" justifyContent={orientation === 'row' ? 'space-evenly' : ''} minWidth={200}>
            <Avatar sx={{
              mx: orientation === 'row' ? 0 : 3,
              bgcolor: green[500],
            }}> <TrendingDownOutlined /> </Avatar>
            <div>
              <Typography variant="h6"> Receivable</Typography>
              <Typography variant="h5"> ₹ {total.receivable}</Typography>
            </div>
          </Box>
          <Divider orientation="vertical" flexItem />
          <Box display="flex" alignItems="center" justifyContent={orientation === 'row' ? 'space-evenly' : ''} minWidth={200}>
            <Avatar sx={{
              mx: orientation === 'row' ? 0 : 3,
              bgcolor: red[500],
            }}> <TrendingUpOutlined /> </Avatar>
            <div>
              <Typography variant="h6"> Payable</Typography>
              <Typography variant="h5"> ₹ {total.payable}</Typography>
            </div>
          </Box>
        </Box>
      </CardContent>
    </Card>
  )

  return (
    <div>
      <DetailCards total={total} />

      <Box display="flex" justifyContent='space-between' py={1}>
        <Typography variant="h6"> Ledger - &nbsp;
        <DateProvider>
            <DatePicker sx={{
              ['& .MuiInputBase-root']: { height: 36, width: 200, },
            }}
              value={moment(date)}
              onChange={(newValue) => {
                setDate(moment(newValue).toDate())
              }}           
            >
            </DatePicker>
            </DateProvider>
        </Typography>

        <Tooltip title="Press Ctrl + K to search">

          <Button variant="text" color="primary" startIcon={<SearchTwoTone />} onClick={() => setOpen(true)}>
            Search Ledger
            {/* <Chip size='small' variant='outlined' label={
            <Typography variant="caption" color='text.secondary'> Ctrl + K </Typography>
          } /> */}
          </Button>
        </Tooltip>

      </Box>

      <Grid container spacing={1}>
        <Grid item xs={3}>
          <DetailCards total={currentTotal} orientation='column' />

        </Grid>
        <Grid item xs={9}>
          <DailyLedgerTable data={queries.ledger} />
        </Grid>
      </Grid>

      <Fab size="medium" color="primary" style={{
        position: 'fixed',
        bottom: '1rem',
        right: '1rem',
      }}  aria-label="add" onClick={()=> {
        setOpenClient(true);
      }}>
        <AddIcon />
      </Fab>
      <ClientList open={open} setOpen={setOpen} />
      <ClientCreate open={openClient} setOpen={setOpenClient} />
    </div>
  )
}

export default Ledgers