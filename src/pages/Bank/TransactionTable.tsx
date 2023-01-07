import MaterialTable, { Column } from '@material-table/core';
import React from 'react'
import { ITransaction } from '../../services/database/model/Transactions';


type Props = {
    data: Array<ITransaction>
}


const TransactionTable = ({ data }: Props) => {
    
    const [loading, setLoading] = React.useState(true)
    React.useEffect(() => {
        setLoading(!(data ? data.length !== 0 : false))
        setTimeout(() => {
            setLoading(false)
        }, 2000);
    }, [data])

    

    const columns: Array<Column<ITransaction>> = React.useMemo(() => [
        {
            title: 'Date',
            field: 'date',
            type: 'date',
        },
        {
            title: 'Description',
            field: 'description',
        },
        {
            title: 'Transaction Type',
            field: 'type',
        },
        {
            title: 'Amount',
            field: 'amount',
        },
        
       
    ], [])

    return (
        <>
            <MaterialTable
                isLoading={loading}
                columns={columns}
                title="Transactions"
                data={data}
                onRowClick={ (event , row) => {
                   
                }}
                options={{
                    actionsColumnIndex: -1,
                    pageSize: 10,
                    pageSizeOptions: [5, 10, 20, 30, 50],
                    draggable: true,
                    // filtering : filter,
                    headerStyle: {
                        fontWeight: 'bold',    
                    },
                }}
            />
        </>
    )
}

export default TransactionTable
