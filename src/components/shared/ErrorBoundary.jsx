import { Alert, Button, Typography } from "@mui/material";
import React from "react";
import error from '../../assets/error.png';


export default class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error) {
        // Update state so the next render will show the fallback UI.
        return {
            hasError: true,
            error: error
        };
    }

    componentDidCatch(error, errorInfo) {
        // You can also log the error to an error reporting service
        // logErrorToMyService(error, errorInfo);
        console.log('render failed', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            // You can render any custom fallback UI
            return (
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '80vh'
                }}>
                    
                    <img src={error} height={200}  alt="error" />
                    <Typography variant="h4" >
                        Something went wrong.
                    </Typography>
                    <br/>

                    
                    <Alert severity="error">
                        {this.state.error.message}
                    </Alert>
                    <br/>

                    <Button variant="contained" color="primary" onClick={() => {
                        window.location.href = '/';
                    }}>
                        Go Back to Home
                    </Button>
                    
                </div>
            )
        }

        // eslint-disable-next-line react/prop-types
        return this.props.children;
    }
}