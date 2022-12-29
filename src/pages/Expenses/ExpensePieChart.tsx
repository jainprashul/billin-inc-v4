import { Card } from '@mui/material'
import React from 'react'
import { PieChart, Pie, Sector, ResponsiveContainer, Legend, Cell } from 'recharts'
import { ExpenseModes } from '../../constants'
import { Expense } from '../../services/database/model'
import { getRandomColor } from '../../utils'

type Props = {
    data: Expense[]
    width?: number | string
    height?: number | string
}

const ExpensePieChart = ({ data, width='100%', height='100%'  }: Props) => {
    const [activeIndex, setActiveIndex] = React.useState(0);

    const onPieEnter = (data: any, index: number) => {
        setActiveIndex(index);
    };

    const res = React.useMemo(() => convertDataByExpenseMode(data), [data])
    const totalExpenses = React.useMemo(() => (data.reduce((acc, curr) => {
        return acc + curr.amount
    }, 0)), [data])

    const renderActiveShape = React.useCallback((props: any) => {
        const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value } = props;
        return (
            <g>
                <text x={cx} y={cy} dy={-130} textAnchor="middle" >
                    Total Expenses : ₹ {totalExpenses}
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
                    {payload.expenseMode}
                </text>
            </g>
        );
    }, [totalExpenses]);
    
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
                        data={res}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={70}
                        fill="#8884d8"
                        dataKey="amount" nameKey={'expenseMode'}
                        onMouseEnter={onPieEnter}
                    >
                        {res.map((entry, index) => (
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

export default ExpensePieChart

function convertDataByExpenseMode(data: Expense[]) {
    const res: {
        expenseMode: string,
        amount: number,
        color: string
    }[] = []
    data.forEach((expense) => {
        let modeExists = res.some((item) => item.expenseMode === expense.expenseMode)
        if (modeExists) {
            let index = res.findIndex((item) => item.expenseMode === expense.expenseMode)
            res[index].amount += expense.amount
        } else {
            res.push({
                expenseMode: ExpenseModes.find((item) => item.value === expense.expenseMode)?.value!,
                amount: expense.amount,
                color: getRandomColor()
            })
        }
    })
    return res
}

