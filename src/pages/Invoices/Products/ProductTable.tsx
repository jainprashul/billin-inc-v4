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
import AddProduct from './AddProduct';





type Props = {
  products: Product[],
  eventFunctions: {
    onAddProduct: (product: Product) => void,
    onDeleteProduct: (product: Product) => void,
  }
}

const ProductTable = ({
  products,
  eventFunctions,
}: Props) => {
  const { onAddProduct, onDeleteProduct } = eventFunctions;
  return (
    <TableContainer style={{
      marginTop: '1rem',
    }} component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>S.N.</TableCell>
            <TableCell align="left">Product Name</TableCell>
            <TableCell align="center">HSN Code</TableCell>
            <TableCell align="center">Quantity</TableCell>
            <TableCell align="center">Unit Price</TableCell>
            <TableCell align="center">Unit Type</TableCell>
            <TableCell align="center">Gross Value</TableCell>
            <TableCell align="center">GST Rate</TableCell>
            <TableCell align="center">GST Amount</TableCell>
            <TableCell align="center">Total</TableCell>
            <TableCell align="center">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {products?.map((product, i) => (
            <TableRow
              key={product.name}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">{i + 1}.</TableCell>
              <TableCell component="th" scope="row">{ product.name }</TableCell>
              <TableCell align="center">{ product.hsn }</TableCell>
              <TableCell align="center">{ product.quantity }</TableCell>
              <TableCell align="center">{ product.price }</TableCell>
              <TableCell align="center">{ product.unit }</TableCell>
              <TableCell align="center">{ product.grossAmount }</TableCell>
              <TableCell align="center">{ product.gstRate }</TableCell>
              <TableCell align="center">{ product.gstAmount }</TableCell>
              <TableCell align="center">{ product.totalAmount }</TableCell>
              <TableCell align="center">
              <IconButton aria-label="delete" size="small" onClick={()=>{
                onDeleteProduct(product)
              }}>
                    <DeleteIcon />
                </IconButton></TableCell>
            </TableRow>
          ))}
        </TableBody>
        <AddProductRow onSubmit={onAddProduct} />
      </Table>
      {/* <AddProduct onAddProduct={onAddProduct} /> */}
    </TableContainer>
  );
}

export default ProductTable;