import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Product } from '../../../services/database/model';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import React from 'react'
import { Grid } from '@mui/material';
import { useDataUtils } from '../../../utils/useDataUtils';
import AddProductRow from './AddProductRow';

type Props = {
  products: Product[],
  gstEnabled: boolean,
  eventFunctions: {
    onAddProduct: (product: Product) => void,
    onDeleteProduct: (product: Product) => void,
  }
}

const ProductTable = ({
  gstEnabled,
  products,
  eventFunctions,
}: Props) => {
  const { onAddProduct, onDeleteProduct } = eventFunctions;

  const { isMobile } = useDataUtils()

  if (isMobile) {
    return (
      <Grid container spacing={2}>
        <Grid item xs={12}>
          {products?.map((product, i) => (
            <Paper elevation={3} style={{
              padding: '.5rem',
              marginTop: '.5rem',
            }}  key={i}>
              S.N.: {i + 1} <br />
              Product Name: {product.name} <br />
              {gstEnabled && ( <> HSN Code: {product.hsn} <br /> </>)}
              Quantity: {product.quantity} <br />
              Unit Price: Rs.{product.price} <br />
              Unit Type: {product.unit} <br />
              { gstEnabled && ( <> Unit MRP: Rs.{product.mrp} <br /> </>)}
              Gross Value: Rs.{product.grossAmount} <br />
              { gstEnabled && ( <> GST Rate : Rs.{product.gstRate} <br /> </>)}
              { gstEnabled && ( <> GST Amount : Rs.{product.gstAmount} <br /> </>) }
              Total: {product.totalAmount} <br />
              <IconButton aria-label="delete" size="small" onClick={() => {
                onDeleteProduct(product)
              }}>  <DeleteIcon />
              </IconButton>
            </Paper>
          ))}
          <AddProductRow gstEnabled={gstEnabled} onSubmit={onAddProduct} />

        </Grid>
      </Grid>
    );
  }


  return (
    <>
      <TableContainer style={{
        marginTop: '1rem',
      }} component={Paper}>
        <Table sx={{ overflowX: 'auto' }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>S.N.</TableCell>
              <TableCell align="left">Product Name* </TableCell>
              { gstEnabled && ( <> <TableCell align="center">HSN Code</TableCell> </>)}
              <TableCell align="center">Quantity</TableCell>
              <TableCell align="center">Unit Price</TableCell>
              <TableCell align="center">Unit Type</TableCell>
              { gstEnabled && ( <> <TableCell align="center">Unit MRP</TableCell> </>)}
              <TableCell align="center">Gross Value</TableCell>
              { gstEnabled && ( <> <TableCell align="center">GST Rate</TableCell> </>)}
              { gstEnabled && ( <> <TableCell align="center">GST Amount</TableCell> </>) }
              <TableCell align="center">Total</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products?.map((product, i) => (
              <TableRow
                key={product.id}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row">{i + 1}.</TableCell>
                <TableCell component="th" scope="row">{product.name}</TableCell>
                { gstEnabled && ( <> <TableCell align="center">{product.hsn}</TableCell> </>)}
                <TableCell align="center">{product.quantity}</TableCell>
                <TableCell align="center">{product.price}</TableCell>
                <TableCell align="center">{product.unit}</TableCell>
                {  gstEnabled && ( <> <TableCell align="center">{product.mrp}</TableCell> </>)} 
                <TableCell align="center">{product.grossAmount}</TableCell>
                { gstEnabled && ( <> <TableCell align="center">{product.gstRate}</TableCell> </>)}
                { gstEnabled && ( <> <TableCell align="center">{product.gstAmount}</TableCell> </>) }
                <TableCell align="center">{product.totalAmount}</TableCell>
                <TableCell align="center">
                  <IconButton aria-label="delete" size="small" onClick={() => {
                    onDeleteProduct(product)
                  }}>  <DeleteIcon />
                  </IconButton></TableCell>
              </TableRow>
            ))}
          </TableBody>
          <AddProductRow onSubmit={onAddProduct} gstEnabled={gstEnabled} />
        </Table>
      </TableContainer>
    </>
  );
}

export default ProductTable;
