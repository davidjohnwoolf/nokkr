import React from 'react';
import { closeMessage } from '../../actions/flash.action';
import { connect } from 'react-redux';

class Flash extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { message, closeMessage, error } = this.props;
        
        let classNames;
        
        if (message) {
            classNames = error ? 'flash flash-error' : 'flash flash-message';
        } else {
            classNames = 'invisible';
        }
        
        return (
            <section className={ classNames }>
                <p>{ message }</p>
                <button onClick={ closeMessage }><i className="fas fa-times"></i></button>
            </section>
        );
    }
}

const mapStateToProps = state => {
    return { message: state.flash.message, error: state.flash.error };
};

export default connect(mapStateToProps, { closeMessage })(Flash);