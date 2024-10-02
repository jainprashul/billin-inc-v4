import { Card, Typography } from '@mui/material'
import { Bar, BarChart, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { useAppSelector } from '../../app/hooks'
import { selectTop5Selling } from '../../utils/utilsSlice'

type Props = {
    width?: number | string
    height?: number | string
}

const TopSellingProducts = ({ width = '100%', height = '100%' }: Props) => {
    const data = useAppSelector(selectTop5Selling)

    return (
        <Card style={{
            minHeight: 300,
            height: height,
            maxHeight: 500,
            width: width,
        }}>
            <Typography textAlign={'center'} mt={1} variant="body1">Top Selling Products</Typography>
            <ResponsiveContainer>
                <BarChart data={data}
                layout='vertical'
                 margin={{
                    left: 0,
                    right: 30,
                    top: 20,
                    bottom: 36,
                }} >
                    <YAxis type='category' dataKey={'name'} tick={false}  />
                    <XAxis type='number' />
                    <Tooltip />
                    <Legend align='center' />
                    <Bar dataKey="quantity" name='Quantity' fill={'#53439a'} label={{
                        position: 'bottom',
                        // fill: '#fff',
                        // @ts-expect-error - recharts types are wrong
                        // eslint-disable-next-line react/prop-types
                        valueAccessor: (props) => { console.log(props); return props.name }
                    }}/>
                </BarChart>
            </ResponsiveContainer>
        </Card>
    )
}

export default TopSellingProducts