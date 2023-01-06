import { Login, Logout } from '@mui/icons-material'
import { Avatar, Button } from '@mui/material'
import React from 'react'
import { useGoogle } from '../../../utils/useGoogle'
import Lottie from 'lottie-react'
type Props = {}

const Auth = (props: Props) => {
  const { isSignedIn, user, signIn, signOut } = useGoogle();

  return (
    <div>
       <div style={{
        width: 450,
        float: 'right',
      }}>
        <Lottie
          animationData={require('../../../assets/auth.json')}
          loop={true}
          autoPlay={true}
          style={{ width: '100%', height: '100%' }}
        />
      </div>
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