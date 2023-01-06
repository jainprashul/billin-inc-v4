import MaterialTable, { Column } from '@material-table/core'
import React, { useEffect } from 'react'
import { GSTINFO, generateGSTReportData, getGSTSales, getReportSheet } from '../../services/analytics/GST'
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

const Sales = (props: Props) => {

  const { companyDB, companyID } = useDataUtils()
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

    async function getSalesReport() {
      setLoading(true)
      if (companyDB) {
        let dbReport = await companyDB.reports.get({
          from : props.filter.date.from,
          to : props.filter.date.to,
          type : 'GST_SALES'
        })

        if(!dbReport) {
          console.log('No report Found')
        }

        const data = await getGSTSales(companyDB, props.filter.date.from, props.filter.date.to);
        const report = await generateGSTReportData(data)
        setData(report)
        setLoading(false)

        const reportLog = new Report({
          id : dbReport?.id,
          companyID ,
          data : report,
          from : props.filter.date.from,
          to : props.filter.date.to,
          type : "GST_SALES",
          createdAt: dbReport?.createdAt || new Date()
        })

        reportLog.save()
        console.log("report", report)
      }
      setLoading(false)
    }

      getSalesReport()
  } , [companyDB, companyID, props.filter.date])


  return (
    <div style={{
      width: '120%',
      marginLeft: '-10%'
    }}>
      <MaterialTable
        isLoading={loading}
        columns={data.column}
        title="GST Sales Report"
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
              getReportSheet(companyDB!, props.filter.date.from, props.filter.date.to)
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

export default Sales