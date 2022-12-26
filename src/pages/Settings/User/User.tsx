import { useLiveQuery } from 'dexie-react-hooks'
import React from 'react'
import db from '../../../services/database/db'
import UserTable from './UserTable'

type Props = {}

const User = (props: Props) => {
  const users = useLiveQuery(async ()=> {
    const users = await Promise.all((await db.users.toArray()).map(async (user) => {
      await user.loadRole()
      return user
    }))
    return users
  }) ?? []

  console.log('users', users)
  return (
    <UserTable data={users} />
  )
}

export default User