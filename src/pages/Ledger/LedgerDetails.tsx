import { AccountBalance, ArrowBack, Delete, Edit as EditIcon, Info, NorthEast, People, Print, SouthWest, Storefront } from '@mui/icons-material';
import { useDataUtils } from '../../utils/useDataUtils';
import { useLiveQuery } from 'dexie-react-hooks';
import { Avatar, Box, Button, Divider, FormControl, Grid, IconButton, MenuItem, Select, TextField, Tooltip } from '@mui/material';
import { LEDGER } from '../../constants/routes';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import React, { useEffect } from 'react';
import AlertDialog from '../../components/shared/AlertDialog';
import { Client, Ledger } from '../../services/database/model';
import LedgerTable from './LedgerTable';
import ClientEdit from './Client/Edit';
import { green, red, amber } from '@mui/material/colors';
import ledgerPattern from '../../components/PDF/LedgerPattern';



type Props = {}

const LedgerDetails = (props: Props) => {
    const [open, setOpen] = React.useState(false);
    const [openDelete, setOpenDelete] = React.useState(false);
    const { params, companyDB, company, toast, navigate } = useDataUtils();
    const clientID = params.id as string;

    const queries = useLiveQuery(async () => {
        const ledger = await companyDB?.ledger.where('clientID').equals(clientID).toArray() as Ledger[];
        const client = await companyDB?.clients.where('id').equals(clientID).first() as Client;
        // await stk?.loadStockLogs();
        // stk?.stockLogs.map(async (log) => { await log.loadClient(); return log; });
        return {
            ledger, client
        }
    }, [companyDB, clientID])

    const { ledger, client } = queries ? queries : { ledger: [], client: null };

    const [total, setTotal] = React.useState({
        debit: 0,
        credit: 0,
        balance: 0,
        // receivable: 0
    });

    useEffect(() => {
        if (ledger) {
            const { credit, debit, balance } = [...ledger].reduce(
                (acc, cur) => {
                    acc.credit += cur.credit;
                    acc.debit += cur.debit;
                    acc.balance += (cur.debit - cur.credit);
                    return acc;
                }
                , { credit: 0, debit: 0, balance: 0 }
            );
            setTotal({
                credit,
                debit,
                balance,
                // receivable: client.receivable
            });
        }
    }, [ledger]);


    const onDelete = () => {
        // ledger?.forEach((led)=> {
        //   led.delete().then(() => {
        //     toast.enqueueSnackbar(`Ledger for ${client?.name}  Deleted`, { variant: 'success' });
        //     navigate(LEDGER, { replace: true })
        // }).catch((err) => {
        //     console.log(err);
        //     toast.enqueueSnackbar(`Error Deleting Ledger for ${client?.name}`, { variant: 'error' });
        // })
        // })
        client?.delete().then(() => {
            toast.enqueueSnackbar(`Client ${client?.name} Deleted`, { variant: 'success' });
            navigate(LEDGER, { replace: true })
        }).catch((err) => {
            console.log(err);
            toast.enqueueSnackbar(`Error Deleting Client ${client?.name}`, { variant: 'error' });
        });
    }

    const printLedger = (ledgers: Ledger[]) => {

        // add iframe to print
        const iframe = document.createElement('iframe');
        iframe.style.display = 'none';
        document.body.appendChild(iframe);

        const data = {
            company,
            date: new Date(),
            client,
            ledger: ledgers,
            total
        }

        iframe.contentDocument?.write(ledgerPattern(data));
        iframe.contentDocument?.close();
        iframe.contentWindow?.focus();
        iframe.contentWindow?.print();
    }

    const [amount, setAmount] = React.useState(0);
    const [type, setType] = React.useState('received');

    const updateAdjustment = () => {

        if (amount === 0) {
            toast.enqueueSnackbar(`Please enter an amount`, { variant: 'error' });
            return;
        }

        const data = new Ledger({
            companyID: client?.companyID as number,
            date: new Date(),
            voucherNo: '',
            voucherType: 'ADJUSTMENT',
            clientID: clientID as string,
            clientType: 'CUSTOMER',
            credit: type === 'received' ? amount : 0,
            debit: type === 'paid' ? amount : 0,
            payable: 0,
            payableType: 'CASH',
            receivable: 0,
            receivableType: 'CASH',
            cash: 0,
        })
        const bal = data.debit - data.credit;
        
        data.receivable = type === 'received' ? bal : type === 'paid' ? -bal : 0;
        data.payable = type === 'deposited' ? -bal : type === 'dues' ? bal : 0;

        data.save().then(() => {
            setAmount(0);
            setType('received');
            toast.enqueueSnackbar('Amount Adjustment added successfully', {
                variant: 'success',
            });
        }).catch(() => {
            toast.enqueueSnackbar('Amount Adjustment failed', {
                variant: 'error',
            });

        })
    }

    const clientType = client?.isCustomer ? 'CUSTOMER' : 'VENDOR';

    return (
        <>
            <Grid container spacing={2} justifyContent='space-between'>
                <Grid item md={4}>
                    <Card style={{
                        height: '100%',
                    }} >
                        <CardContent>
                            <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                                <IconButton onClick={() => {
                                    navigate(-1);
                                }} size='small'><ArrowBack /></IconButton> Ledger Details
                            </Typography>
                            <Typography variant="h5" component="div" >
                                <div style={{ display: 'flex', justifyContent: '' }}>
                                <div style={{
                                    marginTop: '3px',
                                    marginRight: '6px',
                                }}>
                                {client?.isCustomer ? <People /> : <Storefront /> }
                                </div>
                                 {client?.name}
                                 </div>
                            </Typography>
                            <Typography sx={{ mb: 1.5 }} color="text.secondary">
                                {client?.details}
                            </Typography>
                            <Typography variant="subtitle2" style={{
                                whiteSpace: 'pre'
                            }}>
                                <Grid container  >
                                    <Grid item xs={3} color='text.secondary' > GST :</Grid> <Grid item xs={9}>{client?.gst}</Grid>
                                    <Grid item xs={3} color='text.secondary'> Address :</Grid> <Grid item xs={9}>{client?.address.address} </Grid>
                                    <Grid item xs={3} color='text.secondary'> City :</Grid> <Grid item xs={9}>{client?.address.city} </Grid>
                                    <Grid item xs={3} color='text.secondary'> State :</Grid> <Grid item xs={9}>{client?.address.state} </Grid>
                                    <Grid item xs={3} color='text.secondary'> Phone :</Grid> <Grid item xs={9}>{client?.contacts[0].phone}</Grid>
                                    <Grid item xs={3} color='text.secondary'> Mobile :</Grid> <Grid item xs={9}>{client?.contacts[0].mobile}</Grid>
                                    <Grid item xs={3} color='text.secondary'> Email :</Grid> <Grid item xs={9}>{client?.contacts[0].email}</Grid>
                                    {client?.isCustomer && <Grid item xs={3} color='text.secondary'> Customer</Grid>}
                                </Grid>
                            </Typography>

                        </CardContent>
                        <CardActions>
                            {/* <Button size="small">Learn More</Button>  */}
                            <Tooltip title="Edit">
                                <IconButton color='primary' onClick={() => {
                                    setOpen(true);
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
                            <Tooltip title="Print Ledger">
                                <IconButton color='primary' onClick={() => {
                                    printLedger(ledger);
                                }} >
                                    <Print />
                                </IconButton>
                            </Tooltip>
                        </CardActions>

                        <br/>
                        <br/>

                        <Box p={2}  >
                            <Typography variant="h6"> Adjustments</Typography>
                            <Grid container spacing={1}>
                                <Grid item xs={6}>
                                    <TextField fullWidth label="Amount" type='number' variant='standard' value={amount} onChange={(e) => {
                                        setAmount(parseFloat(e.target.value));
                                    }} />
                                </Grid>
                                <Grid item xs={6}>
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
                                            <MenuItem value='received'>Received</MenuItem>
                                            <MenuItem value='paid'>Paid</MenuItem>
                                            {/* <MenuItem value='deposited'>Deposited</MenuItem>
                                            <MenuItem value='dues'>Dues</MenuItem> */}

                                        </Select>
                                    </FormControl>
                                </Grid>
                                {/* <br/> */}
                                <Grid item xs={12}>
                                    <Button variant="contained" color="primary" onClick={updateAdjustment}> Add </Button>
                                </Grid>
                            </Grid>
                        </Box>
                    </Card>
                </Grid>
                <Grid item md={8}>

                    <Card sx={{ minHeight: 100, mb: 1 }}>
                        <CardContent >
                            <Box display="flex" alignItems="center" justifyContent={'space-around'}>
                                <Box display="flex" alignItems="center" justifyContent='space-around' minWidth={200}>
                                    <Avatar sx={{
                                        bgcolor: red[500],
                                    }} > <NorthEast /> </Avatar>
                                    <div>
                                        <Typography variant="h6"> Debit</Typography>
                                        <Typography variant="h5"> ₹ {total.debit}</Typography>
                                    </div>
                                </Box>
                                <Divider orientation="vertical" flexItem />
                                <Box display="flex" alignItems="center" justifyContent='space-around' minWidth={200}>
                                    <Avatar sx={{
                                        bgcolor: green[500],
                                    }}> <SouthWest /> </Avatar>
                                    <div>
                                        <Typography variant="h6"> Credit</Typography>
                                        <Typography variant="h5"> ₹ {total.credit}</Typography>
                                    </div>
                                </Box>
                                <Divider orientation="vertical" flexItem />
                                <Box display="flex" alignItems="center" justifyContent='space-around' minWidth={200}>
                                    <Avatar sx={{
                                        bgcolor: amber[500],
                                    }}> <AccountBalance /> </Avatar>
                                    <div>
                                        <Typography variant="h6"> Balance 
                                            <Tooltip title={
                                                <Typography variant="body1">
                                                    <b>Balance</b> is the difference between the <b>Debit</b> and <b>Credit</b> amount.
                                                    <li>
                                                        If the <b>Balance</b> is <b>Positive</b>, it means the {clientType} owes you.
                                                    </li>
                                                    <li>
                                                        If the <b>Balance</b> is <b>Negative</b>, it means you need to pay the {clientType}.
                                                    </li>
                                                </Typography>
                                            }> 
                                                <span> <Info fontSize={'small'} /> </span>
                                                </Tooltip>
                                        </Typography>
                                        <Typography variant="h5"> ₹ {total.balance} </Typography>
                                    </div>
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                    <LedgerTable data={ledger} />
                </Grid>
            </Grid>

            {/* <Edit open={open} stock={ledger} setOpen={setOpen} /> */}
            <ClientEdit open={open} client={client as Client} setOpen={setOpen} />

            <AlertDialog
                open={openDelete}
                setOpen={setOpenDelete}
                message={`Are you sure you want to delete ${client?.name} ledger details ?`}
                title={`Delete ${client?.name}`}
                onConfirm={() => {
                    onDelete();
                }} />

        </>
    )
}

export default LedgerDetails
