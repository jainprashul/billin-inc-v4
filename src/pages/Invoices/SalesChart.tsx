import { Card } from '@mui/material'
import { Bar, BarChart, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { useAppSelector } from '../../app/hooks'
import { getRandomColor } from '../../utils'
import { selectSalesData } from '../../utils/utilsSlice'

type Props = {
    width?: number | string
    height?: number | string
}

const SalesChart = ({  width = '100%', height = '100%'}: Props) => {
    const salesData = useAppSelector(selectSalesData)
    return (
        <Card style={{
            minHeight: 300,
            height: height,
            maxHeight: 500,
            width: width,
        }}>
            <ResponsiveContainer>
                <BarChart data={salesData} margin={{
                    left: 0,
                    right: 30,
                    top: 10,
                }} >
                    <XAxis dataKey="date" />
                    <YAxis   />
                    <Tooltip />
                    <Legend align='right' />
                    <Bar dataKey="salesCount" name='Sales' accumulate='sum' fill={getRandomColor()} />
                    <Bar dataKey="purchaseCount" name='Purchase' accumulate='sum' fill={getRandomColor()} />
                </BarChart>
            </ResponsiveContainer>
        </Card>
    )
}

export default SalesChart

