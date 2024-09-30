import { Button, TextField } from '@mui/material'
import React from 'react'
import { useDataUtils } from '../../../utils/useDataUtils'
import { upiqr } from 'upiqr';

type Props = {}


const UPI = (props: Props) => {
    const [edit, setEdit] = React.useState(false)
    const UPIRef = React.useRef<HTMLInputElement>(null)
    const [qr , setQr] = React.useState<string | undefined>(localStorage.getItem('qr') || undefined)

    const { company, toast } = useDataUtils()
    async function handleEdit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setEdit(!edit)
        console.log('edit ', edit)
        if (edit) {
            const upi = UPIRef.current?.value

            company.upi = upi
            company.save().then(() => {
                console.log('saved')
                toast.enqueueSnackbar('UPI ID Updated', { variant: 'success' })
            }).catch((err) => {
                console.log(err)
                toast.enqueueSnackbar('Error Updating UPI ID', { variant: 'error' })
            })

            if(company.upi){
                const qrData = await upiqr({
                    payeeName: company.name,
                    payeeVPA: company.upi,
                });
                console.log(qrData);
                setQr(qrData.qr)
                localStorage.setItem('qr', qrData.qr)
            }
        }
    }
    return (
        <div>
            <form style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
            }} onSubmit={handleEdit} >
                <TextField
                    label='UPI ID'
                    variant='outlined'
                    margin='normal'
                    disabled={!edit}
                    defaultValue={company?.upi}
                    inputRef={UPIRef}
                    required
                />
                <Button variant='contained' style={{ marginLeft : 10 }} type='submit' color='primary' >
                    {edit ? 'Update' : 'Edit'}
                </Button>
            </form>

            {qr && <img style={{
                objectFit: 'contain',
                border : '1px solid #ccc',
                borderRadius : 10,
            }} src={qr} alt="QR Code" />}


        </div>
    )
}

export default UPI