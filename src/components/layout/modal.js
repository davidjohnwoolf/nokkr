import React from 'react';

const Modal = ({ close, shown, title, children }) => {
    return (
        <div>
            <div className={ `modal-overlay ${ !shown ? 'invisible' : '' }` } onClick={ close }></div>
            <section className={ `modal ${ !shown ? 'invisible' : '' }` }>
                <header className="modal-header">
                    <h2>{ title }</h2>
                    <button onClick={ close } className="modal-close"><i className="fas fa-times"></i></button>
                </header>
                {children}
            </section>
        </div>
    );
};

export default Modal;