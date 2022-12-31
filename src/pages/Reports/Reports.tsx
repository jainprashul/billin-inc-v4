import React from 'react'
import { PurchaseReport, SalesReport } from '.'
import CreateTab, { Panel } from '../../components/shared/CreateTab'

type Props = {}

const panels: Panel[] = [
    {
        name: "Purchase",
        content: () => (
            <PurchaseReport/>
        )
    },
    {
        name: "Sales",
        content: () => (
            <SalesReport/>
        )
    }

]

const Reports = (props: Props) => {
    const params = new URLSearchParams(window.location.search)
    const tabIndex = panels.indexOf(panels.find(panel => panel.name.toLowerCase() === params.get("tab")) ?? panels[0])
    return (
        <div id="setting" className="setting">
            <CreateTab panels={panels} tabIndex={tabIndex}/>
        </div>
    )
}

export default Reports