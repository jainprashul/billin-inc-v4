import { Card } from '@mui/material'
import React from 'react'
import { Bar, BarChart, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { Purchase } from '../../services/database/model'
import { Invoice } from '../../services/database/model/Invoices'
import { getDatesBetween, getRandomColor } from '../../utils'

type Props = {
    data: {
        invoices: Invoice[]
        purchases : Purchase[]
    },
    
    width?: number | string
    height?: number | string
    date?: {
        from: Date
        to: Date
    }
}

const SalesChart = ({ data, width = '100%', height = '100%', date={
    from: new Date(),
    to: new Date()
}}: Props) => {


    // count sales by date
    const salesCountByDate = React.useMemo(() => {
        const dates = getDatesBetween(date?.from, date?.to)
        let res = []
        for (let i = 0; i < data.invoices.length; i++) {
            const inv = data.invoices[i]
            const date = inv.billingDate.toLocaleDateString()
            const index = res.findIndex((item) => item.date === date)
            if (index === -1) {
                res.push({
                    date,
                    salesCount: 1,
                    purchasesCount : 0,
                    sAmount: inv.totalAmount,
                    pAmount: 0
                })
            } else {
                res[index].salesCount += 1
                res[index].sAmount += inv.totalAmount
            }
        }

        for (let i = 0; i < data.purchases.length; i++) {
            const pur = data.purchases[i]
            const date = pur.billingDate.toLocaleDateString()
            const index = res.findIndex((item) => item.date === date)
            if (index === -1) {
                res.push({
                    date,
                    salesCount: 0,
                    purchasesCount : 1,
                    sAmount: 0,
                    pAmount: pur.totalAmount
                })
            } else {
                res[index].purchasesCount += 1
                res[index].pAmount += pur.totalAmount
            }
        }

        // add dates with no sales
        for (let i = 0; i < dates.length; i++) {
            const date = dates[i].toLocaleDateString()
            const index = res.findIndex((item) => item.date === date)
            if (index === -1) {
                res.push({
                    date,
                    salesCount: 0,
                    purchaseCount : 0,
                    sAmount: 0,
                    pAmount: 0
                })
            }
        }
        // sort by date
        res.sort((a, b) => {
            const dateA = new Date(a.date)
            const dateB = new Date(b.date)
            return dateA.getTime() - dateB.getTime()
        })

        return res
    }, [data, date])

    return (
        <Card style={{
            minHeight: 300,
            height: height,
            maxHeight: 500,
            width: width,
        }}>
            <ResponsiveContainer>
                <BarChart data={salesCountByDate} margin={{
                    left: 0,
                    right: 30,
                    top: 10,
                }} >
                    <XAxis dataKey="date" />
                    <YAxis   />
                    <Tooltip />
                    <Legend align='right' />
                    <Bar dataKey="salesCount" accumulate='sum' fill={getRandomColor()} />
                    <Bar dataKey="purchasesCount" accumulate='sum' fill={getRandomColor()} />
                </BarChart>
            </ResponsiveContainer>
        </Card>
    )
}

export default SalesChart

