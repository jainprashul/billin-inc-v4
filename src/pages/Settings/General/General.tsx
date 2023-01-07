import React from 'react'
import GSTSettings from './GSTSettings'
import UPI from './UPI'

type Props = {}

const General = (props: Props) => {

  return (
    <div>
      <GSTSettings/>
      <UPI/>
    </div>
  )
}

export default General