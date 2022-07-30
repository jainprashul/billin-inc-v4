import { People } from '@mui/icons-material'
import { Dialog, DialogContent, DialogContentText, DialogTitle, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material'
import { useLiveQuery } from 'dexie-react-hooks'
import React, { useEffect } from 'react'
import Search from '../../../components/shared/Search'
import { useDataUtils } from '../../../utils/useDataUtils'

type Props = {
    open: boolean
    setOpen: (open: boolean) => void
    q? : string
}

const ClientList = (props: Props) => {
    const { open, setOpen } = props
    const { companyDB, navigate } = useDataUtils()
    const [query, setQuery] = React.useState('')
    const clients = useLiveQuery(async () => {
        if (companyDB) {
            return await companyDB.clients.where('name').startsWithIgnoreCase(query).toArray()
        }
    }, [companyDB, query], [])

    const handleClose = () => {
        setOpen(false);
    };


    return (
        <>

            <Dialog fullWidth open={open} onClose={handleClose}>
                <DialogTitle>Search Ledger</DialogTitle>
                <DialogContent style={{
                    minHeight: '70vh'
                }}>
                    {/* <DialogContentText>
                        To subscribe to this website, please enter your email address here. We
                        will send updates occasionally.
                    </DialogContentText> */}

                    <Search query={query} onSearch={(q) => {
                        console.log(q)
                        setQuery(q)
                    }} onClear={() => { setQuery('') }} />  

                    <List>
                        {clients?.map((client) => (
                            <ListItem key={client.id} disablePadding>
                                <ListItemButton onClick={()=> {
                                    navigate(`/ledger/${client.id}`)
                                }}>
                                    <ListItemIcon>
                                        <People />
                                    </ListItemIcon>
                                    <ListItemText primary={client.name} />
                                </ListItemButton>
                            </ListItem>
                        ))}
                    </List>

                </DialogContent>

            </Dialog>
        </>
    )
}

export default ClientList