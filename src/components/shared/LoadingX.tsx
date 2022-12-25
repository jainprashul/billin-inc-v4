import * as React from 'react';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';


export default function LoadingX() {
    const { loading } = useLoading()
    if (!loading) return null;
    return (
        <div>
            <Backdrop
                sx={{ color: '#fff', zIndex: 99999 }}
                open={loading}
            >
                <CircularProgress color='inherit' />
            </Backdrop>
        </div>
    );
}

const LoadingContext = React.createContext({ loading: false, setLoading: (loading: boolean) => { } })

export const LoadingProvider = ({ children }: any) => {
    const [loading, setLoading] = React.useState(false)
    return (
        <LoadingContext.Provider value={{ loading, setLoading }}>
            {children}
        </LoadingContext.Provider>
    )
}

export const useLoading = () => {
    const { loading, setLoading } = React.useContext(LoadingContext)
    return { loading, setLoading }
}

