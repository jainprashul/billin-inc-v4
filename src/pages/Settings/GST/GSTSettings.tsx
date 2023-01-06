import { FormControlLabel, Switch } from '@mui/material'
import React from 'react'
import { useAppDispatch, useAppSelector } from '../../../app/hooks'
import { selectGstEnabled, selectGstRateType, setGstEnabled, setGstRateInclusive } from '../../../utils/utilsSlice'
import Lottie from 'lottie-react'

type Props = {}

const GSTSettings = (props: Props) => {
    const isInclusive = useAppSelector(selectGstRateType)
    const gstEnabled = useAppSelector(selectGstEnabled)
    const dispatch = useAppDispatch();
    return (
        <div id="GSTSettings">
            
      <div style={{
        width: 300,
        float: 'right',
      }}>
        <Lottie
          animationData={require('../../../assets/settings.json')}
          loop={true}
          autoPlay={true}
          style={{ width: '100%', height: '100%' }}
        />
      </div>
        <div style={{
            display: 'flex',
            flexDirection: 'column',
        }}>
            <FormControlLabel
                label={gstEnabled ? "GST Enabled" : "GST Disabled"}
                control={
                    <Switch
                        checked={gstEnabled}
                        onChange={(e, value) => {
                            dispatch(setGstEnabled(value))
                        }}
                    />
                }
            />
            {
                gstEnabled && <FormControlLabel
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
            }
        </div>
        </div>
    )
}

export default GSTSettings