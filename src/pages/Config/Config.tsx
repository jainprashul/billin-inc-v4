import { Typography } from '@mui/material'
import React from 'react'
import { NotFound } from '../../components'

type Props = {}

const Config = (props: Props) => {

    const [show, ] = React.useState(false)

    React.useEffect(() => {
    }, [])

    if (!show) {
       return <NotFound />
    }
    return (
        <div>
            <Typography variant="h6">Internal Config</Typography>
        </div>
    )
}

export default Config