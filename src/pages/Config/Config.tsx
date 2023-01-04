import { Button, Typography } from '@mui/material'
import React from 'react'
import { NotFound } from '../../components'
import { getConfig } from '../../services/database/db'
import { defaultConfig } from '../../services/database/model'

type Props = {}

const Config = (props: Props) => {

    const [show, ] = React.useState(true)

    React.useEffect(() => {
    }, [])

    function resetConfig() {
        defaultConfig.save();
    }

    function resetFirstTime(){
        localStorage.setItem('ft', JSON.stringify(true));
    }

    async function expireNow(){
        const confg = await getConfig()
        confg.lisenseValidTill = new Date()

        confg.save()
        
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

            <Button variant="contained" color="primary" onClick={() => {
                resetFirstTime();
            }}> Reset First Time </Button>

            <Button variant="contained" color="primary" onClick={() => {
                expireNow();
            }}> Expire Now </Button>
            
            
        </div>
    )
}

export default Config