import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Product } from '../../../services/database/model';
import AddProductRow from './AddProductRow';
import IconButton from '@mui/material/IconButton';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import { TableFooter } from '@mui/material';


type Props = {
  product?: Product,
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
        
        <AddProductRow onSubmit={onAddProduct} />
      </Table>
    </TableContainer>
  );
}

export default AddProduct;