import { ArrowBack, Delete, Edit as EditIcon } from '@mui/icons-material';
import { useDataUtils } from '../../utils/useDataUtils';
import { useLiveQuery } from 'dexie-react-hooks';
import { Grid, IconButton, Tooltip } from '@mui/material';
import { LEDGER, STOCKS } from '../../constants/routes';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import React from 'react';
import AlertDialog from '../../components/shared/AlertDialog';
import { Client, Ledger } from '../../services/database/model';
import LedgerTable from './LedgerTable';
import ClientEdit from './Client/Edit';


type Props = {

}


const LedgerDetails = (props: Props) => {
    const [open, setOpen] = React.useState(false);
    const [openDelete, setOpenDelete] = React.useState(false);
    const { params, companyDB, toast, navigate } = useDataUtils();
    const clientID = params.id as string;

    const queries = useLiveQuery(async () => {
        const ledger = await companyDB?.ledger.where('clientID').equals(clientID).toArray() as Ledger[];
        const client = await companyDB?.clients.where('id').equals(clientID).first() as Client;
        // await stk?.loadStockLogs();
        // stk?.stockLogs.map(async (log) => { await log.loadClient(); return log; });
        return {
            ledger , client
        }
    }, [companyDB, clientID])

    const { ledger, client } = queries ? queries : { ledger: [], client: null };

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
                                    <Grid item xs={3} color='text.secondary'> Email :</Grid> <Grid item xs={9}>{client?.contacts[0].email }</Grid>
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
                        </CardActions>
                    </Card>
                </Grid>
                <Grid item md={8}>
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
