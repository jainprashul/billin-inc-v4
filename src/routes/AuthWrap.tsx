import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAppSelector } from '../app/hooks'
import { selectIsLoggedIn } from '../utils/utilsSlice'

type Props = {
    children: React.ReactNode
}

const AuthWarp = (props: Props) => {
    const isAuthenticated = useAppSelector(selectIsLoggedIn)
    if (isAuthenticated) {
        return <>{props.children}</>
    }
    return <Navigate to="/" />
}
export default AuthWarp

export const withAuth = (Component: React.FC) => ({ ...props }) => (
    <AuthWarp>
        <Component {...props} />
    </AuthWarp>
)