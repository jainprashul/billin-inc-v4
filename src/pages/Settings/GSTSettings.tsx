import { FormControlLabel, Switch } from '@mui/material'
import React from 'react'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { selectGstRateType, setGstRateInclusive } from '../../utils/utilsSlice'

type Props = {}

const GSTSettings = (props: Props) => {
    const isInclusive = useAppSelector(selectGstRateType)
    const dispatch = useAppDispatch();
    return (
        <div>
            <FormControlLabel
                label={isInclusive ? "Inclusive GST Rate" : "Exclusive GST Rate"}
                control={
                    <Switch
                        checked={isInclusive}
                        onChange={(e, value) => {
                            dispatch(setGstRateInclusive(value))
                        }}
                    />
                }
            />
        </div>
    )
}

export default GSTSettings