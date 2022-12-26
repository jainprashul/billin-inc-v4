import { Button } from '@mui/material'
import { useLiveQuery } from 'dexie-react-hooks'
import React from 'react'
import { UserCreate } from '.'
import db from '../../../services/database/db'
import UserTable from './UserTable'

type Props = {}

const User = (props: Props) => {
  const [open , setOpen] = React.useState(false)
  const users = useLiveQuery(async ()=> {
    const users = await Promise.all((await db.users.toArray()).map(async (user) => {
      await user.loadRole()
      return user
    }))
    return users
  }) ?? []

  return (
    <div id='user-page'>
      <div className='float-right'>
      <Button variant='contained' onClick={()=> {setOpen(true)}} color='primary' >Add User</Button>
      </div>
      <br />
      <br />
    <UserTable data={users} />
    {open && <UserCreate open={open} setOpen={setOpen} />}
    </div>
  )
}

export default User