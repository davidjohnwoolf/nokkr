import React from 'react';

import ReactError from '../errors/react-error';

class ErrorBoundary extends React.Component {

    state = { hasError: false };
    
    componentDidCatch() {
        //display error
        this.setState({ hasError: true });
    }
    
    render() {
        if (this.state.hasError) return <ReactError />;
        
        return this.props.children;
    }
}

export default ErrorBoundary;