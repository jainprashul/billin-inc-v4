import { useLiveQuery } from 'dexie-react-hooks'
import moment from 'moment'
import React from 'react'
import { Filter } from '../../components/shared/Filters'
import { useDataUtils } from '../../utils/useDataUtils'


const useDashboard = () => {
    const { companyDB } = useDataUtils()
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

    const invoices = useLiveQuery(async () => {
        if (companyDB) {
            const invoice = await companyDB?.invoices.where('billingDate').between(filter.date.from, filter.date.to).toArray()
            return invoice
        } else {
            console.log('no db')
        }
    }, [companyDB, filter], []) ?? []

    const purchase = useLiveQuery(async () => {
        if (companyDB) {
            const purchase = await companyDB?.purchases.where('billingDate').between(filter.date.from, filter.date.to).toArray()
            return purchase
        }
    }, [companyDB, filter], []) ?? []

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