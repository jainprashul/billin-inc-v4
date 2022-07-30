import { AccountBalance, ArrowBack, Delete, Edit as EditIcon, NorthEast, Print, SouthWest } from '@mui/icons-material';
import { useDataUtils } from '../../utils/useDataUtils';
import { useLiveQuery } from 'dexie-react-hooks';
import { Avatar, Box, Divider, Grid, IconButton, Tooltip } from '@mui/material';
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
                            <Typography variant="h5" component="div">
                                {client?.name}
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
                                        <Typography variant="h6"> Balance</Typography>
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
