import React from 'react';
import { closeMessage } from '../../actions/flash';
import { connect } from 'react-redux';

class Flash extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { message, closeMessage } = this.props;
        
        return (
            <section className={ message ? 'flash-message' : 'invisible' }>
                <p>{ message }</p>
                <button onClick={ closeMessage }><i className="fas fa-times"></i></button>
            </section>
        );
    }
}

const mapStateToProps = state => {
    return { message: state.flash.message };
};

export default connect(mapStateToProps, { closeMessage })(Flash);