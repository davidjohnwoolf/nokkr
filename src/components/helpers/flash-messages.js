import React from 'react';
import { closeMessage } from '../../actions/flash-messages';
import { connect } from 'react-redux';

export class FlashMessage extends React.Component {
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
    return { message: state.flashMessages.message };
};

export default connect(mapStateToProps, { closeMessage })(FlashMessage);