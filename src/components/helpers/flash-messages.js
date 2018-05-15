import React from 'react';
import { sendMessage, closeMessage } from '../../actions/flash-messages';
import { connect } from 'react-redux';

class FlashMessage extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { message, closeMessage } = this.props;
        
        return (
            <section className={ message ? 'section' : 'is-invisible' }>
                <div className="container">
                    <div className="notification is-primary">
                        <button className="delete" onClick={ closeMessage }></button>
                        { message }
                    </div>
                </div>
            </section>
        );
    }
}

const mapStateToProps = state => {
    return { message: state.flashMessages.message };
};

export default connect(mapStateToProps, { closeMessage })(FlashMessage);