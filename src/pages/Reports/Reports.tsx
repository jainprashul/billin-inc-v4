import moment from 'moment'
import React from 'react'
import { PurchaseReport, SalesReport } from '.'
import CreateTab, { Panel } from '../../components/shared/CreateTab'
import Filters, { Filter } from '../../components/shared/Filters'
import Adjustments from './Adjustments'

type Props = {}

const filter = {
    date: {
        from: moment().startOf('week').toDate(),
        to: moment().endOf('week').toDate()
    }
}

const FiterList : Filter[] = [
    {
        component: "date",
        name: "date",
        default: 'thisWeek',
        value: filter.date
    }
]

const Reports = (props: Props) => {
    
    const [filters, setFilters] = React.useState(filter)
    const params = new URLSearchParams(window.location.search)

    const panels: Panel[] = [
        {
            name: "Purchase",
            content: () => (
                <PurchaseReport filter={filters}/>
            )
        },
        {
            name: "Sales",
            content: () => (
                <SalesReport filter={filters}/>
            )
        },{
            name: "Adjustment",
            content: () => (
                <Adjustments filter={filters}/>
            )
        }
    ]

    const tabIndex = panels.indexOf(panels.find(panel => panel.name.toLowerCase() === params.get("tab")) ?? panels[0])
    return (
        <div id="setting" className="setting">

            <CreateTab panels={panels} tabIndex={tabIndex}>
            <Filters filters={FiterList} getFilters={(f)=> setFilters(f)}/>

            </CreateTab>
        </div>
    )
}

export default Reports