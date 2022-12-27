import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { Stock } from '../../services/database/model';
import { useFormik } from 'formik';
import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material';

type Prop = {
  open: boolean;
  stock?: Stock;
  edit?: boolean;
  setOpen: (open: boolean) => void;
  onClose: () => void;
  onSubmit: (data: Stock) => void;
}
export default function StockForm({ open, setOpen, onClose, onSubmit, edit=false, stock = new Stock({
  name: '',
  quantity: 0,
  companyID: parseInt(localStorage.getItem("companyID") ?? '1'),
  gstRate: 0,
  unit: 'KG',
  purchasePrice: 0,
  salesPrice: 0,
  hsn: '',
  stockValue: 0,
  logIDs: new Set([]),
  description: '',
}) }: Prop) {

  console.log(stock);

  const formik = useFormik({
    initialValues: stock,
    onSubmit: onSubmit,
    enableReinitialize: edit,
  });

  const handleClose = () => {
    onClose();
    setOpen(false);
    formik.resetForm();
  };

  const handleSubmit = () => {
    onSubmit(formik.values);
    handleClose();
  }

  const { name, description, gstRate, hsn, purchasePrice, salesPrice, quantity, unit } = formik.values;

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>{
        edit ? `Edit Stock - ${name}` : 'Create Stock'  
        }</DialogTitle>
      <form>

        <DialogContent>
          <TextField
            margin="dense"
            required
            autoFocus
            size='small'
            fullWidth
            label="Stock Name"
            value={name}
            name="name"
            onChange={formik.handleChange}
          />

          <TextField
            sx={{ minWidth: '5rem' }}
            margin="dense"
            size='small'
            fullWidth
            multiline
            label="Description"
            value={description}
            name="description"
            type={'text'}
            onChange={formik.handleChange}
          />

          <TextField
            sx={{ minWidth: '6rem' }}
            margin="dense"
            size='small'
            fullWidth
            label=" HSN Code"
            value={hsn}
            name="hsn"
            onChange={formik.handleChange}
          />

          <TextField
            sx={{ minWidth: '5.5rem' }}
            margin="dense"
            size='small'
            fullWidth
            label="Quantity"
            value={quantity}
            disabled={edit}
            name="quantity"
            type={'number'}
            onChange={formik.handleChange}
          />

          <TextField
            sx={{ minWidth: '5rem' }}
            margin="dense"
            size='small'
            fullWidth
            label="Sales Price"
            value={salesPrice}
            name="salesPrice"
            type={'number'}
            onChange={formik.handleChange}
          />
          <TextField
            sx={{ minWidth: '5rem' }}
            margin="dense"
            size='small'
            fullWidth
            label="Purchase Price"
            value={purchasePrice}
            name="purchasePrice"
            type={'number'}
            onChange={formik.handleChange}
          />
          <br />

          <FormControl size="small" style={{
            margin: '0.5rem 0',
            minWidth: '10rem',
          }}>
            <InputLabel id="select-unit">Unit</InputLabel>
            <Select

              labelId="select-unit"
              value={unit}
              autoWidth
              onChange={(e: SelectChangeEvent) => {
                formik.setFieldValue('unit', e.target.value);
              }}
              label="Unit"
            >
              {
                ["KG", "L", "PCS", "BOX", "BAG", "BOTTLE", "CARTON"].map((unit, index) => (
                  <MenuItem key={index} value={unit}>{unit}</MenuItem>
                ))
              }
            </Select>
          </FormControl>


          <FormControl size="small" style={{
            margin: '0.5rem 0.5rem',
            minWidth: '10rem',
          }}>
            <InputLabel id="select-gst-rate">GST Rate</InputLabel>
            <Select
              labelId="select-gst-rate"
              value={gstRate.toString()}
              autoWidth
              // onChange={formik.handleChange}
              onChange={(e: SelectChangeEvent) => {
                formik.setFieldValue('gstRate', Number(e.target.value));
              }}
              label="GST Rate"
            >
              {
                [0, 5, 12, 18, 28].map((unit, index) => (
                  <MenuItem key={index} value={unit}>{unit}</MenuItem>
                ))
              }
            </Select>
          </FormControl>


        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit" onClick={handleSubmit}>{ edit ? "Update" : "Save"}</Button>
        </DialogActions>
      </form>

    </Dialog>
  );
}