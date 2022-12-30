import { Card } from '@mui/material'
import React from 'react'
import { PieChart, Pie, Sector, ResponsiveContainer, Legend, Cell } from 'recharts'
import { useAppSelector } from '../../app/hooks'

import { selectPurchaseCount, selectSalesCount } from '../../utils/utilsSlice'

type Props = {
    width?: number | string
    height?: number | string
}

const SalesVSPurchaseGraph = ({  width='100%', height='100%'  }: Props) => {
    const [activeIndex, setActiveIndex] = React.useState(0);

    const onPieEnter = (data: any, index: number) => {
        setActiveIndex(index);
    };

    const sales = useAppSelector(selectSalesCount);
    const purchase = useAppSelector(selectPurchaseCount);

    const data = [
        { name: 'Sales', currentTotal : sales.amount, total: sales.totalAmount , color : '#00C49F'},
        { name: 'Purchase', currentTotal : purchase.amount, total: purchase.totalAmount , color : '#FFBB28' },
    ]


    const renderActiveShape = React.useCallback((props: any) => {
        const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value } = props;
        return (
            <g>
                <text x={cx} y={cy} dy={-130} textAnchor="middle" >
                    Sales VS Purchase
                </text>
    
                <text x={cx} y={cy} dy={14} textAnchor="middle" fill={fill}>
                {(percent * 100).toFixed(2)}%
                </text>
                <Sector
                    cx={cx}
                    cy={cy}
                    innerRadius={innerRadius}
                    outerRadius={outerRadius}
                    startAngle={startAngle}
                    endAngle={endAngle}
                    fill={fill}
                />
                <Sector
                    cx={cx}
                    cy={cy}
                    startAngle={startAngle}
                    endAngle={endAngle}
                    innerRadius={outerRadius + 6}
                    outerRadius={outerRadius + 10}
                    fill={fill}
                />
                <text x={cx} y={cy} dy={-4} textAnchor="middle" fill={fill}> 
                ₹ {value}
                </text>
    
                <text x={cx} y={cy} dy={120} textAnchor="middle" fill={fill}>
                    {payload.name}
                </text>
            </g>
        );
    }, []);
    
    return (
        <Card style={{
            minHeight: 300,
            height: height,
            maxHeight: 500,
            width: width,
        }}>
            
            <ResponsiveContainer width={'100%'}>
                <PieChart>
                    <Pie
                        activeIndex={activeIndex}
                        activeShape={renderActiveShape}
                        data={data}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={70}
                        fill="#8884d8"
                        dataKey="currentTotal" nameKey={'name'}
                        onMouseEnter={onPieEnter}
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                    </Pie>
                    {/* <Tooltip /> */}
                    <Legend align='center' allowReorder={'yes'} />
                </PieChart>
            </ResponsiveContainer>
        </Card>
    )
}

export default SalesVSPurchaseGraph