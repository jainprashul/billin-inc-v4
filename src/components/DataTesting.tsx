import React from 'react'
import { useTests } from './useTests';
import moment from 'moment';

type Props = {}

const DataTesting = (props: Props) => {
    const { data, createCompany, createUser, createInvoice, createPurchase, createClient, createLedger, createNotification, createExpense, createProduct, createStockLog, createStock
    } = useTests();
    

    return (
        <div>
            <h1>DB Tests</h1>
            <button onClick={createCompany}>Create Company</button>
            <ul>
                {
                    data?.companies.map(company => {
                        return <li key={company.id}><b>{company.name}</b>
                            <ul>
                                {
                                    company.contacts.map(contact => {
                                        return <li key={contact.id}>{contact.name}
                                            <ul>
                                                <li>{contact.email}</li>
                                                <li>{contact.phone}</li>
                                            </ul>
                                        </li>
                                    })
                                }
                            </ul>
                        </li>
                    })
                }
            </ul>
            <button onClick={createUser}>Create User</button>
            <ul>
                {data?.users.map((user) => {
                    return (
                        <li key={user.id}>
                            {user.name} - {user.username} - {user.email} - {user.role?.name}
                            <button onClick={() => user.delete()}>Delete</button>
                        </li>
                    )
                })}
            </ul>
            <button onClick={createInvoice}>Create Invoice</button>
            <ul>
                {data?.invoices?.map(invoice => (
                    <li key={invoice.id}>
                        {moment(invoice.billingDate).format('l')} - {invoice.voucherNo} - {invoice.discountValue} - {invoice.grossTotal} - {invoice.totalAmount} - {invoice.products.length}
                        <button onClick={() => invoice.delete()}>Delete</button>
                    </li>
                ))}
            </ul>
            <button onClick={createPurchase}>Create Purchase</button>
            <ul>
                {data?.purchases?.map(purchase => (
                    <li key={purchase.id}>
                        {moment(purchase.billingDate).format('l')} - {purchase.voucherNo} - #{purchase.companyID} {purchase.discountValue} - {purchase.grossTotal} - {purchase.totalAmount} - {purchase.products.length}
                        <button onClick={() => purchase.delete()}>Delete</button>
                    </li>
                ))}
            </ul>

            <button onClick={createClient}>Create Client</button>
            <ul>
                {data?.clients?.map(client => (
                    <li key={client.id}>
                        {client.name} - {client.details} - {client.gst}
                        <button onClick={() => client.delete()}>Delete</button>
                    </li>
                ))}
            </ul>

            <button onClick={createLedger}>Create Ledger</button>
            <ul>
                {data?.ledgers?.map(ledger => (
                    <li key={ledger.id}>
                        {moment(ledger.date).format('l')} - {ledger.voucherNo} - {ledger.clientID} - {ledger.credit} - {ledger.debit}
                        <button onClick={() => ledger.delete()}>Delete</button>
                    </li>
                ))}
            </ul>

            <button onClick={createExpense}>Create Expense</button>
            <ul>
                {data?.expenses?.map(expense => (
                    <li key={expense.id}>
                        {moment(expense.date).format('l')} - {expense.amount} - {expense.description}
                        <button onClick={() => expense.delete()}>Delete</button>
                    </li>
                ))}
            </ul>

            <button onClick={()=> {createProduct(data?.invoices[0].id as string)}}>Create Product</button>
            <ul>
                {data?.products?.map(product => (
                    <li key={product.id}>
                        {product.name} - {product.gstRate} - {product.unit}
                        <button onClick={() => product.delete()}>Delete</button>
                    </li>
                ))}
            </ul>

            <button onClick={createStockLog}>Create Stock Log</button>
            <ul>
                {data?.stockLogs?.map(stockLog => (
                    <li key={stockLog.id}>
                        {moment(stockLog.date).format('l')} - {stockLog.amount} - {stockLog.quantity} - {stockLog.voucherNo} - {stockLog.rate}
                        <button onClick={() => stockLog.delete()}>Delete</button>
                    </li>
                ))}
            </ul>

            <button onClick={createStock}>Create Stock</button>
            <ul>
                {data?.stocks?.map(stock => (
                    <li key={stock.id}>
                        {stock.gstRate} - {stock.quantity} - {stock.name}
                        <button onClick={() => stock.delete()}>Delete</button>
                    </li>
                ))}
            </ul>

            <button onClick={createNotification}>Create Notif</button>
            <ul>
                {data?.notifications?.map(notification => (
                    <li key={notification.id}>
                        {moment(notification.date).format('l')} - {notification.message} - {notification.link}
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default DataTesting