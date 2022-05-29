import React from 'react'
import '../styles/NotFound.css'
import { Link } from 'react-router-dom'

type Props = {}

const NotFound = (props: Props) => {
  return (
    <div data-testid="not-found-container" className='NotFound'>
        <h1>404  - Not Found</h1>
        <p>The page you are looking for does not exist. 
            <br/>
            <Link to='/'>Go back to the home page</Link>
        </p>
        

    </div>

  )
}

export default NotFound