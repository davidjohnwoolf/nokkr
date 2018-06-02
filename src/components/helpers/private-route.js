import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

class PrivateRoute extends React.Component {
    
    render() {
        const { component: Component, authenticated, ...rest } = this.props;
        return (
            <Route { ...rest } render={ props =>
                    authenticated ? (
                        <Component { ...props } />
                    ) : (
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
};

const mapStateToProps = state => ({
    authenticated: state.auth.authenticated
});

export default connect(mapStateToProps)(PrivateRoute);