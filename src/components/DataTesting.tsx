import React from 'react'
import { useTests } from './useTests';
import moment from 'moment';

type Props = {}

const DataTesting = (props: Props) => {
    const { data, createCompany, createUser, createInvoice, createPurchase, createClient, createLedger, createNotification } = useTests();
    // console.log(data);
    
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
                {data?.users.map(user => (
                    <li key={user.id}>
                        {user.name} - {user.username} - {user.email}
                        <button onClick={() => user.delete()}>Delete</button>
                    </li>
                ))}
            </ul>
            <button onClick={createInvoice}>Create Invoice</button>
            <ul>
                {data?.invoices?.map(invoice => (
                    <li key={invoice.id}>
                        {moment(invoice.billingDate).format('ln')} - {invoice.voucherNo} - {invoice.discountValue } - {invoice.grossTotal} - {invoice.totalAmount}
                        <button onClick={() => invoice.delete()}>Delete</button>
                    </li>
                ))}
            </ul>
            <button onClick={createPurchase}>Create Purchase</button>
            <ul>
                {data?.purchases?.map(purchase => (
                    <li key={purchase.id}>
                        {moment(purchase.billingDate).format('ln')} - {purchase.voucherNo} - {purchase.discountValue } - {purchase.grossTotal} - {purchase.totalAmount}
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