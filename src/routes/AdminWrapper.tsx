import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAppSelector } from '../app/hooks'
import { selectIsAdmin } from '../utils/utilsSlice'

type Props = {
    children: React.ReactNode
}

const AdminWrapper = (props: Props) => {
    const isAdmin = useAppSelector(selectIsAdmin)
    if (isAdmin) {
        return <>{props.children}</>
    }
    return <Navigate to="/" />
}

export default AdminWrapper