import { Button, Typography } from '@mui/material'
import React from 'react'
import { NotFound } from '../../components'
import { defaultConfig } from '../../services/database/model'

type Props = {}

const Config = (props: Props) => {

    const [show, ] = React.useState(true)

    React.useEffect(() => {
    }, [])

    function resetConfig() {
        defaultConfig.save();
    }

    if (!show) {
       return <NotFound />
    }
    return (
        <div>
            <Typography variant="h6">Internal Config</Typography>
            <Button variant="contained" color="primary" onClick={() => {
                resetConfig();
            }}> Reset Config </Button>
            
        </div>
    )
}

export default Config