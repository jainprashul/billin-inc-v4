import React, { useMemo } from 'react'
import { ArrowBack, Delete, Edit as EditIcon } from '@mui/icons-material';
import { useDataUtils } from '../../utils/useDataUtils';
import { useLiveQuery } from 'dexie-react-hooks';
import { Box, Button, FormControl, Grid, IconButton, MenuItem, Select, TextField, Tooltip } from '@mui/material';
import { BANK_ACCOUNT } from '../../constants/routes';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import AlertDialog from '../../components/shared/AlertDialog';
import TransactionTable from './TransactionTable';
import { ITransaction } from '../../services/database/model/Transactions';

type Props = {
}
const types = ['deposit', 'withdrawal', 'transfer'];

const BankDetails = (prop: Props) => {
  const { navigate, params, companyDB, toast } = useDataUtils();
  const accountID = params.id as string;

  const account = useLiveQuery(async () => {
    const acc = await companyDB?.bankAccounts.get(accountID);
    return acc;
  }, [companyDB, accountID])!;

  const transactions = useMemo(()=> {
    return account?.getTransactions().sort((a, b)=> {
      return b.date.getTime() - a.date.getTime();
    }) || []
  }, [account]);


  const [openDelete, setOpenDelete] = React.useState(false);

  function onDelete() {
    account?.delete().then(() => {
      toast.enqueueSnackbar(`Bank Account ${account?.accountHolder} Deleted`, { variant: 'success' });
      navigate(BANK_ACCOUNT, { replace: true })
    }).catch((err) => {
      toast.enqueueSnackbar(`Error Deleting Bank Account ${account?.accountHolder}`, { variant: 'error' });
      console.log(err);
    })
  }

  const [amount, setAmount] = React.useState(0);
  const [type, setType] = React.useState('deposit');

  function handleSubmit (e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    onAddTransaction();
  }

  function onAddTransaction() {
    if (amount <= 0) {
      toast.enqueueSnackbar(`Invalid Amount`, { variant: 'error' });
      return;
    }

    const transaction : ITransaction = {
      amount : amount,
      type : type,
      date : new Date(),
      bankAccountID : account?.id,
    };
    account?.addTransaction(transaction).then(()=>{
      toast.enqueueSnackbar(`Transaction Added`, { variant: 'success' });
      // setTransactions((prev)=>[transaction, ...prev]);
    }).catch((err)=>{
      toast.enqueueSnackbar(`Error Adding Transaction`, { variant: 'error' });
      console.error(err);
    })
    setAmount(0);
    setType('deposit');
  }


  return (
    <div>
      <Grid container spacing={2} justifyContent='space-between'>
        <Grid item md={3}>
          <Card style={{
            height: '100%',
          }} >
            <CardContent>
              <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                <IconButton onClick={() => {
                  navigate(-1);
                }} size='small'><ArrowBack /></IconButton> Bank Details
              </Typography>
              <Typography variant="h5" component="div">
                {account?.accountHolder}
              </Typography>
              <Typography variant="subtitle2" style={{
                whiteSpace: 'pre'
              }}>
                <Grid container >
                  <Grid item xs={6}> Bank Name :</Grid> <Grid item xs={6}>{account?.bankName}</Grid>
                  <Grid item xs={6}> Account Number :</Grid> <Grid item xs={6}>{account?.accountNo}</Grid>
                  <Grid item xs={6}> IFSC Code :</Grid> <Grid item xs={6}>{account?.ifsc}</Grid>
                  <Grid item xs={6}> Branch :</Grid> <Grid item xs={6}>{account?.branch}</Grid>
                  <Grid item xs={6}> Account Type :</Grid> <Grid item xs={6}>{account?.accountType}</Grid>
                </Grid>
              </Typography>

            </CardContent>
            <CardActions>
              {/* <Button size="small">Learn More</Button>  */}
              <Tooltip title="Edit">
                <IconButton color='primary' onClick={() => {
                  navigate(`${BANK_ACCOUNT}/${account?.id}/edit`, {
                    state: account
                  });
                }}>
                  <EditIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Delete">
                <IconButton color='primary' onClick={() => {
                  setOpenDelete(true);
                }} >
                  <Delete />
                </IconButton>
              </Tooltip>
            </CardActions>

            <Box component={'form'} p={2} onSubmit={handleSubmit}>
              <Typography variant="h6">Add Transaction</Typography>
              <TextField fullWidth label="Amount" type='number' inputProps={{
                min: 0
              }} variant='standard' value={amount} onChange={(e) => {
                setAmount(parseFloat(e.target.value));
              }} />
              <FormControl fullWidth variant='standard' style={{
                marginTop: '1rem'
              }}>

                {/* <InputLabel id="type-label">Type</InputLabel> */}
                <Select
                  labelId="type-label"
                  id="type"
                  value={type}
                  variant='standard'
                  margin='dense'
                  onChange={(e) => {
                    setType(e.target.value);
                  }
                  }
                  label="Type"
                >
                  {types.map((type) => (
                    <MenuItem key={type} value={type}>
                      <span style={{
                        textTransform: 'capitalize'
                      }}>{type}</span>
                    </MenuItem>
                  ))}

                </Select>
              </FormControl>
              <Button fullWidth variant='contained' color='primary' type='submit' style={{
                marginTop: '1rem'
              }}>Add</Button>
            </Box>
          </Card>

          <AlertDialog
            open={openDelete}
            setOpen={setOpenDelete}
            message={`Are you sure you want to delete ${account?.bankName} - ${account?.accountHolder}?`}
            title={`Delete ${account?.bankName} - ${account?.accountHolder}`}
            onConfirm={() => {
              onDelete();
            }} />
        </Grid>

        <Grid item md={9}>
          <TransactionTable data={transactions} />
        </Grid>
      </Grid>
    </div>
  )
}

export default BankDetails