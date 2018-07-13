import React from 'react';
import { Link } from 'react-router-dom';

const IconLink = ({ type, icon, url, clickEvent }) => {
    const linkClass = `icon-link ${ type || 'primary' }`;
    const iconClass = `fas fa-${ icon }`;
    
    return url
        ? <Link to={ url } className={ linkClass }><i className={ iconClass }></i></Link>
        : <a onClick={ clickEvent } className={ linkClass }><i className={ iconClass }></i></a>;
};

export default IconLink;