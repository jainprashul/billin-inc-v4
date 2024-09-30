import { ArrowBack, Delete, Edit as EditIcon } from '@mui/icons-material';
import { Stock } from '../../services/database/model/Stocks';
import { useDataUtils } from '../../utils/useDataUtils';
import { useLiveQuery } from 'dexie-react-hooks';
import LogTable from './Logs/LogTable';
import { Grid, IconButton, Tooltip } from '@mui/material';
import { STOCKS } from '../../constants/routes';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Edit from './Edit';
import React from 'react';
import AlertDialog from '../../components/shared/AlertDialog';
import { withAdmin } from '../../routes/AdminWrapper';


type Props = {

}


const StockDetail = (props: Props) => {
    const [open, setOpen] = React.useState(false);
    const [openDelete, setOpenDelete] = React.useState(false);
    const { params, companyDB, toast, navigate } = useDataUtils();
    const stockID = params.id as string;

    const stock = useLiveQuery(async () => {
        const stk = await companyDB?.stocks.where('id').equals(stockID).first();
        await stk?.loadStockLogs();
        stk?.stockLogs.map(async (log) => { await log.loadClient(); return log; });
        return stk;
    }, [companyDB, stockID]) as Stock;

    console.log(stock);

    const onDelete = () => {
        stock?.delete().then(() => {
            toast.enqueueSnackbar(`Stock ${stock?.name} Deleted`, { variant: 'success' });
            navigate(STOCKS, { replace: true })
        }).catch((err) => {
            console.log(err);
            toast.enqueueSnackbar(`Error Deleting Stock ${stock?.name}`, { variant: 'error' });
        })
    }

    return (
        <>
            <Grid container spacing={2} justifyContent='space-between'>
                <Grid item md={3}>
                    <Card style={{
                        height: '100%',
                    }} >
                        <CardContent>
                            <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                                <IconButton onClick={() => {
                                    navigate(-1);
                                }} size='small'><ArrowBack /></IconButton> Stock Details
                            </Typography>
                            <Typography variant="h5" component="div">
                                {stock?.name}
                            </Typography>
                            <Typography sx={{ mb: 1.5 }} color="text.secondary">
                                {stock?.description}
                            </Typography>
                            <Typography variant="subtitle2" style={{
                                whiteSpace: 'pre'
                            }}>
                                <Grid container >
                                    <Grid item xs={6}> Quantity :</Grid> <Grid item xs={6}>{stock?.quantity}</Grid>
                                    <Grid item xs={6}> GST Rate :</Grid> <Grid item xs={6}>{stock?.gstRate} %</Grid>
                                    <Grid item xs={6}> HSN :</Grid> <Grid item xs={6}>{stock?.hsn}</Grid>
                                    <Grid item xs={6}> Purchase Price :</Grid> <Grid item xs={6}>₹ {stock?.purchasePrice?.toFixed?.(2)}</Grid>
                                    <Grid item xs={6}> Sales Price :</Grid> <Grid item xs={6}>₹ {stock?.salesPrice?.toFixed?.(2)}</Grid>
                                    <Grid item xs={6}> MRP :</Grid> <Grid item xs={6}>₹ {stock?.mrp?.toFixed(2)}</Grid>
                                    <Grid item xs={6}> Unit :</Grid> <Grid item xs={6}>{stock?.unit}</Grid>
                                    <Grid item xs={6}> Stock Value :</Grid> <Grid item xs={6}>₹ {stock?.stockValue?.toFixed?.(2)}</Grid>
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
                <Grid item md={9}>
                    <LogTable data={stock?.stockLogs} />
                </Grid>
            </Grid>

            <Edit open={open} stock={stock} setOpen={setOpen} />
            <AlertDialog
                open={openDelete}
                setOpen={setOpenDelete}
                message={`Are you sure you want to delete ${stock?.name}?`}
                title={`Delete ${stock?.name}`}
                onConfirm={() => {
                    onDelete();
                }} />

        </>
    )
}

export default withAdmin(StockDetail);
