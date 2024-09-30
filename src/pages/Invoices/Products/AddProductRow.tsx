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
import { Autocomplete, Button, Grid, InputLabel, TableFooter } from '@mui/material';
import { nanoid } from '@reduxjs/toolkit';
import { useDataUtils } from '../../../utils/useDataUtils';
import { selectGstRateType } from '../../../utils/utilsSlice';
import { useAppSelector } from '../../../app/hooks';
import { PRODUCT_UNITS } from '../../../constants';

type Props = {
    sn?: number,
    product?: Product;
    onSubmit: (product: Product) => void;
    gstEnabled?: boolean;
}

const AddProductRow = ({
    product = new Product({
        companyID: parseInt(localStorage.getItem("companyID") ?? '1'),
        gstRate: 0,
        name: '',
        price: 0,
        hsn: "",
        quantity: 1,
        unit: 'KG',
        voucherID: "1",
    }), onSubmit, gstEnabled = false
}: Props) => {
    const [productList, setProductList] = React.useState<string[]>([]);
    const { companyDB, isMobile } = useDataUtils()
    const isInclusive = useAppSelector(selectGstRateType)

    const formik = useFormik({
        initialValues: product,
        onSubmit: (values) => {
            let product = new Product({ ...values, id: `prod_${nanoid(8)}` });
            onSubmit(product);
            formik.resetForm();
            // console.log(nameRef.current);

            nameRef.current?.focus();
        },
        validationSchema: Product.validationSchema,
    })

    const { name, hsn, quantity, price, unit, gstRate, mrp } = formik.values;
    const _price = isInclusive ? parseFloat((price * 100 / (100 + gstRate)).toFixed(2)) : price;

    let grossAmount = quantity * price;
    if (gstEnabled) { grossAmount = quantity * _price; }
    const gstAmount = parseFloat((grossAmount * gstRate / 100).toFixed(2));
    const totalAmount = grossAmount + gstAmount;


    useEffect(() => {
        companyDB?.stocks.orderBy('name').uniqueKeys().then(productList => {
            setProductList(productList as string[]);
        });
    }, [companyDB?.stocks, name]);

    const nameRef = React.useRef<HTMLInputElement>(null);

    function handleNameChange (event :any, value: any, reason: any, detail:any) {
        console.log(value, reason, detail);
        if (reason === 'selectOption') {
            formik.setFieldValue('name', value);
            companyDB?.stocks.get({ name: value }).then((product) => {
                if (product) {
                    if (gstEnabled) formik.setFieldValue('hsn', product.hsn);
                    formik.setFieldValue('unit', product.unit);
                    formik.setFieldValue('price', product.salesPrice || product.purchasePrice);
                    if (gstEnabled) formik.setFieldValue('gstRate', product.gstRate);
                    if (gstEnabled) formik.setFieldValue('mrp', product.mrp);
                }
            })
        } else if (reason === 'clear') {
            formik.setFieldValue('name', '');
            formik.setFieldValue('hsn', '');
            formik.setFieldValue('unit', '');
            formik.setFieldValue('price', 0);
            formik.setFieldValue('gstRate', 0);
            formik.setFieldValue('mrp', 0);
        }
    }

    if (isMobile) {
        return (
            <Grid container spacing={1} mt={2}>
                <Grid item xs={12} sm={6}>
                    <Autocomplete
                        id="product-name"
                        style={{ marginTop: '-4px' }}
                        freeSolo
                        value={name}
                        options={[...productList]}
                        onChange={handleNameChange}
                        renderInput={(params) => <TextField {...params}
                            margin="dense"
                            required
                            autoFocus
                            size='small'
                            fullWidth
                            label="Product Name"
                            inputRef={nameRef}
                            value={name}
                            name="name"
                            onChange={formik.handleChange}
                        />}
                    />
                </Grid>
                {
                    gstEnabled ? (
                        <Grid item xs={12} sm={2}>

                            <TextField
                                sx={{ minWidth: '6rem' }}
                                size='small'
                                fullWidth
                                label="Product HSN Code"
                                value={hsn}
                                name="hsn"
                                onChange={formik.handleChange}
                            />

                        </Grid>
                    ) : null
                }
                <Grid item xs={12} sm={2}>
                    <TextField
                        sx={{ minWidth: '5.5rem' }}
                        size='small'
                        fullWidth
                        label="Quantity"
                        value={quantity}
                        name="quantity"
                        type={'number'}
                        onChange={formik.handleChange}
                    />
                </Grid>
                <Grid item xs={12} sm={2}>
                    <TextField
                        sx={{ minWidth: '5rem' }}
                        size='small'
                        fullWidth
                        label="Unit Price"
                        value={price}
                        name="price"
                        type={'number'}
                        onChange={formik.handleChange}
                    />
                </Grid>
                <Grid item xs={12} sm={2}>
                    <FormControl size="small">
                        <InputLabel id="demo-select-small">Unit</InputLabel>
                        <Select
                            sx={{ minWidth: '5.5rem', width: '15rem' }}
                            labelId="select-unit"
                            label="Unit"
                            value={unit}
                            onChange={(e: SelectChangeEvent) => {
                                formik.setFieldValue('unit', e.target.value);
                            }}
                        // label="Unit"
                        >
                            {
                                PRODUCT_UNITS.map((unit, index) => (
                                    <MenuItem key={index} value={unit}>{unit}</MenuItem>
                                ))
                            }
                        </Select>
                    </FormControl>
                </Grid>
                {gstEnabled ? <Grid item xs={12} sm={2}>
                    <TextField
                        size='small'
                        fullWidth
                        style={{
                            minWidth: '5.5rem'
                        }}
                        label="Unit MRP"
                        value={mrp}
                        name="mrp"
                        type={'number'}
                        onChange={formik.handleChange}
                    />
                </Grid> : null}
                <Grid item xs={12} sm={2}>
                    <TextField
                        size='small'
                        fullWidth
                        style={{
                            minWidth: '5.5rem'
                        }}
                        label="Gross Amount"
                        value={grossAmount}
                        name="grossAmount"
                        type={'number'}
                        onChange={formik.handleChange}
                        InputProps={{
                            readOnly: true,
                        }}
                    />
                </Grid>
                {
                    gstEnabled ? (
                        <Grid item xs={12} sm={2}>

                            <FormControl fullWidth size="small">
                                <InputLabel id="demo-select-small">GST Rate</InputLabel>
                                <Select
                                    labelId="select-gst-rate"
                                    value={gstRate.toString()}
                                    // onChange={formik.handleChange}
                                    onChange={(e: SelectChangeEvent) => {
                                        formik.setFieldValue('gstRate', Number(e.target.value));
                                    }}
                                    fullWidth
                                    label="GST Rate"
                                >
                                    {
                                        [0, 3, 5, 12, 18, 28].map((unit, index) => (
                                            <MenuItem key={index} value={unit}>{unit}</MenuItem>
                                        ))
                                    }
                                </Select>
                            </FormControl>
                        </Grid>
                    ) : null
                }
                {gstEnabled ? (
                    <TextField
                        size='small'
                        fullWidth
                        style={{
                            minWidth: '5.5rem'
                        }}
                        label="GST Amount"
                        value={gstAmount}
                        name="gstAmount"
                        type={'number'}
                        onChange={formik.handleChange}
                        InputProps={{
                            readOnly: true,
                        }}
                    />) : null
                }
                <Grid item xs={12} sm={2}>
                    <TextField
                        size='small'
                        style={{
                            minWidth: '5.5rem'
                        }}
                        fullWidth
                        label="Total Amount"
                        value={totalAmount}
                        name="totalAmount"
                        type={'number'}
                        onChange={formik.handleChange}
                        InputProps={{
                            readOnly: true,
                        }}
                    />
                </Grid>
                <Grid item xs={12} sm={2}>
                    <Button variant="contained" color="primary" onClick={() => formik.handleSubmit()}>
                        Add
                    </Button>
                </Grid>

            </Grid>
        )
    }
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
                        onChange={handleNameChange}
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
                {
                    gstEnabled ? (
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
                    ) : null
                }
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
                                PRODUCT_UNITS.map((unit, index) => (
                                    <MenuItem key={index} value={unit}>{unit}</MenuItem>
                                ))
                            }
                        </Select>
                    </FormControl>
                </TableCell>
                {gstEnabled ? (
                    <TableCell padding='checkbox' align="right">
                        <TextField
                            size='small'
                            fullWidth
                            style={{
                                minWidth: '5.5rem'
                            }}
                            // label="Unit MRP"
                            value={mrp}
                            name="mrp"
                            type={'number'}
                            onChange={formik.handleChange}
                        />
                    </TableCell>) : null}
                <TableCell padding='checkbox' align="right">
                    <TextField
                        size='small'
                        fullWidth
                        style={{
                            minWidth: '5.5rem'
                        }}
                        // label="Gross Amount"
                        value={grossAmount}
                        name="grossAmount"
                        type={'number'}
                        onChange={formik.handleChange}
                        InputProps={{
                            readOnly: true,
                        }}
                    />
                </TableCell>

                {
                    gstEnabled ? (
                        <TableCell padding='checkbox' align="right">
                            <FormControl size="small">
                                {/* <InputLabel id="demo-select-small">Unit</InputLabel> */}
                                <Select
                                    labelId="select-gst-rate"
                                    value={gstRate.toString()}
                                    // onChange={formik.handleChange}
                                    onChange={(e: SelectChangeEvent) => {
                                        formik.setFieldValue('gstRate', Number(e.target.value));
                                    }}
                                // label="GST Rate"
                                >
                                    {
                                        [0, 3, 5, 12, 18, 28].map((unit, index) => (
                                            <MenuItem key={index} value={unit}>{unit}</MenuItem>
                                        ))
                                    }
                                </Select>
                            </FormControl>
                        </TableCell>
                    ) : null
                }

                {
                    gstEnabled ? (
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
                    ) : null
                }

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
