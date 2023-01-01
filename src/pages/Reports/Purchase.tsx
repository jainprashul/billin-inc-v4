import MaterialTable, { Column } from '@material-table/core'
import React, { useEffect } from 'react'
import { getGSTPurchases, GSTINFO, generateGSTReportData, getReportSheet } from '../../services/analytics/GST'
import { useDataUtils } from '../../utils/useDataUtils'
import UploadFileIcon from '@mui/icons-material/UploadFile';

type Props = {
  filter: {
    date: {
      from: Date;
      to: Date;
    }
  }
}

const Purchase = ({ filter }: Props) => {

  const { companyDB } = useDataUtils()
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
        const data = await getGSTPurchases(companyDB, filter.date.from, filter.date.to);
        const report = await generateGSTReportData(data)
        setData(report)
        setLoading(false)
      }
    }
    getPurchaseReport()
  }, [companyDB, filter.date])

  return (
    <div style={{
      width: '140%',
      marginLeft: '-20%'
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