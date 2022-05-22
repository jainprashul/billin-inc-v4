import React from 'react'
import { useTests } from './useTests';

type Props = {}

const DataTesting = (props: Props) => {
    const { createCompany, createUser, data } = useTests();
    console.log(data);
    
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
                    </li>
                ))}
            </ul>

        </div>
    )
}

export default DataTesting