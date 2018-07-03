import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

import ErrorBoundary from '../app/error-boundary';

import { SU, ADMIN, MANAGER, USER } from '../../../lib/constants';

class PrivateRoute extends React.Component {
    
    render() {
        const { component: Component, authenticated, access, role, ...rest } = this.props;
        
        const permitted = (function(a) {
            if (role === SU) return true;
            
            if (role === ADMIN && (a !== SU)) return true;
            
            if (role === MANAGER && (a !== SU) && (a !== ADMIN)) return true;
            
            if (role === USER && (a !== SU) && (a !== ADMIN) && (a !== MANAGER)) return true;
            
            return false;
        })(access);
        
        return (
            <Route { ...rest } render={ props =>
                    authenticated && permitted
                        ? (
                            <ErrorBoundary>
                                <Component { ...props } />
                            </ErrorBoundary>
                        )
                        : (
                            <Redirect
                                to={{
                                    pathname: '/not-authorized',
                                    state: { from: props.location }
                                }}
                            />
                        )
                }
            />
        );
    }
}

const mapStateToProps = state => ({
    authenticated: state.auth.authenticated,
    id: state.auth.id,
    role: state.auth.role,
    isReadOnly: state.auth.isReadOnly,
    team: state.auth.team
});

export default connect(mapStateToProps)(PrivateRoute);