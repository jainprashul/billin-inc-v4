import { Login, Logout } from '@mui/icons-material'
import { Avatar, Button } from '@mui/material'
import React from 'react'
import { useGoogle } from '../../utils/useGoogle'

type Props = {}

const Auth = (props: Props) => {
  const { isSignedIn, user, signIn, signOut } = useGoogle();

  return (
    <div>
      {
        isSignedIn ? (<>
          Google Account Sign in as :
          <div style={{ display: "flex", alignItems: "center", padding: 4, margin: 2 }}>
            <Avatar src={user?.getImageUrl()} />
            <span style={{ marginLeft: "10px" }}>{user?.getName()}</span>
          </div>
          <Button onClick={signOut} startIcon={<Logout />}>Sign Out</Button>
        </>
        ) : (
          <Button onClick={signIn} startIcon={<Login />}>Sign In</Button>
        )
      }
    </div>
  )
}

export default Auth