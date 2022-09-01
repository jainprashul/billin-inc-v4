import Typography from '@mui/material/Typography';
import { useSnackbar } from 'notistack';
import { useLocation, useNavigate } from 'react-router-dom';
import {  PURCHASE } from '../../constants/routes';
import { IPurchase, Purchase } from '../../services/database/model';
import PurchaseForm from './PurchaseForm';

type Props = {}

const Edit = (props: Props) => {
  const navigate = useNavigate();
  const location = useLocation()
  const purchase = new Purchase(location.state as IPurchase)
  console.log(purchase);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  return (
    <div className="edit-purchase-container">
      <Typography variant="h6">Edit Purchase Entry</Typography>
      <PurchaseForm purchase={new Purchase(location.state as IPurchase)} onSubmit={(purchase)=> {
        console.log('Submit')
        purchase.save().then(()=>{
          enqueueSnackbar('Purchase Bill Updated', { variant: 'success' });
          console.log('Saved')
          navigate(PURCHASE);
        }).catch((err)=>{
          console.log("Create: Error",err)
          enqueueSnackbar('Error Updating Purchase Bill', { variant: 'error' });
        })
      }}/>
    </div>
  )
}

export default Edit