import MaterialTable, { Action, Column } from '@material-table/core'
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material'

type Backup = {
    id: string,
    name: string,
    size: number | string,
    createdTime: string,
}

type Props = {
    data: Array<Backup>
    open : boolean,
    setOpen: (open: boolean) => void,
    handleRestore: (id?: string) => void
}

const BackupList = ({data, open , setOpen, handleRestore}: Props) => {

    const handleClose = () => {
        setOpen(false);
    };

    const columns: Array<Column<Backup>> = [
        {
            title: 'Name',
            field: 'name',
        },
        {
            title: 'Size',
            field: 'size',
        },

        {
            title: 'Created Time',
            field: 'createdTime',
            type: 'datetime'
        },
    ]

    const actions:  Array<Action<Backup>> = [
        {
            icon: () => <Button>Restore</Button>,
            tooltip: 'Restore',
            onClick: (event, rowData ) => {
                console.log(rowData)
                const data = rowData as Backup
                handleRestore(data.id as string)
            },
        }
    ]

    return (
        <Dialog
            data-testid="alert-dialog-container"
            open={open}
            onClose={() => {
                handleClose();
            }}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">
                Cloud Backup List
            </DialogTitle>
            <DialogContent>
            <MaterialTable
                columns={columns}
                data={data}
                actions={actions}
                options={{
                    actionsColumnIndex: -1,
                    pageSize: 5,
                    pageSizeOptions: [5, 10, 20, 30, 50],
                    draggable: true,
                    headerStyle: {
                        fontWeight: 'bold',    
                    },
                    search : false,
                    toolbar : false,
                }}
            />
            </DialogContent>
            <DialogActions>
                {
                    <Button data-testid="alert-dialog-cancel-btn" onClick={() => {
                        handleClose();
                    }}>Close</Button>
                }
                {/* <Button data-testid="alert-dialog-confirm-btn" color='primary' onClick={() => {
                        handleClose();
                        
                    }} ></Button> */}
            </DialogActions>
        </Dialog>
    );
}

export default BackupList