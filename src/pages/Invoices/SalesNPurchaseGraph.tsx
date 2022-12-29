import { Card } from '@mui/material'
import {  Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { useAppSelector } from '../../app/hooks'
import { getRandomColor } from '../../utils'
import { selectSalesData } from '../../utils/utilsSlice'

type Props = {
    
    width?: number | string
    height?: number | string

}

const SalesNPurchaseGraph = ({ width = '100%', height = '100%' }: Props) => {
    const salesData = useAppSelector(selectSalesData)

    return (
        <Card style={{
            minHeight: 300,
            height: height,
            maxHeight: 500,
            width: width,
            minWidth: 600,
        }}>
            <ResponsiveContainer>
                <LineChart data={salesData} margin={{
                    left: 0,
                    right: 30,
                    top: 10,
                }} >
                    <XAxis dataKey="date" />
                    <YAxis   />
                    <Tooltip />
                    <Legend align='center' />
                    <Line type={'monotone'} dataKey="sAmount" name='Sales Amount' accumulate='sum' stroke={getRandomColor()} />
                    <Line type={'monotone'} dataKey="pAmount" name='Purchase Amount' accumulate='sum' stroke={getRandomColor()} />
                </LineChart>
            </ResponsiveContainer>
        </Card>
    )
}

export default SalesNPurchaseGraph

