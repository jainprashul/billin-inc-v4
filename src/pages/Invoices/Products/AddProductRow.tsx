import React, { useEffect } from 'react'
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { Product } from '../../../services/database/model';
import IconButton from '@mui/material/IconButton';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { useFormik } from 'formik';
import { Autocomplete, TableFooter } from '@mui/material';
import * as yup from 'yup';
import { nanoid } from '@reduxjs/toolkit';
import db from '../../../services/database/db';
import { useDataUtils } from '../../../utils/useDataUtils';

type Props = {
    sn?: number,
    product?: Product;
    onSubmit: (product: Product) => void;
}

const productSchema = yup.object().shape({
    name: yup.string().min(2).required('Product name is required'),
    hsn: yup.string(),
    quantity: yup.number().min(0).required('Quantity is required'),
    price: yup.number().required('Unit price is required'),
    gstRate: yup.number().required('GST rate is required'),
    unit: yup.string(),
});

const AddProductRow = ({
    product = new Product({
        companyID: parseInt(localStorage.getItem("companyID") ?? '1') ,
        gstRate: 0,
        name: '',
        price: 0,
        hsn: "",
        quantity: 1,
        unit: 'KG',
        voucherID: "1",
    }), onSubmit
}: Props) => {
    const [productList, setProductList] = React.useState<string[]>([]);
    const { companyDB } = useDataUtils()


    const formik = useFormik({
        initialValues: product,
        onSubmit: (values) => {

            let product = new Product({ ...values, id: `prod_${nanoid(8)}` });
            onSubmit(product);
            formik.resetForm();
            // console.log(nameRef.current);

            nameRef.current?.focus();
        },
        validationSchema: productSchema,
    })

    const { name, hsn, quantity, price, unit, gstRate } = formik.values;
    const grossAmount = quantity * price;
    const gstAmount = grossAmount * gstRate / 100;
    const totalAmount = grossAmount + gstAmount;


    useEffect(() => {
        companyDB?.stocks.orderBy('name').uniqueKeys().then(productList => {
            setProductList(productList as string[]);
        });
    }, [name]);

    const nameRef = React.useRef<HTMLInputElement>(null);

    return (
        <TableFooter>
            <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <TableCell component="th" scope="row"></TableCell>
                <TableCell padding='none' component="th" scope="row">
                    <Autocomplete
                        id="product-name"
                        style={{ marginTop: '-4px' }}
                        freeSolo
                        value={name}
                        options={[...productList]}
                        onChange={(event, value, reason, detail) => {
                            console.log(value, reason, detail);
                            if (reason === 'selectOption') {
                                formik.setFieldValue('name', value);
                                db.getCompanyDB(1).stocks.get({ name: value }).then((product) => {
                                    if (product) {
                                        formik.setFieldValue('unit', product.unit);
                                        formik.setFieldValue('price', product.salesPrice);
                                    }
                                })
                            } else if (reason === 'clear') {
                                formik.setFieldValue('name', '');
                                formik.setFieldValue('unit', '');
                                formik.setFieldValue('price', 0);
                            }
                        }}
                        renderInput={(params) => <TextField {...params}
                            margin="dense"
                            required
                            autoFocus
                            size='small'
                            fullWidth
                            // label="Product Name"
                            inputRef={nameRef}
                            value={name}
                            name="name"
                            onChange={formik.handleChange}
                        />}
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
                            onChange={(e: SelectChangeEvent) => {
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