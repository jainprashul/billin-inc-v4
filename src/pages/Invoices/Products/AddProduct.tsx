import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Product } from '../../../services/database/model';
import AddGSTProductRow from './AddGSTProductRow';
import IconButton from '@mui/material/IconButton';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import { TableFooter } from '@mui/material';
import { useLiveQuery } from 'dexie-react-hooks';
import db from '../../../services/database/db';
import AddProductRow from './AddProductRow';


type Props = {
  product?: Product,
  gstEnabled?: boolean,
  onAddProduct: (product: Product) => void,
}

const AddProduct = ({
  product, onAddProduct
}: Props) => {

  return (
    <TableContainer style={{
      marginTop: '1rem',
    }} component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
         
        </TableHead>
        
        <AddGSTProductRow onSubmit={onAddProduct} /> 
        <AddProductRow onSubmit={onAddProduct} />
        
      </Table>
    </TableContainer>
  );
}

export default AddProduct;