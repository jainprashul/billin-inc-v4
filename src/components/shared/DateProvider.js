import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment'
import React from 'react'

const DateProvider = ({children}) => {
  return (
    <LocalizationProvider dateAdapter={AdapterMoment}>
        {children}
    </LocalizationProvider>
  )
}

export default DateProvider