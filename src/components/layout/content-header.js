import React from 'react';
import IconLink from '../layout/icon-link';

const ContentHeader = ({ history, title, chilrenAccess, children }) => {
    return (
        <header className="content-header">
            <IconLink clickEvent={ history.goBack } icon="arrow-left" />
            <h1>{ title }</h1>
            { chilrenAccess ? children : '' }
        </header>
    );
};

export default ContentHeader;