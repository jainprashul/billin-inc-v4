import React from 'react'
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { Product, IProduct } from '../../../services/database/model';
import IconButton from '@mui/material/IconButton';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import { useFormik } from 'formik';
import { GstRate } from '../../../services/database/model/Product';
import { TableFooter } from '@mui/material';
import * as yup from 'yup';
import { SchemaOf } from 'yup'

type Props = {
    sn?: number,
    product?: Product;
    onSubmit: (product: Product) => void;
}

const productSchema = yup.object().shape({
    name: yup.string().min(3).required('Product name is required'),
    hsn: yup.string(),
    quantity: yup.number().min(0).required('Quantity is required'),
    price: yup.number().required('Unit price is required'),
    gstRate: yup.number().required('GST rate is required'),
    unit: yup.string(),
});

const AddProductRow = ({
    product = new Product({
        companyID: 1,
        gstRate: 0,
        name: '',
        price: 0,
        hsn: "",
        quantity: 1,
        unit: 'KG',
        voucherID: "1",
    }), onSubmit
}: Props) => {

    const formik = useFormik({
        initialValues: product,
        onSubmit: (values) => {
            console.log(values);
            let product = new Product(values);
            onSubmit(product);
            formik.resetForm();
        },
        validationSchema: productSchema,
    })
    const { name, hsn, quantity, price, unit, gstRate } = formik.values;
    const grossAmount = quantity * price;
    const gstAmount = grossAmount * gstRate / 100;
    const totalAmount = grossAmount + gstAmount;

    return (
        <TableFooter>
        <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
            <TableCell component="th" scope="row"></TableCell>
            <TableCell padding='none' component="th" scope="row">
                <TextField
                    autoFocus
                    size='small'
                    fullWidth
                    // label="Product Name"
                    value={name}
                    name="name"
                    required
                    onChange={formik.handleChange}
                />
            </TableCell>
            <TableCell padding='checkbox' className={'table-input'} align="left">
                <TextField
                    sx={{ minWidth: '6rem' }}
                    size='small'
                    fullWidth
                    // label="Product HSN Code"
                    value={hsn}
                    name="hsn"
                    onChange={formik.handleChange}
                />
            </TableCell>
            <TableCell padding='checkbox' align="right">
                <TextField
                    sx={{ minWidth: '5.5rem' }}
                    size='small'
                    fullWidth
                    // label="Quantity"
                    value={quantity}
                    name="quantity"
                    type={'number'}
                    onChange={formik.handleChange}
                />
            </TableCell>
            <TableCell padding='checkbox' align="right">
                <TextField
                    sx={{ minWidth: '5rem' }}
                    size='small'
                    fullWidth
                    // label="Unit Price"
                    value={price}
                    name="price"
                    type={'number'}
                    onChange={formik.handleChange}
                />
            </TableCell>
            <TableCell padding='checkbox' align="right">
                <FormControl size="small">
                    {/* <InputLabel id="demo-select-small">Unit</InputLabel> */}
                    <Select
                    sx={{ minWidth: '5.5rem' }}
                        labelId="select-unit"
                        value={unit}
                        onChange={(e : SelectChangeEvent) => {
                            formik.setFieldValue('unit', e.target.value);
                        }}
                    // label="Unit"
                    >
                        {
                            ["KG", "L", "PCS", "BOX", "BAG", "BOTTLE", "CARTON"].map((unit, index) => (
                                <MenuItem key={index} value={unit}>{unit}</MenuItem>
                            ))
                        }
                    </Select>
                </FormControl>
            </TableCell>
            <TableCell padding='checkbox' align="right"><TextField
                size='small'
                fullWidth
                style={{
                    minWidth: '5.5rem'
                }}
                // label="Unit Price"
                value={grossAmount}
                name="grossAmount"
                type={'number'}
                onChange={formik.handleChange}
                InputProps={{
                    readOnly: true,
                }}
            /></TableCell>
            <TableCell padding='checkbox' align="right">
                <FormControl size="small">
                    {/* <InputLabel id="demo-select-small">Unit</InputLabel> */}
                    <Select
                        labelId="select-gst-rate"
                        value={gstRate.toString()}
                        // onChange={formik.handleChange}
                        onChange={(e : SelectChangeEvent) => {
                            formik.setFieldValue('gstRate', Number(e.target.value));
                        }}
                    // label="GST Rate"
                    >
                        {
                            [0, 5, 12, 18, 28].map((unit, index) => (
                                <MenuItem key={index} value={unit}>{unit}</MenuItem>
                            ))
                        }
                    </Select>
                </FormControl>
            </TableCell>
            <TableCell padding='checkbox' align="right">
                <TextField
                    size='small'
                    fullWidth
                    style={{
                        minWidth: '5rem'
                    }}
                    // label="Unit Price"
                    value={gstAmount}
                    name="gstAmount"
                    type={'number'}
                    onChange={formik.handleChange}
                    InputProps={{
                        readOnly: true,
                    }}
                />
            </TableCell>
            <TableCell padding='checkbox' align="right">
                <TextField
                    size='small'
                    style={{
                        minWidth: '5.5rem'
                    }}
                    fullWidth
                    // label="Unit Price"
                    value={totalAmount}
                    name="totalAmount"
                    type={'number'}
                    onChange={formik.handleChange}
                    InputProps={{
                        readOnly: true,
                    }}
                /></TableCell>
            <TableCell align="center">
                <IconButton aria-label="add" size="small" onClick={() => { formik.handleSubmit() }}>
                    <AddCircleIcon />
                </IconButton>
            </TableCell>
        </TableRow>
        </TableFooter>
    )
}

export default AddProductRow;