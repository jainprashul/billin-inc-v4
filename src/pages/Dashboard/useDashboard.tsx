import { useLiveQuery } from 'dexie-react-hooks'
import moment from 'moment'
import React, {useEffect} from 'react'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { Filter } from '../../components/shared/Filters'
import { useLoading } from '../../components/shared/LoadingX'
import { getDatesBetween } from '../../utils'
import { useDataUtils } from '../../utils/useDataUtils'
import { selectSalesData, setCount, setSalesData } from '../../utils/utilsSlice'


const useDashboard = () => {
    const { companyDB } = useDataUtils()
    const dispatch = useAppDispatch()
    const salesData = useAppSelector(selectSalesData);

    const { setLoading } = useLoading()
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
        React.useEffect(() => {
            setLoading(true)
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
            setLoading(false)

           
        // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [dispatch, filter.date, invoices.length, purchase.length])

        const SalesCount = async( from : Date, to: Date) => {
            const total = await companyDB?.invoices.count() ?? 0
            const currentCount = await companyDB?.invoices.where('billingDate').between(from, to).count() ?? 0
            const deltaPercent = ((-(currentCount - total) / total) * 100).toFixed(2)
            console.log('sakes', salesData)
            const currentAmount = (salesData.reduce((a, b) => a + b.sAmount, 0)).toFixed(2)
            const totalAmount = (await companyDB?.invoices.toArray() ?? []).reduce((a, b) => a + b.totalAmount, 0)
            
            console.log(total, currentCount, deltaPercent)
            return {
                total,
                count : currentCount,
                amount : currentAmount,
                totalAmount,
                deltaPercent
            }
        }

        const PurchaseCount = async( from : Date, to: Date) => {
            const total = await companyDB?.purchases.count() ?? 0
            const currentCount = await companyDB?.purchases.where('billingDate').between(from, to).count() ?? 0
            const deltaPercent = ((-(currentCount - total) / total) * 100 ).toFixed(2)

            const currentAmount = (salesData.map((item) => item.pAmount).reduce((a, b) => a + b, 0)).toFixed(2)
            const totalAmount = (await companyDB?.purchases.toArray() ?? []).reduce((a, b) => a + b.totalAmount, 0).toFixed(2)
            
            return{
                total,
                count : currentCount,
                amount : currentAmount,
                totalAmount,
                deltaPercent
            }
        }

        const ExpenseCount = async( from : Date, to: Date) => {
            const total = await companyDB?.expenses.count() ?? 0
            const currentCount = await companyDB?.expenses.where('date').between(from, to).count() ?? 0
            const deltaPercent = ((-(currentCount - total) / total) * 100).toFixed(2)

            const currentAmount = (await companyDB?.expenses.where('date').between(from, to).toArray() ?? []).reduce((a, b) => a + b.amount, 0).toFixed(2)
            const totalAmount = (await companyDB?.expenses.toArray() ?? []).reduce((a, b) => a + b.amount, 0).toFixed(2)

            return{
                total,
                count : currentCount,
                amount : currentAmount,
                totalAmount,
                deltaPercent
            }
        }

        useEffect(() => {
            setLoading(true)
            async function getCount(){
                const sales = await SalesCount(filter.date.from, filter.date.to)
                const purchase = await PurchaseCount(filter.date.from, filter.date.to)
                const expenses = await ExpenseCount(filter.date.from, filter.date.to)
                return {
                    sales,
                    purchase,
                    expenses
                }
            }
            getCount().then((res) => {
                console.log(res)
                dispatch(setCount(res))
                setLoading(false)
            })
        // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [filter.date, companyDB, salesData])


    return { companyDB,
        filterList, 
        filter,
        handleFilterChange,
        expenses,
        invoices,
        purchase, SalesCount, PurchaseCount
    }
}

export default useDashboard