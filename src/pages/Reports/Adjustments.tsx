import MaterialTable from '@material-table/core';
import { Grid } from '@mui/material';
import React, { useEffect } from 'react'
import { getAdjustments, OverallAdjustments } from '../../services/analytics/GST';
import { useDataUtils } from '../../utils/useDataUtils';
type Props = {
    filter: {
        date: {
            from: Date;
            to: Date;
        }
    }
}
const Adjustments = ({ filter }: Props) => {
    const { companyDB } = useDataUtils()
    const [data, setData] = React.useState<OverallAdjustments>({
        purchaseReports: {
            data: [],
            column: []
        },
        salesReports: {
            data: [],
            column: []
        },
        adjustments: {
            data: [],
            column: []
        }
    })
    useEffect(() => {
        async function getData() {
            if (companyDB) {
                const data = await getAdjustments(companyDB, filter.date.from, filter.date.to)
                setData(data)
            }
        }
        getData()
    }, [companyDB, filter.date])
    return (
        <div>
            <Grid container spacing={2}>
                <Grid item sm={12} md={6}>
                    <MaterialTable
                        columns={data.purchaseReports.column}
                        data={data.purchaseReports.data}
                        title="Output Adjustments"
                        options={{
                            paging: false,
                            toolbar: false,
                            padding: 'dense',
                        }}
                    />
                </Grid>
                <Grid item sm={12} md={6}>
                    <MaterialTable
                        columns={data.salesReports.column}
                        data={data.salesReports.data}
                        title="Input Adjustments"
                        options={{
                            paging: false,
                            toolbar: false,
                            padding: 'dense',
                        }}
                    />
                </Grid>
                <Grid item sm={12} md={6}>
                    <MaterialTable
                        columns={data.adjustments.column}
                        data={data.adjustments.data}
                        title="Adjustments"
                        options={{
                            paging: false,
                            toolbar: false,
                            padding: 'dense',
                        }}
                    />
                </Grid>
            </Grid>
        </div>
    )
}
export default Adjustments