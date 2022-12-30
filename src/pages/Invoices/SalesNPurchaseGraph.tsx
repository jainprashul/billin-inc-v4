import { Card, Typography } from '@mui/material'
import { Area, AreaChart, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { useAppSelector } from '../../app/hooks'
import { getRandomColor } from '../../utils'
import { selectSalesData } from '../../utils/utilsSlice'

type Props = {

    width?: number | string
    height?: number | string

}

const colors = [getRandomColor(), getRandomColor()]

const SalesNPurchaseGraph = ({ width = '100%', height = '100%' }: Props) => {
    const salesData = useAppSelector(selectSalesData)


    return (
        <Card style={{
            minHeight: 250,
            height: height,
            maxHeight: 500,
            width: width,
            minWidth: 400,
        }}>
            <Typography textAlign={'center'} mt={1} variant="body1">Sales & Purchase </Typography>
            <ResponsiveContainer>
                <AreaChart data={salesData} margin={{
                    left: 0,
                    right: 30,
                    top: 20,
                    bottom: 36,
                }} >
                    <defs>
                        <linearGradient id="color1" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={colors[0]} stopOpacity={0.8} />
                            <stop offset="95%" stopColor={colors[0]} stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="color2" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={colors[1]} stopOpacity={0.8} />
                            <stop offset="95%" stopColor={colors[1]} stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend align='center' />
                    <Area type={'monotone'} dataKey="sAmount" name='Sales Amount' accumulate='sum' stroke={colors[0]} fill={"url(#color1)"} />
                    <Area type={'monotone'} dataKey="pAmount" name='Purchase Amount' accumulate='sum' stroke={colors[1]} fill={"url(#color2)"} />
                </AreaChart>
            </ResponsiveContainer>
        </Card>
    )
}

export default SalesNPurchaseGraph

