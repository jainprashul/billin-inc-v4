import { useLiveQuery } from 'dexie-react-hooks'
import moment from 'moment'
import React from 'react'
import { useAppDispatch } from '../../app/hooks'
import { Filter } from '../../components/shared/Filters'
import { getDatesBetween } from '../../utils'
import { useDataUtils } from '../../utils/useDataUtils'
import { setSalesData } from '../../utils/utilsSlice'


const useDashboard = () => {
    const { companyDB } = useDataUtils()
    const dispatch = useAppDispatch()
    const [filter, setFilter] = React.useState({
        date: {
            from: moment().startOf('day').toDate(),
            to: moment().endOf('day').toDate()
        },
    })
    const filterList : Filter[] = [
        {
            name: 'date',
            value : filter.date,
            component: 'date'
        }
    ]

    const handleFilterChange = (data : any) => {
        setFilter({
            ...filter,
            ...data
        })
    }


    const expenses = useLiveQuery(async () => {
        if (companyDB) {
            const expense = await companyDB?.expenses.where('date').between(filter.date.from, filter.date.to).toArray()
            return expense
        }
    }, [companyDB, filter], []) ?? []

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const invoices = useLiveQuery(async () => {
        if (companyDB) {
            const invoice = await companyDB?.invoices.where('billingDate').between(filter.date.from, filter.date.to).toArray()
            return invoice
        } else {
            console.log('no db')
        }
    }, [companyDB, filter], []) ?? []

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const purchase = useLiveQuery(async () => {
        if (companyDB) {
            const purchase = await companyDB?.purchases.where('billingDate').between(filter.date.from, filter.date.to).toArray()
            return purchase
        }
    }, [companyDB, filter], []) ?? []

        // count sales by date
        React.useMemo(() => {
            const dates = getDatesBetween(filter.date.from, filter.date?.to)
            let res = []
            for (let i = 0; i < invoices.length; i++) {
                const inv = invoices[i]
                const date = inv.billingDate.toLocaleDateString()
                const index = res.findIndex((item) => item.date === date)
                if (index === -1) {
                    res.push({
                        date,
                        salesCount: 1,
                        purchaseCount : 0,
                        sAmount: inv.totalAmount,
                        pAmount: 0
                    })
                } else {
                    res[index].salesCount += 1
                    res[index].sAmount += inv.totalAmount
                }
            }
    
            for (let i = 0; i < purchase.length; i++) {
                const pur = purchase[i]
                const date = pur.billingDate.toLocaleDateString()
                const index = res.findIndex((item) => item.date === date)
                if (index === -1) {
                    res.push({
                        date,
                        salesCount: 0,
                        purchaseCount : 1,
                        sAmount: 0,
                        pAmount: pur.totalAmount
                    })
                } else {
                    res[index].purchaseCount += 1
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
                const dateA = new Date(a.date);
                const dateB = new Date(b.date);
                return dateA.getTime() - dateB.getTime()
            })
            dispatch(setSalesData(res))
            // return res
        }, [dispatch, filter.date, invoices, purchase])
    

    return {
        filterList, 
        filter,
        handleFilterChange,
        expenses,
        invoices,
        purchase

    }
}

export default useDashboard