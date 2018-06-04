import React from 'react';
import ReactError from '../errors/react-error'

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }
    
    componentDidCatch(error, info) {
        console.log('error')
        console.log(error)
        console.log('=======')
        console.log('info')
        console.log(info)
        
        //display error
        this.setState({ hasError: true });
    }
    
    render() {
        if (this.state.hasError) return <ReactError />;
        
        return this.props.children;
    }
}

export default ErrorBoundary;