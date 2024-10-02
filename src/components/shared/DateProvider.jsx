import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment'
import React from 'react'

// eslint-disable-next-line react/prop-types
const DateProvider = ({children}) => {
  return (
    <LocalizationProvider dateAdapter={AdapterMoment}>
        {children}
    </LocalizationProvider>
  )
}

export default DateProvider