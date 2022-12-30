import React from 'react'

type Props = {}

const Time = (props: Props) => {
    const [time, setTime] = React.useState<Date>(new Date())
    React.useEffect(() => {
        const interval = setInterval(() => {
            setTime(new Date())
        }, 1000)
        return () => clearInterval(interval)
    }, [])
  return (
    <div>
        {time.toLocaleTimeString()}
    </div>
  )
}

export default Time