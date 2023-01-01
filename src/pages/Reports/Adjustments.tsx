import MaterialTable from '@material-table/core';
import { Grid } from '@mui/material';
import React, { useEffect } from 'react'
import { getAdjustments, OverallAdjustments } from '../../services/analytics/GST';
import { Report } from '../../services/database/model/Report';
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
    const { companyDB, companyID } = useDataUtils()
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

                // check if there is any report in the database
                const dbReport = await companyDB.reports.get({
                    from: filter.date.from,
                    to: filter.date.to,
                    type: 'ADJUSTMENTS'
                })

                if (!dbReport) {
                    console.log('No report Found')
                }

                const data = await getAdjustments(companyDB, filter.date.from, filter.date.to)
                setData(data)

                // update the report in the database
                const reportLog = new Report({
                    id: dbReport?.id,
                    companyID,
                    data,
                    from: filter.date.from,
                    to: filter.date.to,
                    type: "ADJUSTMENTS",
                    createdAt: dbReport?.createdAt || new Date()
                })
                reportLog.save()
            }
        }
        getData()
    }, [companyDB, companyID, filter.date])
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