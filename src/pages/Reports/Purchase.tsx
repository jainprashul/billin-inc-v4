import MaterialTable, { Column } from '@material-table/core'
import React, { useEffect } from 'react'
import { getGSTPurchases, GSTINFO, generateGSTReportData, getReportSheet } from '../../services/analytics/GST'
import { useDataUtils } from '../../utils/useDataUtils'
import UploadFileIcon from '@mui/icons-material/UploadFile';
import { Report } from '../../services/database/model/Report';

type Props = {
  filter: {
    date: {
      from: Date;
      to: Date;
    }
  }
}

const Purchase = ({ filter }: Props) => {

  const { companyDB , companyID} = useDataUtils()
  const [loading, setLoading] = React.useState(false)
  const [data, setData] = React.useState<{
    gstData: GSTINFO[];
    total?: GSTINFO;
    column: Column<GSTINFO>[];
    GSTTotals: GSTINFO[];
  }>({
    gstData: [],
    total: undefined,
    column: [],
    GSTTotals: []
  })

  useEffect(() => {

    async function getPurchaseReport() {
      setLoading(true)

      if (companyDB) {

        // check if there is any report in the database
        const dbReport = await companyDB.reports.get({
          from: filter.date.from,
          to: filter.date.to,
          type: 'GST_PURCHASE'
        })

        if (!dbReport) {
          console.log('No report Found')
        }
        const data = await getGSTPurchases(companyDB, filter.date.from, filter.date.to);
        const report = await generateGSTReportData(data)

        setData(report)
        setLoading(false)

        // update the report in the database
        const reportLog = new Report({
          id: dbReport?.id,
          companyID,
          data: report,
          from: filter.date.from,
          to: filter.date.to,
          type: "GST_PURCHASE",
          createdAt: dbReport?.createdAt || new Date()
        })

        reportLog.save()
      }
      setLoading(false)
    }
    getPurchaseReport()
  }, [companyDB, companyID, filter.date])

  return (
    <div style={{
      width: '120%',
      marginLeft: '-10%'
    }}>
      <MaterialTable
        isLoading={loading}
        columns={data.column}
        title="GST Purchase Report"
        data={data.gstData}
        onRowClick={(event, row) => {
          // navigate(`/stocks/${row?.id}`, {
          //   state: row
          // })
        }}

        actions={[
          {
            icon: () => <UploadFileIcon />,
            tooltip: 'Export to Excel',
            isFreeAction: true,
            onClick: () => {
              getReportSheet(companyDB!, filter.date.from, filter.date.to)
            }
          }
        ]}
        options={{
          pageSize: 10,
          exportAllData: true,
          columnResizable: true,
          pageSizeOptions: [5, 10, 20, 30, 50],
          draggable: true,
          columnsButton: true,
          // filtering : filter,
          headerStyle: {
            fontWeight: 'bold',
          },
        }}
      />
    </div>
  )
}

export default Purchase