import Typography from '@mui/material/Typography';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
import {  PURCHASE } from '../../constants/routes';
import PurchaseForm from './PurchaseForm';

type Props = {}

const Create = (props: Props) => {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  return (
    <div className="create-purchase">
      <Typography variant="h6">Create Purchase</Typography>
      <PurchaseForm onSubmit={(bill)=> {
        console.log('Submit')
        bill.save().then(()=>{
          enqueueSnackbar('Purchase Bill Created', { variant: 'success' });
          console.log('Saved')
          navigate(PURCHASE);
        }).catch((err)=>{
          console.log("Create: Error",err)
          enqueueSnackbar('Error Creating Purchase Bill Entry', { variant: 'error' });
        })
      }}/>
    </div>
  )
}

export default Create